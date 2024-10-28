# IFGDBot
## Servicing interruptions via unprompted Family Guy cutaway gags!
This bot was created as a joke per a friend's request, and I thought it would be a quick and funny project.

## Launching the bot
- Clone this repository, make sure you have Node.js installed
- Install dependencies: `npm install discord.js dotenv @discordjs/voice ffmpeg ffmpeg-static libsodium-wrappers get-audio-duration`
- Some of these dependencies might not be necessary, will need to figure out which ones later
- Create an `.env` file, add `DISCORD_TOKEN=<your app token>`
- Bring the bot online with `node index.js` or simply `node .`

## TODO:
- [x] Have the bot come online
- [x] Add a command to turn the bot on and off
- [x] Give bot the ability to join a voice channel if a user is present and leave if no one is present
- [x] Find and add cutaway gags to the repository, make sure the bot can find them
- [x] Complete bot functionality:
  - [x] If active, wait for user(s) to connect to a vc
  - [x] When user(s) are connected, choose and play a cutaway gag at random
  - [x] After cutaway gag ends, wait some random amount of time, then choose and play another cutaway gag
- [x] Fix bugs
  
## Bugs:
- ~~The audio player(s) are not correctly deallocated when the bot disconnects from/switches VCs, probably due to await/asychronous delay properties~~
  - ~~When the bot has been disconnected from a VC, this will produce unlimited errors, which are caught and ignored, as a result of phantom audio players trying to play SFX~~
  - ~~When the bot has switched/reconnected to a VC, this will result in different cutaways cutting each other off~~

## Bug Resolutions:
- I'm not quite sure why I opted to use asynchronous waits instead of just audio player callbacks... anyways, I added a callback that checks if the audio player is idle