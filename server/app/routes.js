'use strict';
let express = require('express');
let cors = require('cors');

module.exports = (app) => {
  let apiRoutes = express.Router();

  // Enable CORS headers
  apiRoutes.use(cors());
  apiRoutes.get('/ping', (req, res) => {
    res.status(204).send();
  });

  let authenticationController = require('./controllers/authentication')(app);

  // Authentication and access control
  apiRoutes.post('/authenticate', authenticationController.authenticate);
  apiRoutes.use(authenticationController.tokenMiddleware);

  // Expense routes
  require('./controllers/expense')(apiRoutes);

  app.use('/api/v1', apiRoutes);
};