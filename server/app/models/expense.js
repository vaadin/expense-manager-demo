'use strict';
let mongoose = require('mongoose');
let Schema = mongoose.Schema;
let fs = require('fs');
let statuses = ['new', 'in_progress', 'reimbursed'];

let expenseSchema = new Schema({
  user: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  merchant: {
    type: String,
    required: true
  },
  total: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: statuses,
    default: 'new'
  },
  receipt: {
    type: String,
    required: true
  },
  comment: String

});

expenseSchema.pre('remove', expense => {
  if (expense.receipt && expense.receipt !== 'default') {
    fs.unlink('./files/receipts/' + expense.receipt, err=> {
      console.log('Failed to delete receipt ' + expense.receipt, err);
    });
  }
});

module.exports = mongoose.model('Expense', expenseSchema);