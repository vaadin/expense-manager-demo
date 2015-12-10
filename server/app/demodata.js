'use strict';
let User = require('./models/user');
let Expense = require('./models/expense');
let moment = require('moment');

module.exports.createUser = () => {
  //User.remove({});
  User.count({}).then(count => {
    if (count === 0) {
      new User({
        name: 'demo',
        password: 'demo'
      }).save(err => {
        if (err) {
          console.log('Failed to create demo user', err);
        }
        console.log('Created user demo:demo');
      });
    }
  }).catch(err => {
    console.log(err);
  });
};


module.exports.createExpenses = () => {
  //Expense.remove({});
  Expense.count({}).then(count => {
    if (count === 0) {
      let date = moment();
      for (let i = 0; i < 10000; i++) {
        date = date.subtract(Math.floor(Math.random() * 72), 'hours');
        let status = 'new';
        if (i > 30) {
          status = 'reimbursed';
        } else if (i > 15) {
          status = 'in_progress';
        }
        new Expense({
          user: 'demo',
          date: date,
          merchant: ['Electronics', 'Rental car', 'Airline', 'Hotel', 'Restaurant', 'Taxi'][Math.floor(Math.random() * 6)],
          total: Math.random() * (Math.random() * 3) * 300 + 10,
          status: status,
          comment: 'No comments, please.',
          receipt: 'default'
        }).save(err => {
          if (err) {
            console.log('Failed to create sample data', err);
          }
        });
      }
      console.log('Created sample data');
    }
  });
};