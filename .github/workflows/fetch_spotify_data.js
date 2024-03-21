var axios = require('axios');
var querystring = require('node:querystring');

var client_id = 'bd16f32b8a5b4b5cbbfe82414ec2cf8c'; // your clientId
var client_secret = 'dadbdbf6451445d8a04497182501a203'; // Your secret

var refresh_token = 'AQAhr3J9Z7c4wdKMuwxVQhNXjIVIWfgGuZuIiGTjm6RoqocPbsVcGQxa-7NfOC8t9-FIsMEg6N7Eky5H8V8wWSnonTL0Ewedn4DrGF7iXqVk89A4k6YWmLxi2Rm-9PqYlhg';

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

    const endpoint = 'https://api.spotify.com/v1/me/top/artists?time_range=short_term&limit=5&offset=0';

    axios.get(endpoint, { 
        headers: {
            'Authorization': 'Bearer ' + access_token
        },
    })
    .then(response => {
        // Handle successful response
        console.log('Playlist items:', response.data.items);
    })
    .catch(error => {
        // Handle error
        console.error('Error fetching playlist items:', error);
    });
})
.catch(error => {
    console.error('Error refreshing token:', error);
});
