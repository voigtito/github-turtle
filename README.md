# Github backend

<div align="center">

![BADGE_NODE_VERSION] ![BADGE_NPM_VERSION] ![BADGE_SERVER_NODEJS] ![BADGE_TYPESCRIPT] 

</div>

### Features Planning and Requirements

- [x] Read githun API
- [x] Generate github access token for the user repo account
- [x] Setup project
- [x] Set a date range to show the commits
- [x] List every user for the repository selected
- [x] List all the commits from the repository listed according to the range of time passed

### Tecnologies used

- Node.js
- Typescript

### How to run the code

1. Clone the repository from https://github.com/voigtito/github-turtle.git
2. Run ```yarn``` or ```npm install```
3. Run the server on ```yarn dev:server``` or ```npm run dev:server```

### Insomnia or Postamn requests

1. Set a GET request to the url: ```http://localhost:3333/github/all``` passing the query params:
  - user: github_user (example: voigtito)
  - repository: github_repo (example: github-turtle)
  - since: 07/04/2021 (MM/DD/YYYY)
  - until: 07/09/2021 (MM/DD/YYYY)

### Architecture

1. The architecture is divided in:
  routes
  interfaces
  services



<!-- Badges -->

[BADGE_NODE_VERSION]: https://img.shields.io/badge/node-14.15.4-green

[BADGE_NPM_VERSION]: https://img.shields.io/badge/npm-6.14.10-red

[BADGE_SERVER_NODEJS]: https://img.shields.io/badge/server-nodejs-important

[BADGE_TYPESCRIPT]: https://badges.frapsoft.com/typescript/code/typescript.png?v=101
