var seq = [];
var colors = ["red", "blue", "yellow", "green"];
var lightIndex = 0;
var lightOn = false;
var lights;
var playerTurn = false;
var playerTime;
var highScore = 0;
// console cheat 
// setInterval(function(){console.log(seq[lightIndex])}, 100);

document.getElementById(colors[0]).onclick = function(){
    press(colors[0]);
};
document.getElementById(colors[1]).onclick = function(){
    press(colors[1]);
};
document.getElementById(colors[2]).onclick = function(){
    press(colors[2]);
};
document.getElementById(colors[3]).onclick = function(){
    press(colors[3]);
};

document.onkeypress = function(event){
    switch(event.key) {
        case "q":
            press(colors[0]);
            break;
        case "w":
            press(colors[1]);
            break;
        case "a":
            press(colors[2]);
            break;
        case "s":
            press(colors[3]);
            break;
    }
}

loadScore();

cpuTurn();

function loadScore() {
    var score = localStorage.highScore;
    if(score) {
        document.getElementById("high-score").innerHTML = localStorage.highScore;
        highScore = score;
    }
}

function cpuTurn() {
    playerTurn = false;
    if(updateScore() == "TAMPERED") {
        scoreTampered();
    } else {
        addSeq();
        lights = setInterval(playSeq, 500);
    }
}

function updateScore() {
    var score = seq.length;
    var highScoreDisplay = document.getElementById("high-score");
    document.getElementById("score").innerHTML = score;
    // A couple simple checks to make sure the score isn't manipulated. The best method for this would
    // be to store a hash of the high score and check that the hash of the high score is the same 
    // recorded hash value.
    // Easy way to bypass the below checks, set the localStorage.highScore and refresh the page before
    // it runs updateScore().
    if(localStorage.highScore != highScore || highScoreDisplay.innerHTML != highScore) {
        return "TAMPERED";
    }
    if(score > highScore) {
        if(score - highScore != 1) {
            return "TAMPERED";
        } else {
            highScore = score;
            highScoreDisplay.innerHTML = highScore;
            localStorage.highScore = highScore;
        }
    }
}

function scoreTampered() {
    console.log("TAMPERED");
    localStorage.highScore = 0;
    highScore = 0;
    playerLoss();
}

function addSeq() {
    var randColor = Math.floor(Math.random() * 4);
    seq.push(colors[randColor]);
}

function playSeq() {
    var segment = document.getElementById(seq[lightIndex]);
    segment.classList.toggle("light");
    if(lightOn) {
        lightIndex += 1;
    }
    lightOn = !lightOn;
    if(lightIndex == seq.length) {
        clearInterval(lights);
        playerInput();
    }
}

function playerInput() {
    lightIndex = 0;
    playerTurn = true;
    playerTime = setTimeout(playerLoss, 2000);
}

function press(color) {
    if(playerTurn) {
        clearTimeout(playerTime);
        if(color == seq[lightIndex]) {
            lightUp(color);
            playerTime = setTimeout(playerLoss, 1500);
            lightIndex += 1;
        } else {
            playerTurn = false;
            playerLoss();
        }
        if(lightIndex == seq.length) {
            playerTurn = false;
            correctSeq();
        }
    }
}

function lightUp(color) {
    document.getElementById(color).classList.toggle("light");
    setTimeout(function() {
        document.getElementById(color).classList.toggle("light");
    }, 100);
}

function correctSeq() {
    document.getElementById("simon-says").classList.toggle("correct");
    setTimeout(function() {
        document.getElementById("simon-says").classList.toggle("correct");
        clearTimeout(playerTime);
        lightIndex = 0;
        cpuTurn();
    }, 250);
}

function playerLoss() {
    document.getElementById("simon-says").classList.toggle("loss");
    setTimeout(function() {
        document.getElementById("simon-says").classList.toggle("loss");
        seq = [];
        lightIndex = 0;
        cpuTurn();
    }, 250);
}