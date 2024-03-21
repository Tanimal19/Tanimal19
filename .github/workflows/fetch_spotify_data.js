var axios = require('axios');
var fs = require('fs');
var querystring = require('node:querystring');

var client_id = 'bd16f32b8a5b4b5cbbfe82414ec2cf8c';
var client_secret = 'dadbdbf6451445d8a04497182501a203';

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
  var topArtistHtml = '';

  if (topArtistList.length > 0) {
    topArtistList.forEach(function (i) {
      topArtistHtml += "<div><img width='60px' src='" + i.images[0].url + "'><br><strong>" + i.name + "</strong></div><br>\n";
    });
  }

  const url_track = 'https://api.spotify.com/v1/me/top/tracks?time_range=short_term&limit=10&offset=0';
  const topTrackList = await fetchSpotifyStats(url_track);
  var topTrackHtml = '';

  if (topTrackList.length > 0) {
    topTrackHtml = "<ol>\n";
    topTrackList.forEach(function (i) {
      topTrackHtml += "<li><div><strong>" + i.name + "</strong></div>\n<div>";
      const artists = i.artists;
      artists.forEach(function (a) {
        topTrackHtml += a.name;
      });
      topTrackHtml += "</div></li>\n";
    });
    topTrackHtml += "</ol>";
  }


  // Modify Readme Content
  var data = fs.readFileSync('README.md', 'utf8');
  
  const regex_art = /<td align="center" id="top-artist">([\s\S]*?)<\/td>/;
  const match_art = data.match(regex_art);
  if (match_art) {
    data = data.replace(match_art[0], `<td align="center" id="top-artist">${topArtistHtml}</td>`);
  }

  const regex_track = /<td id="top-track">([\s\S]*?)<\/td>/;
  const match_track = data.match(regex_track);
  if (match_track) {
    data = data.replace(match_track[0], `<td id="top-track">${topTrackHtml}</td>`);
  }
    
  fs.writeFile('README.md', data, (err) => {
    if (err) {
      console.error('Failed to write Markdown file:', err);
    } else {
      console.log('Markdown file has been written successfully!');
    }
  });
}

main();
