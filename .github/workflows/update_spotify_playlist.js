const request = require('request');

var client_id = 'bd16f32b8a5b4b5cbbfe82414ec2cf8c';
var redirect_uri = 'http://localhost:8080/authorize';

var app = express();

app.get('/login', function(req, res) {

  var state = generateRandomString(16);
  var scope = 'playlist-read-private playlist-read-collaborative';

  res.redirect('https://accounts.spotify.com/authorize?' +
    querystring.stringify({
      response_type: 'code',
      client_id: client_id,
      scope: scope,
      redirect_uri: redirect_uri,
      state: state
    }));
});



app.get('/callback', function(req, res) {

  var code = req.query.code || null;
  var state = req.query.state || null;

  if (state === null) {
    res.redirect('/#' +
      querystring.stringify({
        error: 'state_mismatch'
      }));
  } else {
    var authOptions = {
      url: 'https://accounts.spotify.com/api/token',
      form: {
        code: code,
        redirect_uri: redirect_uri,
        grant_type: 'authorization_code'
      },
      headers: {
        'content-type': 'application/x-www-form-urlencoded',
        'Authorization': 'Basic ' + (new Buffer.from(client_id + ':' + client_secret).toString('base64'))
      },
      json: true
    };
  }
});


// 定义API端点和播放列表ID
const playlistEndpoint = 'https://api.spotify.com/v1/playlists/';
const playlistId = '6Fdwfw86A0M5m5NtGm2j3d';  // 请将此替换为您的实际播放列表ID
const market = 'TW';  // 可选：将此替换为您所在地区的市场代码

// 定义您的访问令牌
const accessToken = process.env.SPOTIFY_ACCESS_TOKEN;  // 请将此替换为您的实际访问令牌

// 构建请求头
const headers = {
  'Authorization': `Bearer ${accessToken}`
};

// 发送GET请求获取播放列表数据
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
