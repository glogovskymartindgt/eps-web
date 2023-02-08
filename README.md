# IIHF EPS

Wiki: https://wiki.qbsw.sk/display/IIHF/IIHF-TOK+Home

JIRA: https://jira.qbsw.sk/projects/IIHF/summary

TEST: http://iihftest.qbsw.local:4200/#/authentication/login

## Init

Run `npm install`.

Prihlasit sa v dockeri po zadani qbsw prihlasovacich udajov v command line:
`docker login qbsw-docker-dev.artifactory.qbsw.local`.

## Development

- Run `npm run api:run` to run the api server from Docker.
  This will also run `npm run Ndisk:mount` to create an N disk on your PC, 
  which is used by the backend run locally.
- Run `npm start` to start the app in an Angular dev server. 
  Navigate to `http://localhost:4200/`. The app will automatically reload 
  if you change any of the source files.
- After you've finished working, run `npm run api:stop` to stop the api 
  server (or you'll probably have to do it the next time you start 
  the api server).

## Authentication

https://wiki.qbsw.sk/display/IIHF/Q-Test

## Release

- bump the version - in `package.json`, `constants.ts`, run `npm install` to update the version in `package-lock.json` from `package.json`.
- merge the `develop` to `master` branch, set the tag
- build the app depending on the environment, where you want to release it: `npm run buildTest`, `npm run buildDemo`
- after the build has finished, run the release commands: `npm run release:latest`, `npm run release:version`
