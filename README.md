# 💽 Spotify Playlist Archive

> An archive of my Spotify playlists and the tooling to generate it.

## Requirements

- [Spotify API client credentials](https://developer.spotify.com/dashboard/)
- Spotify username
- Node 8+

## Install

```sh
npm install
```

## Usage

```sh
node bin/ output-path.json

# CLI help
node bin/ --help
```

### Environment Variables

You'll need to provide three environment variables:

| Variable                |
| :---------------------- |
| `SPOTIFY_USERNAME`      |
| `SPOTIFY_CLIENT_ID`     |
| `SPOTIFY_CLIENT_SECRET` |

## Output

The playlist data will be output as JSON at the provided path. The Spotify API is rate limited, so it might take a second if you have a lot of playlists.

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
