# Sandbox for trying out OAuth with AngularJS and NodeJS

Uses the angular-seed application skeleton.

## Getting Started

Get git from [http://git-scm.com/](http://git-scm.com/).

Get node.js and its package manager (npm) from [http://nodejs.org/](http://nodejs.org/).

Clone the repo.

Install dependencies by changing to the repo root and running

`$ npm install`

This also runs bower to install angular framework code packages.

* `node_modules` - contains the npm packages for the tools we need
* `app/bower_components` - contains the angular framework files

*Note that the `bower_components` folder would normally be installed in the root folder but
angular-seed changes this location through the `.bowerrc` file.  Putting it in the app folder makes
it easier to serve the files by a webserver.*

## Run the Application

The angular-seed skeleton preconfigures the project with a simple development web server.  The simplest way to start
this server is:

```
npm start
```

Now browse to the app at `http://localhost:8000/app/index.html`.

