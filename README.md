# Spotify Playlist Archive

> This is an archive of my Spotify playlists and the tooling to generate it. All you need is some [Spotify API client credentials](https://developer.spotify.com/my-applications), your username, and node 8+.

## Install

```sh
npm install
```

## Usage

```sh
npm start
```

You'll need to provide three environment variables. You can either pass them directly in your shell or provide them in a `.env` file.

| Environment Variable | Value                     |
| ---------------------|---------------------------|
| `CLIENT_ID`          | Spotify API client ID     |
| `CLIENT_SECRET`      | Spotify API client secret |
| `USERNAME`           | Spotify username          |


## Output

Each playlist will be a JSON file in `playlists/`, named with the pattern `[slugified-title].json`. The Spotify API is rate limited. So, depending on how many playlists you have, it might take a second.

```
{
    "name": "Sick Jamz",
    "tracks": [
        {
            "name": "Give It Up",
            "album": "MY WOMAN",
            "artists": [
                "Angel Olsen"
            ]
        },
        ...
}
```
