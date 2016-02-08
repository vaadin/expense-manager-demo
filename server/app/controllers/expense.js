'use strict';
let Expense = require('../models/expense');
let moment = require('moment');
let multer = require('multer');
let mongoose = require('mongoose');
let fs = require('fs');

const RECEIPTS_LOCATION = './files/receipts';
let uploadHandler = multer({
  dest: RECEIPTS_LOCATION,
  limits: {
    filesize: 5e6
  }
});

module.exports = (routes) => {

  // CREATE
  routes.post('/expenses', uploadHandler.single('receipt'), (req, res) => {
    // Copy over and sanitize contents
    let expense = {};
    expense.user = req.user.name;
    expense.merchant = req.body.merchant;
    expense.total = req.body.total;
    expense.date = new Date(req.body.date);
    expense.comment = req.body.comment;
    expense.receipt = req.file.filename;

    new Expense(expense).save((err, saved) => {
      if (err) {
        console.log(err);
        res.json({
          success: false,
          error: err.errors.status.message
        });
      } else {
        res.json({
          success: err ? false : true,
          saved: saved
        });
      }
    });
  });

  // READ
  routes.get('/expenses', (req, res) => {
    let index = parseInt(req.query.index) || 0;
    let count = parseInt(req.query.count) || 50;
    let query = {
      user: req.user.name
    };

    const merchant = req.query.merchant;
    if (merchant) {
      query.merchant = new RegExp(merchant, 'i');
    }
    const min = req.query.min;
    if (min && !isNaN(min)) {
      query.total = {
        $gt: min
      };
    }

    const max = req.query.max;
    if (max && !isNaN(max)) {
      if (query.total) {
        query.total.$lt = max;
      } else {
        query.total = {
          $lt: max
        };
      }
    }

    const startDate = req.query.start;
    if (startDate) {
      const date = moment(startDate);
      if (date.isValid()) {
        date.startOf('day');
        query.date = {
          $gt: date.toDate()
        };
      }
    }

    const endDate = req.query.end;
    if (endDate) {
      const date = moment(endDate);
      if (date.isValid()) {
        date.startOf('day');
        if (query.date) {
          query.date.$lt = date.toDate();
        } else {
          query.date = {
            $lt: date.toDate()
          };
        }
      }
    }

    let statuses = req.query.status;
    if (statuses) {
      query.status = {
        $in: statuses.split(',')
      };
    }

    let sortProperty = req.query.sort;
    let sortDirection = req.query.direction;
    let sort = '-date';
    let resultset = {
      metadata: {
        index: index,
        count: count
      }
    };

    if (sortProperty) {
      sort = sortProperty;
      if (sortDirection && sortDirection === 'asc') {
        sort = '-' + sort;
      }
    }

    // Ensure we get the metadata and query populated before running query
    new Promise(resolve => {
      if (index === 0) {
        // only return the full length on the first request
        Expense.count(query).then(count => {
          resultset.metadata.totalcount = count;
          resolve();
        });
      }
      resolve();
    }).then(() => {
      Expense.find(query).sort(sort).skip(index).limit(count).then(expenses => {
        resultset.result = expenses.map(e => {
          return {
            id: e._id,
            merchant: e.merchant,
            total: e.total,
            date: e.date,
            status: e.status,
            comment: e.comment
          };
        });
        res.json(resultset);
      });
    });
  });

  // UPDATE
  routes.post('/expenses/:id', uploadHandler.single('receipt'), (req, res) => {
    Expense.findOne(mongoose.Types.ObjectId(req.params.id)).then(exp => {
      if (exp.user === req.user.name) {
        exp.merchant = req.body.merchant || exp.merchant;
        exp.total = req.body.total || exp.total;
        exp.comment = req.body.comment || exp.comment;

        if (req.file && req.file.filename) {
          if (exp.receipt && exp.receipt !== 'default') {
            fs.unlink(RECEIPTS_LOCATION + '/' + exp.receipt, err => {
              console.log('Failed to delete receipt ' + exp.receipt, err);
            });
          }
          exp.receipt = req.file.filename;
        }

        exp.save((err, saved) => {
          res.json({
            success: err ? false : true,
            saved: saved
          });
        });
      } else {
        res.status(403);
      }
    }).catch((e) => {
      console.log(e);
      res.status(404);
    });
  });

  // DELETE
  routes.delete('/expenses/:id', (req, res) => {
    Expense.findOneAndRemove({
      _id: mongoose.Types.ObjectId(req.params.id),
      user: req.user.name,
      status: 'new'
    }).then(() => res.json({
        success: true
      })
      .catch(() => res.status(403).json({
        success: false
      })));
  });

  routes.get('/expenses/:id/receipt.png', (req, res) => {
    Expense.findOne(mongoose.Types.ObjectId(req.params.id)).then(exp => {
      if (exp.user === req.user.name) {
        res.sendFile(exp.receipt, {
          root: RECEIPTS_LOCATION
        });
      } else {
        res.status(403);
      }
    }).catch(() => {
      res.status(404);
    });
  });

  routes.get('/expenses/overview', (req, res) => {
    let resultset = {};
    Expense.aggregate([{
      $match: {
        $and: [{
          date: {
            $gt: moment().subtract(11, 'months').startOf('month').toDate()
          }
        }, {
          user: req.user.name
        }]
      }
    }, {
      $group: {
        _id: {
          month: {
            $month: '$date'
          },
          year: {
            $year: '$date'
          }
        },
        total: {
          $sum: '$total'
        }
      }
    }], (err, history) => {
      if (err) {
        console.log(err);
      }
      // Clean up result. You could probably already do this in the
      // aggregate function, but I couldn't figure out how
      history = history.map(el => {
        return {
          month: el._id.month,
          year: el._id.year,
          total: el.total
        };
      });
      history.sort((a, b) => {
        return a.year - b.year || a.month - b.month;
      });

      resultset.history = history;

      Expense.aggregate([{
        $match: {
          $and: [{
            status: 'new'
          }, {
            user: req.user.name
          }]
        }
      }, {
        $group: {
          _id: null,
          total: {
            $sum: '$total'
          }
        }
      }], (err, totalOwed) => {
        if (err) {
          console.log(err);
        }
        resultset.totalOwed = totalOwed[0].total;
        res.json(resultset);
      });
    });
  });

  routes.get('/merchants', (req, res) => {
    Expense.distinct('merchant', {}).then(expenses => {
      res.json(expenses);
    });
  });
};
