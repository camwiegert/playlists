import { fetchWithAuth } from './auth';

const {
    SPOTIFY_USERNAME
} = process.env;

const playlistsEndpoint = `https://api.spotify.com/v1/users/${SPOTIFY_USERNAME}/playlists?limit=50`;

export function getPlaylists() {
    return fetchAll(playlistsEndpoint);
}

export function getTracks(playlist) {
    return fetchAll(playlist.tracks.href).then(tracks => tracks.map(toTrack));
}

function toTrack({ track }) {
    return {
        title: track.name,
        album: track.album.name,
        artist: track.artists.map(a => a.name)
    }
};

async function fetchAll(url) {
    const { items, next } = await fetchWithAuth(url).then(validateFetch);

    if (next) {
        const more = await fetchAll(next);
        return [...items, ...more];
    }

    return items;
}

function validateFetch(response) {
    if (response.ok) {
        return response.json();
    }

    throw new Error(`Failed to fetch ${response.url}: ${response.statusText}`);
}
