// Pull in dependencies
const prpl = require('prpl-server');
const express = require('express');
const webPush = require('web-push');
const bodyParser = require('body-parser');

// Server is ExpressJS
const app = express();

// prpl configuration
const root = process.argv.slice(2)[0] || '';
const rootPath = !/^\//.test(root) ? process.cwd() + '/' + root : root;

// port and keys are set via env-vars
const port = process.env.PORT || 3000;
const vapidKeys = {
  publicKey: process.env.VAPID_PUBLIC_KEY,
  privateKey: process.env.VAPID_PRIVATE_KEY
};

// Queue of expenses to be reimbursed
const expenses = [];
const expenseTimer = 30000;

// Tell web push about our application server
webPush.setVapidDetails('mailto:elements@vaadin.com', vapidKeys.publicKey, vapidKeys.privateKey);

// deserialise request payload to json
app.use(bodyParser.json());

// Serve static stuff with express server
// app.use('/', express.static(process.cwd() + '/'));

// Serve static stuff with prpl server
const prplConfig = require(rootPath + '/polymer.json');
app.get('/*', prpl.makeHandler(rootPath, prplConfig));

// Queue a expense for reimbursement
app.post('/expense', (req, res, next) => {
  if (req.body.expense && req.body.expense && req.body.user) {
    expenses.push(JSON.stringify(req.body));
    res.send('QUEUED');
    console.log(`Queued: ${req.body.expense.id}`);
  } else {
    res.status(400).send('BAD REQUEST');
  }
  return next(false);
});

// A loop for reimbursing queued expenses
setInterval(function() {
  if (expenses.length) {
    const idx = Math.floor(Math.random() * expenses.length);
    const body = JSON.parse(expenses.splice(idx, 1));
    body.expense.status = 'reimbursed';

    // Use the web-push library to send the notification message to subscribers
    webPush
      .sendNotification(body.user, JSON.stringify(body.expense))
      .then(success => console.log(`Reimbursed: ${body.expense.id}`))
      .catch(error => console.log(`Error reimbursing: ${body.expense.id}`, error));
  }
}, expenseTimer);

// Run web server
app.listen(port, () => console.log(`Server is running on port ${port}`));
