const randomYodaJokeController = require('../controllers/yodaJokesController');
module.exports = app => {
    app.get('/randomJoke', randomYodaJokeController.getRandomJoke),
    app.get('/jokes', randomYodaJokeController.getAllJokes)
    app.get('/jokes/:id', randomYodaJokeController.getJokeById)
};