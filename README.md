# Spotify Playlist Archive

This is an archive of my Spotify playlists and the tooling to generate it. All you need is some [Spotify API client credentials](https://developer.spotify.com/my-applications), your username, and Node 8+.

## Install

```sh
npm install
```

## Usage

```sh
node bin/ output-path.json
```

You'll need to provide three environment variables:

| Environment Variable | Value                     |
| ---------------------|---------------------------|
| `SPOTIFY_USERNAME`           | Spotify username          |
| `SPOTIFY_CLIENT_ID`          | Spotify API client ID     |
| `SPOTIFY_CLIENT_SECRET`      | Spotify API client secret |

There are many ways to pass them, but the simplest is to pass them directly:

```sh
SPOTIFY_USERNAME=camwiegert \
SPOTIFY_CLIENT_ID=a1b2c3d4e5f6g7h8 \
SPOTIFY_CLIENT_SECRET=i9j10k11l12m13n14 \
node bin/ playlists.json
```

You can get more help and options with:

```sh
node bin/ --help
```

## Output

The playlist data will be output as JSON at the provided path. The Spotify API is rate limited. So, depending on how many playlists you have, it might take a second.

```
{
    "username": "camwiegert",
    "timestamp": "2019-10-22T03:38:21.645Z",
    "playlists": [
        {
            "name": "Sick Jamz",
            "tracks": [
                {
                    "name": "Not",
                    "album": "Two Hands",
                    "artists": [
                        "Big Thief"
                    ]
                },
                ...
```
