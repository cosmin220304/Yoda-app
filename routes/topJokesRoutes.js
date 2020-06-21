const topJokesController = require('../controllers/topJokesController')
module.exports = app => {
    app.get('/top3', topJokesController.getTop3),
    app.get('/worst3', topJokesController.getWorst3)
    app.get('/fresh', topJokesController.getWorst3)
}