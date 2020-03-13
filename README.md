# Quizzy Twitch Bot
# Extension from Twitch Bot boilerplate(https://twitch.tv/devkucher)

"Ready to go" boilerplate with Jest, TMI.js, Nodemon, Config, Babel.

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
## Thanks to devkucher for providing the base template for this bot

