const request = require('request');

var client_id = 'bd16f32b8a5b4b5cbbfe82414ec2cf8c';
var redirect_uri = 'http://localhost:8888/callback';

var app = express();
var code;

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

  const searchParams = new URLSearchParams(new URL(redirect_uri).search);
  const r_code = searchParams.get('code');
  const r_state = searchParams.get('state');

  if (r_state == state && r_code) {
    code = r_code;
  }
});


console.log(code);
