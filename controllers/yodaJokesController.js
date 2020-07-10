const axios = require('axios');
const Jokes = require('../models/jokesModel')
const PendingJokes = require('../models/pendingJokesModel')

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
    },
    newJoke: async (req, res) => {
        try{
            const [chuckJoke, _id] = await new Promise ( resolve => 
                axios.get("https://api.chucknorris.io/jokes/random")
                .then(res =>  resolve( [res.data.value, res.data.id] ))
            ) 

            let yodaJoke = await new Promise ( (resolve, reject) => 
                axios.post("https://api.funtranslations.com/translate/yoda.json", { "text" : chuckJoke } )
                .then( res => {console.log(res.data);resolve(res.data.contents.translated)}) 
                .catch( reject)
            )
             
            yodaJoke = yodaJoke.replace("chuck", "Chuck")
            yodaJoke = yodaJoke.replace("norris", "Norris")
            yodaJoke += "." 

            //Add the joke to the db 
            Jokes.create(
                {  
                    _id: _id,
                    joke: yodaJoke,
                    score: 0
                },
                (err, data) => sendResponse(res, err, data)
            )  
        }
        catch(e){    
            res.json({ success: false, message: "Couldn't get joke at the moment" })
        } 
    },
    vote: (req, res) => { 
        let value = 0 
        const BAD_REQUEST_MESSAGE = "please provide json similar to this: \{\"message\" : \"like/dislike\"\}" 

        if (req.body.message == "like")
            value = 1
        else if (req.body.message == "dislike")
            value = -1
         
        if (value == 0 || req.body.message == undefined) {
            res.status(400);
            res.send(BAD_REQUEST_MESSAGE);
        }
        else {  
            Jokes.findOneAndUpdate(
                { _id : req.params.id }, 
                { $inc : {score : value} },
                (err, data) => sendResponse(res, err, data)
            )
        }
    }
}
module.exports = controller