require('dotenv').config();

const fs = require('fs');
const qs = require('querystring');
const path = require('path');
const slug = require('slug');
const chalk = require('chalk');
const rimraf = require('rimraf');
const request = require('axios').create({
  baseURL: 'https://api.spotify.com/v1/'
});

const {
  CLIENT_ID,
  CLIENT_SECRET,
  USERNAME
} = process.env;


const report = (err, msg) => {
  if (err) {
    console.log(chalk.red(err.message));
  } else if (msg) {
    console.log(chalk.green(msg));
  }
}


/**
 * Get an access token from Spotify and resolve with an
 * authorization header.
 */
const auth = () => request({
  method: 'POST',
  url: 'https://accounts.spotify.com/api/token',
  data: qs.stringify({
    'grant_type': 'client_credentials'
  }),
  headers: {
    'Authorization': `Basic ${Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64')}`
  }
}).then(res => ({
  'Authorization': `Bearer ${res.data.access_token}`
}));


/**
 * Generic accumulator for multi-page API responses.
 */
async function accumulate(endpoint, items = []) {
  const authHeaders = await auth();
  return request(endpoint, { headers: authHeaders })
    .then(res => {
      items = items.concat(res.data.items);
      if (!res.data.next) {
        return items;
      }
      return accumulate(res.data.next, items);
    });
}


async function getUserPlaylists(username) {
  const playlists = await accumulate(`users/${username}/playlists?limit=50`);
  report(null, `\nArchiving ${playlists.length} playlists for user ${USERNAME}\n`);
  return playlists;
}


async function getPlaylistTracks(playlist) {
  const authHeaders = await auth();
  return request(playlist.tracks.href, { headers: authHeaders })
    .then(res => {
      playlist.tracks = res.data.items;
      return playlist;
    });
}


const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function getAllPlaylistsTracks(playlists) {
  return Promise.all(playlists.map(async (playlist, index) => {
    // Spotify API rate limiting
    await sleep(index * 200);
    return getPlaylistTracks(playlist);
  }));
}


function stripExtraneousInfo(playlist) {
  return {
    name: playlist.name,
    tracks: playlist.tracks
      .map(item => item.track)
      .map(track => ({
        name: track.name,
        album: track.album.name,
        artists: track.artists.map(artist => artist.name)
      }))
  };
}

/**
 * I name my playlists like 08.09.10. This pads zeros to keep
 * filenames of that pattern consistent.
 */
function normalizePlaylistName(name) {
  if (/\d+\.\d+\.\d+/.test(name)) {
    return name.split('.')
      .map(segment => segment.length < 2 ? `0${segment}` : segment)
      .join('.');
  }
  return name;
}


const slugOptions = {
  lower: true,
  mode: 'rfc3986'
};

function writePlaylistFile(playlist) {
  const filename = normalizePlaylistName(playlist.name);
  fs.writeFile(
    path.resolve(`./playlists/${slug(filename, slugOptions)}.json`),
    JSON.stringify(playlist, null, 4),
    err => report(err, `✔ ${playlist.name}`)
  );
}


rimraf(path.resolve('./playlists/*'), report);

getUserPlaylists(USERNAME)
  .then(getAllPlaylistsTracks)
  .then(playlists => playlists.map(stripExtraneousInfo))
  .then(playlists => playlists.forEach(writePlaylistFile))
  .catch(report);
