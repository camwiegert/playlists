import { getPlaylists, getTracks } from './playlists';
import { writeJson } from 'fs-extra';
import { resolve } from 'path';
import meow from 'meow';
import ora from 'ora';

const cli = meow(`
Usage
  $ spotify-playlist-archive <path> [options]

Options
  --indent  Output indentation width (default: 2)
  --help    Show help text

Description
  Reads the Spotify playlists of a given user and
  outputs them as a JSON file at the given path.

  Several environment variables are required:

    SPOTIFY_USERNAME
    SPOTIFY_CLIENT_ID
    SPOTIFY_CLIENT_SECRET

  These can be obtained by logging into the Spotify
  developer dashboard.
`, {
    flags: {
       indent: {
           default: 2,
           type: 'number'
       }
    }
});

const {
    SPOTIFY_USERNAME,
    SPOTIFY_CLIENT_ID,
    SPOTIFY_CLIENT_SECRET
} = process.env;

const hasEnv = SPOTIFY_USERNAME && SPOTIFY_CLIENT_ID && SPOTIFY_CLIENT_SECRET;

const [path] = cli.input;

if (!hasEnv || !path) {
    cli.showHelp(1);
}

run().catch(console.error);

async function run() {
    const spinner = ora('Fetching playlists').start();
    const playlists = await getPlaylists();
    const outputPath = resolve(process.cwd(), path);
    const output = [];

    spinner
        .succeed(`Fetched ${playlists.length} playlists for ${SPOTIFY_USERNAME}`)
        .start('Fetching tracks');

    for (const playlist of playlists) {
        await wait(20);
        spinner.start(`Fetching tracks (${output.length}/${playlists.length})`);
        output.push({
            name: playlist.name,
            tracks: await getTracks(playlist)
        });
    }

    spinner.succeed(`Fetched ${output.reduce(sumTrackCount, 0)} tracks from ${playlists.length} playlists`);

    await writeJson(outputPath, {
        username: SPOTIFY_USERNAME,
        timestamp: new Date().toISOString(),
        playlists: output
    }, { spaces: cli.flags.indent });

    spinner.succeed(`Wrote to ${outputPath}`);
}

async function wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function sumTrackCount(count = 0, playlist) {
    return count + playlist.tracks.length;
}
