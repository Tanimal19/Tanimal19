const request = require('request');

// 定义API端点和播放列表ID
const playlistEndpoint = 'https://api.spotify.com/v1/playlists/';
const playlistId = 'your_playlist_id_here';  // 请将此替换为您的实际播放列表ID
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
