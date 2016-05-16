# Progressive Web App with full offline capabilities

This is an example project for how you can build a [Progressive Web Application](https://infrequently.org/2015/06/progressive-apps-escaping-tabs-without-losing-our-soul/) with [Polymer](https://www.polymer-project.org/1.0/), [PouchDB](https://pouchdb.com/) and [Vaadin Elements](https://vaadin.com/elements).

![Installation banner](https://vaadin.com/documents/10187/0/install.gif)
![Homescreen and task switcher support](https://vaadin.com/documents/10187/0/launcher.gif)


The application uses a [ServiceWorker](https://github.com/slightlyoff/ServiceWorker/blob/master/explainer.md) to cache the [Application Shell](https://developers.google.com/web/updates/2015/11/app-shell?hl=en). A [WebApp Manifest file](https://developer.mozilla.org/en-US/docs/Web/Manifest) ensures that the browser identifies our app as a Progressive Web Application and offers the user to install the application through an install banner.

Data is maintained in a local PouchDB database on the client, which can be synchronized to a [CouchDB](http://couchdb.apache.org/) server. The app remains fully functional regardless of connection status.

## Live Demo
[Try the live demo of the Progressive Web Application](http://demo.vaadin.com/expense-manager).

## Running locally

### Install local CouchDB (optional)
If you want to work on the same data in several browsers, you can install a local CouchDB. Just follow the instructions [here](https://pouchdb.com/guides/setup-couchdb.html).

Once installed, make sure that the `location` attribute is correct on the `<pouch-db>` element in `overview-page.html`. **Note** If you do not use a database to sync with, omit the `location` attribute.

## Install dependencies
Run `npm install && bower install`

## Run development server
`gulp serve` runs the app locally with browser sync.

## Other build targets
The app is based on [Polymer Starter Kit](https://developers.google.com/web/tools/polymer-starter-kit/), so you can use all the same targets like `serve:dist` etc.

## Note
The demo uses [Vaadin Charts](https://vaadin.com/charts), which will ask for a license. You can close the window to try out the app without a license.
