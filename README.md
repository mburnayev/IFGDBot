# IFGDBot
## Servicing interruptions via unprompted Family Guy cutaway gags!
This project was started and finished in a weekend (10/25-27/2024); the idea for the bot was pithced as a joke by a friend.
The bot is fully functional, but will be periodically updated to add more Family Guy cutaway gags.

## Launching the bot
- Clone this repository, make sure you have Node.js installed
- Install dependencies: `npm install dotenv discord.js @discordjs/voice libsodium-wrappers`
- Create an `.env` file, add `DISCORD_TOKEN=<your app token>`
- Bring the bot online with `node index.js` or simply `node .`

## TODO:
- [x] Have the bot come online
- [x] Add a command to turn the bot on and off
- [x] Give bot the ability to join a voice channel if a user is present and leave if no one is present
- [x] Find and add cutaway gags to the repository, make sure the bot can find them
- [x] Complete bot functionality:
  - [x] If active, wait for user(s) to connect to a VC
  - [x] When user(s) are connected, choose and play a cutaway gag at random
  - [x] After cutaway gag ends, disconnect from VC
- [x] Fix bugs
  
## Bug Tracker
| Bug | Details | Resolution |
| :--- | :--- | :--- |
| The audio player isn't correctly deallocated when the bot disconnects from/switches VCs, probably due to mixing asychronous delays + event listeners. | Bot produces unlimited errors when disconnected from a VC as a result of phantom audio players trying to play SFX. Bot stacks gags when repeatedly switched/reconnected to a VC. | I changed the bot's design to make my life easier, and to avoid introducing complex logic (scheduler) to a simple project, I instead made the bot play a random cutaway gag, then immediately disconnect from VC using an event listener — no delays, no bugs.
