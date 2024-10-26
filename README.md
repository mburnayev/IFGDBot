# IFGDBot
## Servicing interruptions via unprompted Family Guy cutaway gags!
This bot was created as a joke per a friend's request, and I thought it would be a quick and funny project.

## Launching the bot
- Clone this repository, make sure you have Node.js installed
- Install dependencies: `npm install discord.js dotenv`
- Create a `.env` file, add `DISCORD_TOKEN=<your app token>`
- Bring the bot online with `node index.js` or simply `node .`, assuming it's in a server

## TODO:
- [x] Have the bot come online
- [x] Add a command to turn the bot on and off
- [ ] Give bot the ability to join a voice channel if a user is present and leave if no one is present
- [ ] Find and add cutaway gags to the repository, make sure the bot can find them
- [ ] Complete bot functionality:
  - [ ] If active, wait for user(s) to connect to a vc
  - [ ] When user(s) are connected, choose and play a cutaway gag at random
  - [ ] After cutaway gag ends, wait some random amount of time, then choose and play another cutaway gag