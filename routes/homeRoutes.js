const homeController = require('../controllers/homeController');
module.exports = app => {
    app.get('/', homeController.mainPage)
}