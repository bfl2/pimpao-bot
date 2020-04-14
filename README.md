# Pimpao Bot
# Simple twitch bot with additional functionalities such as Quiz and Queue System.

## Install

1. Clone repository

2. Install modules `npm i` or `yarn install`

3. Copy example config

   ```bash
   cp config/default.example.json5 config/default.json5
   ```

4. Setup bot

`oauth_token` you can get [here by login via bot](https://twitchapps.com/tmi/)

```
bot: {
    username: "your-bots-username-here",
    oauth_token: "oauthtokenhere"
},
channel: "your-channel-here"
```

5. Run bot `npm start`

``
6. Setup Browser Sources
  ` Quiz module at
  http://localhost:8080/quiz
  `
` Queue module at
http://localhost:8000/queue
`
## Thanks to devkucher(https://twitch.tv/devkucher) for providing the base template for this bot

## Contact me at ursope(https://twitch.tv/ursope) if you need any help setting up this bot

