var axios = require('axios');
var fs = require('fs');
var querystring = require('node:querystring');

var client_id = 'bd16f32b8a5b4b5cbbfe82414ec2cf8c'; // your clientId
var client_secret = 'dadbdbf6451445d8a04497182501a203'; // Your secret

var refresh_token = 'AQAhr3J9Z7c4wdKMuwxVQhNXjIVIWfgGuZuIiGTjm6RoqocPbsVcGQxa-7NfOC8t9-FIsMEg6N7Eky5H8V8wWSnonTL0Ewedn4DrGF7iXqVk89A4k6YWmLxi2Rm-9PqYlhg';

async function fetchSpotifyStats(endpoint) {
  try {
    const tokenResponse = await axios.post('https://accounts.spotify.com/api/token', querystring.stringify({
      grant_type: 'refresh_token',
      refresh_token: refresh_token
    }), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': 'Basic ' + Buffer.from(client_id + ':' + client_secret).toString('base64')
      }
    });

    const access_token = tokenResponse.data.access_token;

    const response = await axios.get(endpoint, {
      headers: {
        'Authorization': 'Bearer ' + access_token
      },
    });

    return response.data.items;
  } catch (error) {
    console.error('Error fetching Spotify stats:', error);
    return [];
  }
}

async function main() {
  // Fetch Spotify Data
  const url_art = 'https://api.spotify.com/v1/me/top/artists?time_range=short_term&limit=5&offset=0';
  const topArtistList = await fetchSpotifyStats(url_art);
  var topArtistHtml;

  if (topArtistList.length > 0) {
    topArtistHtml = "<div>Top Artists</div><ol>\n";

    topArtistList.forEach(function (i) {
      topArtistHtml += "<li>" + i.name + "</li>\n";
    });

    topArtistHtml += "</ol>";
  }

  const url_track = 'https://api.spotify.com/v1/me/top/tracks?time_range=short_term&limit=10&offset=0';
  const topTrackList = await fetchSpotifyStats(url_track);
  var topTrackHtml;

  if (topTrackList.length > 0) {
    topTrackHtml = "<div>Top Tracks</div><ol>\n";

    topTrackList.forEach(function (i) {
      topTrackHtml += "<li><div><strong>" + i.name + "</strong></div><br><div>";

      const artists = i.artists;
      artists.forEach(function (a) {
        topTrackHtml += a.name;
      });

      topTrackHtml += "</div>\n";

    });

    topTrackHtml += "</ol>";
  }

  // Modify Readme Content
  const finalHtml = topArtistHtml + topTrackHtml;
  var newData;
  const data = fs.readFileSync('README.md', 'utf8');
  const regex = /<div id="spotify">([\s\S]*?)<\/div>/;
  const match = data.match(regex);
    
  if (match) {
    newData = data.replace(match[0], `<div id="spotify">${finalHtml}</div>`);
  }
    
  fs.writeFile('TEST.md', (newData ? newData : data), (err) => {
    if (err) {
      console.error('Failed to write Markdown file:', err);
    } else {
      console.log('Markdown file has been written successfully!');
    }
  });
}

main();
