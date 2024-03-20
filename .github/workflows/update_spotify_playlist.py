import requests

# 定义API端点和播放列表ID
playlist_endpoint = 'https://api.spotify.com/v1/playlists/'
playlist_id = '6Fdwfw86A0M5m5NtGm2j3d'  # 请将此替换为您的实际播放列表ID
market = 'TW'  # 可选：将此替换为您所在地区的市场代码

# 定义您的访问令牌
access_token = 'dadbdbf6451445d8a04497182501a203'  # 请将此替换为您的实际访问令牌

# 构建请求头
headers = {
    'Authorization': f'Bearer {access_token}'
}

# 发送GET请求获取播放列表数据
response = requests.get(f'{playlist_endpoint}{playlist_id}?market={market}', headers=headers)

# 检查响应状态码
if response.status_code == 200:
    playlist_data = response.json()
    print("Playlist Name:", playlist_data['name'])
    print("Playlist Description:", playlist_data['description'])
    print("Tracks:")
    for track in playlist_data['tracks']['items']:
        print("- ", track['track']['name'])
else:
    print("Failed to fetch playlist:", response.status_code)
