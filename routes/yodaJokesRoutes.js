const yodaJokesController = require('../controllers/yodaJokesController');
module.exports = app => {
    app.get('/randomJoke', yodaJokesController.getRandomJoke),
    app.get('/jokes', yodaJokesController.getAllJokes)
    app.get('/jokes/:id', yodaJokesController.getJokeById)
    app.post('/jokes', yodaJokesController.addJoke)
}