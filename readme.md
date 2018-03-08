# Progressive Web App with full offline capabilities

This is an example project for how you can build a [Progressive Web Application](https://developers.google.com/web/progressive-web-apps/) with [Polymer](https://www.polymer-project.org/) and [Vaadin components](https://vaadin.com/components).


The application uses a [Service Worker](https://developers.google.com/web/fundamentals/primers/service-workers/) to cache the [Application Shell](https://developers.google.com/web/fundamentals/architecture/app-shell). A [Web App Manifest file](https://developers.google.com/web/fundamentals/web-app-manifest/) ensures that the browser identifies our app as a Progressive Web Application and offers the user to install the application through an install banner.

## Live Demo
[Try the live demo of the Progressive Web Application](https://expensemanager.demo.vaadin.com/).

## Running locally

1. Fork this repository and clone it locally.

2. Make sure you have [npm](https://www.npmjs.com/) installed.

3. Run `npm install bower polymer-cli -g` to install tools needed to run the project.

3. When in the `expense-manager` directory, run `npm install` and then `bower install` to install dependencies.

4. Run `polymer serve` to start the development server.

5. Go to http://127.0.0.1:8081

## Linting

### Run all lint tasks in parallel

```
npm run lint
```

### Run ESLint for JS

```
npm run lint:javascript
```

### Run Stylelint for CSS

```
npm run lint:css
```

### Run polymer-linter

```
npm run lint:polymer
```

## Docker container for production
You can use the included `Dockerfile` to deploy the built app using [prpl-server](https://github.com/Polymer/prpl-server-node).

## Build project locally

The default `polymer.json` contains the `"autoBasePath": true` setting to support differential serving with the [prpl-server](https://github.com/Polymer/prpl-server-node).
This option makes the build incompatible with static file servers, though. So, in order to serve bundled app locally using `polymer-cli`, do the following steps:

1. Remove `"autoBasePath": true` setting from the `polymer.json`

2. Run `polymer build`

3. Run `polymer serve build/es6-bundled` (you can choose `es5-bundled` instead)

Read more about the build options in the [Polymer: Build for production](https://www.polymer-project.org/2.0/toolbox/build-for-production) documentation.
