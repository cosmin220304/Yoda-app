let sounds = []
let applause, jokeEnd, boo, lastJokeId = undefined

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms))

const upAndDown = (el, percent_distance, speed) => {
    const start = $(el).css("top").split('px')[0]
    const end = start * percent_distance

    var loop = () => {
        $(el).animate( {top : start + 'px'}, speed, 
            () => $(el).animate( {top : end + 'px'} , speed, loop)
        )
    }
    loop()
}  

const playRandomYodaSound = () => {
    const randInt = parseInt(Math.random() * 3)
    console.log(randInt)
    sounds[randInt].play()
}

const printMsgInBubble = async (msg) => { 
    const delimitators = ".,;!?"
    let words = ""

    for (let i = 0; i < msg.length; i++){
        words = words + msg[i]
        if (msg[i] != ' '){
            playRandomYodaSound()
            await sleep(100)
        }

        $('#text').text(words)

        //Pause on delimitators
        if (delimitators.includes(msg[i]))
        await sleep(100)
    }

    jokeEnd.play()
}  

const getDataFromServer = async (path) => new Promise( 
    resolve => {   
    console.log(path)
        $.ajax(path).done(res => resolve(res))
    }
)  

const showJoke = async () => { 
    $('#bubble').fadeIn(500)
    $('#text').fadeIn(500) 

    //Reset buttons
    $("#like").css("background-color", "rgb(1, 56, 1)")
    $("#dislike").css("background-color", "rgb(124, 41, 41)")
    $("#translatedText").text("")

    const spareJoke = await getDataFromServer("/jokes/random") 
    const yodaJoke = await getDataFromServer("/newJoke")
    
    if (yodaJoke.data === undefined){ 
        lastJokeId = spareJoke.data._id;
        printMsgInBubble(spareJoke.data.joke)
    } 
    else{
        lastJokeId = yodaJoke.data._id;
        printMsgInBubble(yodaJoke.data.joke) 
    }

    return false;
}  

const translateJoke = () => { 
    if (lastJokeId === undefined)
        return; 
    $.ajax("https://api.chucknorris.io/jokes/" + lastJokeId)
    .done(res => $("#translatedText").text(res.value))
}

const like = (msg) => { 
    let this_button, other_button, other_btn_color, soundToPlay

    // We want to color the buttons for feedback
    if (msg == "like") {
        this_button= $("#like")
        other_button = $("#dislike") 
        other_btn_color = "rgb(124, 41, 41)"
        soundToPlay = applause
    }
    else {
        this_button= $("#dislike")
        other_button = $("#like") 
        other_btn_color = "rgb(1, 56, 1)"
        soundToPlay = boo
    } 

    // User can't upvote a joke that we did not see yet
    // User can't upvote twice
    if (lastJokeId === undefined || this_button.css("background-color") == "rgb(255, 255, 255)")
        return;  
    
    $.ajax({
        type: 'POST',
        data: JSON.stringify({message : msg}),
        contentType: 'application/json',
        url: "/jokes/" + lastJokeId,						
        success: () => {  
            //If the other button is white, reset both buttons ( +1 -1 = 0)
            // In other words, we let the user upvote again
            if (other_button.css("background-color") == "rgb(255, 255, 255)")
                other_button.css("background-color", other_btn_color)
            else{
                this_button.css("background-color", "rgb(255, 255, 255)")  
                soundToPlay.play()
            }
        }
    });
}

//Event listeners
$('#nextJoke').on('click', () => showJoke())
$('#like').on('click', () => like("like")) 
$('#dislike').on('click', () => like("dislike")) 
$('#translate').on('click', () => translateJoke()) 

$( document ).ready(function() {
    //Animations
    upAndDown('#head', 1.25, 900) 
    upAndDown('#bubble', 1.1, 900) 
    upAndDown('#text', 1.1, 900) 

    //Prepare yoda hmm sounds 
    for (let i = 1; i <= 3; i++){
        let audio = document.createElement('audio')
        audio.setAttribute('src', "/sounds/hmm" + i + ".mp3")
        sounds.push(audio)
    }
    applause = document.createElement('audio')
    jokeEnd = document.createElement('audio')
    boo = document.createElement('audio')
    applause.setAttribute('src', "/sounds/Applause.mp3")
    jokeEnd.setAttribute('src', "/sounds/Ba Dum Tss.mp3")
    boo.setAttribute('src', "/sounds/Boo.mp3")
})  