import fetch from 'node-fetch';

const {
    SPOTIFY_CLIENT_ID,
    SPOTIFY_CLIENT_SECRET
} = process.env;

const endpoint = 'https://accounts.spotify.com/api/token';

const credentials = Buffer.from(`${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`).toString('base64');

const requestConfig = {
    method: 'POST',
    body: new URLSearchParams('grant_type=client_credentials'),
    headers: {
        Authorization: `Basic ${credentials}`
    }
};

const authRequest = authenticate(requestConfig);

export async function authenticate(config) {
    const response = await fetch(endpoint, config);

    if (response.ok) {
        return response.json();
    }

    throw new Error(`Unable to authenticate: ${response.statusText}`);
}

export const fetchWithAuth = async (url) => authRequest.then(auth => fetch(url, {
    headers: {
        Authorization: `Bearer ${auth.access_token}`
    }
}));
