# Progressive Web App with full offline capabilities

This is an example project for how you can build a [Progressive Web Application](https://infrequently.org/2015/06/progressive-apps-escaping-tabs-without-losing-our-soul/) with [Polymer](https://www.polymer-project.org/) and [Vaadin Elements](https://vaadin.com/elements).


The application uses a [ServiceWorker](https://github.com/slightlyoff/ServiceWorker/blob/master/explainer.md) to cache the [Application Shell](https://developers.google.com/web/updates/2015/11/app-shell?hl=en). A [WebApp Manifest file](https://developer.mozilla.org/en-US/docs/Web/Manifest) ensures that the browser identifies our app as a Progressive Web Application and offers the user to install the application through an install banner.

## Live Demo
[Try the live demo of the Progressive Web Application](http://demo.vaadin.com/expense-manager).

## Running locally

### Install dependencies
You need polymer-cli installed to build the app `npm install -g polymer-cli`.
Install all  dependencies with `bower install && npm install`.

## Run development server
`polymer serve` will run the application locally

## Docker container for production
You can use the included `Dockerfile` to deploy the built app using [prpl-server](https://github.com/Polymer/prpl-server-node).

## Build project locally

The default `polymer.json` contains the `"autoBasePath": true` setting to support differential serving with the [prpl-server](https://github.com/Polymer/prpl-server-node).
This option makes the build incompatible with static file servers, though. So, in order to serve bundled app locally using `polymer-cli`, do the following steps:

1. Remove `"autoBasePath": true` setting from the `polymer.json`

2. Run `polymer build`

3. Run `polymer serve build/es6-bundled` (you can choose `es5-bundled` instead)

Read more about the build options in the [Polymer: Build for production](https://www.polymer-project.org/2.0/toolbox/build-for-production) documentation.

## Note
The demo uses [Vaadin Charts](https://vaadin.com/charts), which will ask for a license. You can close the window to try out the app without a license.
