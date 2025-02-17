const mongoose = require('mongoose');

const jokesSchema = new mongoose.Schema({
  _id: {type: String, required: true},
  joke: {type: String, required: true},
  score: {type: Number}
});

module.exports = mongoose.model('Jokes', jokesSchema, 'Jokes')