var axios = require('axios');
var request = require('request');
var querystring = require('node:querystring');

var client_id = 'bd16f32b8a5b4b5cbbfe82414ec2cf8c'; // your clientId
var client_secret = 'dadbdbf6451445d8a04497182501a203'; // Your secret

var refresh_token = 'AQCTjYUJltGy1dQnE5VAgYz6G02X7eFg2u6nlxlvVk5cOiVo9J_ceBVdEtwjigK-w03t-pi6FBUu78yQHf2RoUE6OuipWR3gXRIRwf-CuZxM-SVoDEmmlqGxrqzHF-kTd-M';

axios.post('https://accounts.spotify.com/api/token', querystring.stringify({
    grant_type: 'refresh_token',
    refresh_token: refresh_token
}), {
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': 'Basic ' + Buffer.from(client_id + ':' + client_secret).toString('base64')
    }
})
.then(response => {
    const access_token = response.data.access_token;

    const playlistEndpoint = 'https://api.spotify.com/v1/playlists/';
    const playlistId = '6Fdwfw86A0M5m5NtGm2j3d';
    const market = 'TW';

    const headers = {
        'Authorization': `Bearer ${access_token}`
    };

    request.get(`${playlistEndpoint}${playlistId}?market=${market}`, {headers}, (error, response, body) => {
        if (error) {
            console.error('Failed to fetch playlist:', error);
            return;
        }

        if (response.statusCode !== 200) {
            console.error('Failed to fetch playlist:', response.statusCode);
            return;
        }

        const playlistData = JSON.parse(body);
        console.log('Playlist Name:', playlistData.name);
        console.log('Playlist Description:', playlistData.description);
        console.log('Tracks:');
        for (const track of playlistData.tracks.items) {
            console.log('-', track.track.name);
        }
    });
})
.catch(error => {
    console.error('Error refreshing token:', error);
});
