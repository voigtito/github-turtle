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
4. Create and ```.env``` file with the followings variables:
- ```GITHUB_KEY=EXAMPLE_TOKEN_GITHUB```
5. The github token can be generated here: https://github.com/settings/tokens
6. Create a token with the all the permissions for "repo" and use it for your ```GITHUB_KEY``` in ```.env``` file

### Insomnia or Postamn requests

1. Set a GET request to the url: ```http://localhost:3333/github/all``` passing the query params:
  - user: github_user (example: voigtito)
  - repository: github_repo (example: github-turtle)
  - since: 07/04/2021 (MM/DD/YYYY)
  - until: 07/09/2021 (MM/DD/YYYY)

### Architecture

1. modules
2. routes
3. interfaces
4. services

Modules -> The application has only one module but it was done to show how we divide the architecture on a bigger project. So each module has its own routes, services and interfaces. Making more easy to work with more people on the project and with tests.

Routes -> The routes system is divided into the main file ```index.ts``` and module files like ```github.routes.ts```. This was made with the intention to get a more clean architecture to isolate each module route in the application.

Interfaces -> The interfaces also remains to its own module. It was isolated to get more organized structure for the hole module and avoiding searching the interfaces in the services.

Services -> The place where the business rules are written in code. It is separated in methods from a class but they can also be in separated files like CreateRepo.ts and UpdateRepo.ts for better practices in the unit tests.

<!-- Badges -->

[BADGE_NODE_VERSION]: https://img.shields.io/badge/node-14.15.4-green

[BADGE_NPM_VERSION]: https://img.shields.io/badge/npm-6.14.10-red

[BADGE_SERVER_NODEJS]: https://img.shields.io/badge/server-nodejs-important

[BADGE_TYPESCRIPT]: https://badges.frapsoft.com/typescript/code/typescript.png?v=101
