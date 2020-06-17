const Jokes = require('../models/jokes')

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
    getRandomJoke: (req, res) => { 
        Jokes.countDocuments().exec( (err, count) => { 
            const random = Math.floor(Math.random() * count)
            Jokes.findOne().skip(random).exec( (err, data) => sendResponse(res, err, data) ) 
        });  
    },
    getAllJokes: (req, res) => {
        Jokes.find().exec( (err, data) => sendResponse(res, err, data))
    },
    getJokeById: (req, res) => { 
        Jokes.find({_id : req.params.id}).exec( (err, data) => sendResponse(res, err, data) )
    },
}
module.exports = controller;