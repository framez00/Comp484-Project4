const testWrapper = document.querySelector(".test-wrapper");
const testArea = document.querySelector("#test-area");
const originText = document.querySelector("#origin-text p").innerHTML;
const resetButton = document.querySelector("#reset");
const theTimer = document.querySelector(".timer");

let timer = [0,0,0];
let interval = null;
let timerRunning = false;
let errors = 0;


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
    if(typedText === originText){
        clearInterval(interval);
        timerRunning = false;
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
    clearInterval(interval);
    interval = null;
    timer = [0,0,0];
    timerRunning = false;
    testArea.value = "";
    theTimer.innerHTML = "00:00:00";
}

// Event listeners for keyboard input and the reset button:
testArea.addEventListener("keypress", start);
testArea.addEventListener("keyup", matchText);
resetButton.addEventListener("click", reset);