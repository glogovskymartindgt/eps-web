# WfmWeb

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 7.3.4.

## Development

Run `npm api:run` to run the api server from Docker. Run `npm start` to start the app in an Angular dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.
After you've finished working, run `npm api:stop` to stop the api server (or you'll have to do it the next time you start the api server).

## Release

- bump the version - in `package.json`, `constants.ts`, run `npm install` to update the version in `package-lock.json` from `package.json`.
- merge the `develop` to `master` branch, set the tag
- build the app depending on the environment, where you want to release it: `npm run buildTest`, `npm run buildDemo`
- after the build has finished, run the release commands: `npm run release:latest`, `npm run release:version`

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).
