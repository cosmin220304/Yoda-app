const Jokes = require('../models/jokes')
const PendingJokes = require('../models/pendingJokes')

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

//Code from: https://stackoverflow.com/questions/1349404/generate-random-string-characters-in-javascript
const generateId = () => {
    let ret = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789_'; 
    for (let i = 0; i < 23; i++ ) {
        ret += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return ret;
}
//end code from: https://stackoverflow.com/questions/1349404/generate-random-string-characters-in-javascript

const controller = {
    getRandomJoke: (req, res) => { 
        Jokes.countDocuments().exec( 
            (err, count) => { 
                const random = Math.floor(Math.random() * count)
                Jokes.findOne().skip(random).exec( 
                    (err, data) => sendResponse(res, err, data) 
                ) 
            }
        )  
    },
    getAllJokes: (req, res) => {
        Jokes.find().exec( 
            (err, data) => sendResponse(res, err, data)
        )
    },
    getJokeById: (req, res) => { 
        Jokes.find({_id : req.params.id}).exec( 
            (err, data) => sendResponse(res, err, data) 
        )
    },
    addJoke: (req, res) => { 
        let new_joke = {}
        new_joke._id = generateId();
        new_joke.joke = req.body.joke
        PendingJokes.create(
            new_joke,
            (err, data) => {sendResponse(res,err,data)}
        )
    }
}
module.exports = controller;