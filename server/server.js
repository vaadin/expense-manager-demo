'use strict';
(() => {
  let express = require('express');
  let app = express();
  let bodyParser = require('body-parser');
  let morgan = require('morgan');
  let mongoose = require('mongoose');

  let config = require('./config');
  let demodata = require('./app/demodata.js');

  let port = 8080;
  mongoose.Promise = global.Promise;
  mongoose.connect(config.database);
  app.set('secret', config.secret);
  app.use(bodyParser.urlencoded({
    extended: false
  }));
  app.use(bodyParser.json());
  app.use(morgan('dev'));

  demodata.createUser();
  demodata.createExpenses();

  require('./app/routes.js')(app);

  app.listen(port);
  console.log('Server running on http://localhost:' + port);
})();