const testWrapper = document.querySelector(".test-wrapper");
const testArea = document.querySelector("#test-area");
const originText = document.querySelector("#origin-text p").innerHTML;
const resetButton = document.querySelector("#reset");
const theTimer = document.querySelector(".timer");
const metrics = document.querySelector("#metrics");

let timer = [0,0,0];
let interval = null;
let timerRunning = false;
let errors = 0;
let lastCorrect = true; //checks if the last character was typed correctly
const texts = [
    "This is the first paragraph, start typing.",
    "Today is Sunday and I'm working on this assignment.",
    "Try to type as fast as possible without making any mistakes.",
    "I like Pokemon and I should start playing the games again.",
    "I don't know what other paragraph to type, so this is the last one.",
]


// Add leading zero to numbers 9 or below (purely for aesthetics):
function leadingZero(time){
    if(time <= 9){
        return "0" + time;
    }else{
        return time;
    }
}

// Run a standard minute/second/hundredths timer:
function runTimer(){
    //display the time
    let curTime = 
        leadingZero(timer[0]) + ":" +
        leadingZero(timer[1]) + ":" +
        leadingZero(timer[2]);
    theTimer.innerHTML = curTime;

    //increment the hundredth place
    timer[2]++;

    //set the second place
    if(timer[2] === 100){
        timer[1]++;
        timer[2] = 0;
    }

    //set the minutes
    if(timer[1] === 60){
        timer[0]++;
        timer[1] = 0;
    }
}

// Match the text entered with the provided text on the page:
function matchText(){
    //save the text
    let typedText = testArea.value;
    let currentText = document.querySelector("#origin-text p").innerHTML;
    //check while typing
    let partial = currentText.substring(0, typedText.length);

    if(typedText === currentText){
        clearInterval(interval);
        timerRunning = false;
        //change color
        testWrapper.style.borderColor = "green";
        //wmp
        let wpm = calculateWPM();
        metrics.innerHTML = "Metrics: WPM: " + wpm + " | Errors: " + errors;
        //save score
        saveScores();
    }else if(typedText === partial){
        //change color while user is typing correctly
        testWrapper.style.borderColor = "blue";
        lastCorrect = true;
    }else{
        //change color when user types a mistake
        testWrapper.style.borderColor = "red";
        //check if last character was correct so it doesnt count too many errors
        if(lastCorrect){
            errors++;
        }
        lastCorrect = false;
    }
}

// Start the timer:
function start(){
    if(!timerRunning){
        timerRunning = true;
        interval = setInterval(runTimer, 10);
    }
}

// Reset everything:
function reset(){
    //reset all variables
    clearInterval(interval);
    interval = null;
    timer = [0,0,0];
    timerRunning = false;
    testArea.value = "";
    theTimer.innerHTML = "00:00:00";
    errors = 0;
    lastCorrect = true;
    //reset color to grey
    testWrapper.style.borderColor = "grey";
    //add randomizer and change the texts
    let randomIndex = Math.floor(Math.random() * texts.length);
    document.querySelector("#origin-text p").innerHTML = texts[randomIndex];
}

// Event listeners for keyboard input and the reset button:
testArea.addEventListener("keydown", start); //starts timer while typing
testArea.addEventListener("keyup", matchText); //check each typed letter
resetButton.addEventListener("click", reset); //reset after clicking Start over

// Saving the scores
function saveScores(){
    //save scores or return empty array
    let scores = JSON.parse(localStorage.getItem("scores")) || [];
    
    let time = theTimer.innerHTML;

    //convert to seconds so we can sort by fastest
    let parts = time.split(":");
    let seconds = parts[0]* 60 + parts[1]*1 + parts[2]/100;

    //add the score
    scores.push({
        time: time,
        seconds: seconds
    });
    //sort, fastest first and keep top 3
    scores.sort((a,b) => a.seconds - b.seconds);
    scores = scores.slice(0,3);

    localStorage.setItem("scores", JSON.stringify(scores));
    displayScores();

}
//display the scores
function displayScores(){
    let scores = JSON.parse(localStorage.getItem("scores")) || [];
    let scoresDiv = document.querySelector("#scores");
    let output = "";

    scores.forEach(score => {
        output+= score.time + "<br>";
    });
    scoresDiv.innerHTML = "Scores:<br>" + output;
}

//calculating wpm
function calculateWPM(){
    let currentText = document.querySelector("#origin-text p").innerHTML;
    let totalCharacters = testArea.value.length;
    let totalSeconds = timer[0] * 60 + timer[1] + timer[2] / 100;
    let wpm = (totalCharacters / 5) / (totalSeconds / 60);
    return Math.round(wpm);
}

//to reset the initial text 
reset();
displayScores();