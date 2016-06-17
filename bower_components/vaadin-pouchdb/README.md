vaadin-pouchdb
========

A polymer web component wrapping [PouchDB](http://pouchdb.com/).

It's goal is the simplicity of setting up an application which works online / offline.
Nothing else needed for observing connectivity, changes in a list, etc.

## Quick Start

```
    <vaadin-pouchdb id="db"
      dbname="chat"
      index="ts"
      data="{{items}}"
      remote="http://user:password@localhost:5984/chat"
     ></vaadin-pouchdb>
     
     <vaadin-grid id="grid" items="{{items}}">
      <table>
        <colgroup>
         <col /><col />
         </colgroup>
      </table>
     </vaadin-grid>
```

```
    // Add a new item to the database.
    // We could use db.data instead of grid.items.
    this.$.grid.push('items', { name: 'Manolo', country: 'Spain'});
    // Modify an item in the database
    this.$.grid.set('items.0.country', 'Finland');
    // Remove an item from the database
    this.$.grid.pop('items');
```

- Use a local database `chat` which will be synchronised with the one specified in the `remote` parameter.
    - Remote could be either couchdb or pouchdb. If you don't specify any remote, it will be use a local instance only.
- Any changes in the `data` array using the `Polymer` API will be propagated to the database, and any change in the database to the array.
    - Use polymer data-binding as usual.
- Create an index `ts`, and use it to query the database.
    - If not provided it get all items sorted by `_id`
- It queries all items in the database (no filtering)
    - You could configure the `queryString` parameter though.


## For GWT users

Once you have added the gwt-polymer-api

You can wrap the element using vaadin the gwt-api-generator:

```
  $ sudo npm install vaadin/gwt-api-generator -g
  $ bower install manolo/vaadin-pouchdb
  $ gwt-api-generator 
```

Then you will get all needed classes in your `src/main/java` folder

Your project should also depend on vaadin gwt-polymer-elements

