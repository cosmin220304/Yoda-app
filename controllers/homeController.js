const path = require('path');
const homeViewPath = path.join(__dirname, '..', 'views', 'homeView.html')
const controller = {
    mainPage: (req, res) => { 
        res.sendFile(homeViewPath)
    }
}
module.exports = controller;