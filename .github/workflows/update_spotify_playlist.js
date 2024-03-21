const request = require('request');

// 定义API端点和播放列表ID
const playlistEndpoint = 'https://api.spotify.com/v1/playlists/';
const playlistId = '6Fdwfw86A0M5m5NtGm2j3d';  // 请将此替换为您的实际播放列表ID
const market = 'TW';  // 可选：将此替换为您所在地区的市场代码

// 定义您的访问令牌
const accessToken = 'BQANgkpUZ6eNuLIyx-WkMqrDUJElgvP_SNG3lzFmwybPAmLvU2Eg29OtRoHDa7Dugp8WLgaOLeJKwc5YfdN7KFJR_-wNnVZt0AorRCCez2STRV6l5k08htthxQZnnVcCCHmmkiyldBrZeevLqQ-harT1EC3aAFtiaqWNrbZT9k1boE8i3L-0AJZf94tVG1X3WnX5rx5gCzGJ_G5gRrDDM51oLA';  // 请将此替换为您的实际访问令牌

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
