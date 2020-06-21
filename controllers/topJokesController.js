const Jokes = require('../models/jokesModel')

const sendResponse = (res,err,data) => {
    if (err){
        res.json({ success: false, message: err })
    } 
    else if (!data || data.length == 0){
        res.json({ success: false, message: "Not Found" })
    } 
    else {
        res.json({success: true, data: data})
    }
} 

const controller = {
    getTop3: (req, res) => { 
        Jokes.find().sort({score: -1}).limit(3).exec( 
            (err, data) => sendResponse(res, err, data)
        );
    },
    getWorst3: (req, res) => { 
        Jokes.find().sort({score: 1}).limit(3).exec( 
            (err, data) => sendResponse(res, err, data)
        );
    },
    getFreshJokes: (req, res) => { 
        Jokes.find().exec( (err, jokes) => {
            let freshJokes = {}
            
            for (let i = 0; i < 3; i++)
                freshJokes["data"].push(jokes.seats[jokes.seats.length - 1 - i])
            sendResponse(res, err, freshJokes)
        });
    }
}
module.exports = controller;