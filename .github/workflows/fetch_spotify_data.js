var axios = require('axios');
var fs = require('fs');
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
        var newData;
        var html = "<table>\n";
        const itemList = response.data.items;
        itemList.forEach(function (i) {
          html += "<tr><img src='" + i.images[0].url + "' width='100px'><div>" + i.name + "</div></tr>\n";
        });
        html += "</table>";

        const data = fs.readFileSync('README.md');
        const regex = /<div id="spotify">([\s\S]*?)<\/div>/;
        const match = data.match(regex);
        if (match) {
             newData = data.replace(match, `<div id="spotify">${html}</div>`);
        }

        console.log(data);
        console.log(newData);
        
        fs.writeFile('TEST.md', (newData ? newData:data), (err) => {
            if (err) {
                console.error('Failed to write Markdown file:', err);
            } else {
                console.log('Markdown file has been written successfully!');
            }
        });
    })
    .catch(error => {
        // Handle error
        console.error('Error fetching playlist items:', error);
    });
})
.catch(error => {
    console.error('Error refreshing token:', error);
});
