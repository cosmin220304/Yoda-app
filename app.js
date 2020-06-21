const express= require('express');
const mongoose= require('mongoose');
const bodyParser= require('body-parser'); 
const PORT = process.env.PORT || 8000;

//Connecting to db
const DB_URL = 'mongodb+srv://cosmin0123:oxzJe52XtyO7hghR@jokescluster-oqxyy.mongodb.net/Yoda-App?retryWrites=true&w=majority'; 
mongoose.set('useNewUrlParser', true);
mongoose.set('useUnifiedTopology', true);
mongoose.connect(DB_URL, 
  err => { 
    if(err) 
      console.log(err) 
  }
)

//Starting app with express
const app = express();
app.use(bodyParser.json());
app.use(express.static("public"));
const yodaJokesRoutes = require('./routes/yodaJokesRoutes.js')(app)
const homeRoutes = require('./routes/homeRoutes.js')(app)
const topJokesRoutes = require('./routes/topJokesRoutes')(app)
app.listen(PORT, ()=>{
	console.log(`Server running at http://127.0.0.1:${PORT}`)
}) 
  