var scores, roundScore, activePlayer, gamePlaying;

init();

// Function to speak a message using the Web Speech API
function speak(message) {
  var speech = new SpeechSynthesisUtterance(message);

  // Select a female voice in the desired language
  var voices = window.speechSynthesis.getVoices();
  var selectedVoice = voices.find(function (voice) {
    return voice.lang === "en-US" && voice.gender === "female";
  });

  // If no suitable voice is found, use the default voice
  speech.voice = selectedVoice || voices[0];

  speech.rate = 1.0;
  speech.pitch = 1.5;
  window.speechSynthesis.speak(speech);
}

document.querySelector(".btn-roll").addEventListener("click", function () {
  if (gamePlaying) {
    // Disable the button to prevent multiple clicks during the delay
    this.disabled = true;

    // 1. Random number
    var dice = Math.floor(Math.random() * 6) + 1;

    // 2. Display the result
    var diceDOM = document.querySelector(".dice");
    diceDOM.style.display = "block";
    diceDOM.src = "dice-" + dice + ".png";

    // 3. Update the round score IF the rolled number was NOT a 1
    if (dice !== 1) {
      // Add score
      roundScore += dice;
      document.querySelector("#current-" + activePlayer).textContent =
        roundScore;
    } else {
      // Next player
      speak("Oops, you got 1");
      nextPlayer();
    }

    // Enable the button after a 1-second delay
    setTimeout(function () {
      document.querySelector(".btn-roll").disabled = false;
    }, 500);
  }
});

document.querySelector(".btn-hold").addEventListener("click", function () {
  if (gamePlaying) {
    // Add CURRENT score to GLOBAL score
    scores[activePlayer] += roundScore;

    // Update the UI
    document.querySelector("#score-" + activePlayer).textContent =
      scores[activePlayer];

    // Check if player won the game
    if (scores[activePlayer] >= 100) {
      speak("Winner");
      document.querySelector("#name-" + activePlayer).textContent = "Winner!";
      document.querySelector(".dice").style.display = "none";
      document
        .querySelector(".player-" + activePlayer + "-panel")
        .classList.add("winner");
      document
        .querySelector(".player-" + activePlayer + "-panel")
        .classList.remove("active");
      gamePlaying = false;
    } else {
      //Next player
      nextPlayer();
    }
  }
});

function nextPlayer() {
  //Next player
  activePlayer === 0 ? (activePlayer = 1) : (activePlayer = 0);
  roundScore = 0;

  document.getElementById("current-0").textContent = "0";
  document.getElementById("current-1").textContent = "0";

  document.querySelector(".player-0-panel").classList.toggle("active");
  document.querySelector(".player-1-panel").classList.toggle("active");
}

document.querySelector(".btn-new").addEventListener("click", init);

function init() {
  scores = [0, 0];
  activePlayer = 0;
  roundScore = 0;
  gamePlaying = true;

  document.querySelector(".dice").style.display = "none";

  document.getElementById("score-0").textContent = "0";
  document.getElementById("score-1").textContent = "0";
  document.getElementById("current-0").textContent = "0";
  document.getElementById("current-1").textContent = "0";

  // Prompt for player names and set them
  var player1Name = prompt("Enter Player 1's name:");
  var player2Name = prompt("Enter Player 2's name:");
  document.getElementById("name-0").textContent = player1Name;
  document.getElementById("name-1").textContent = player2Name;

  document.querySelector(".player-0-panel").classList.remove("winner");
  document.querySelector(".player-1-panel").classList.remove("winner");
  document.querySelector(".player-0-panel").classList.remove("active");
  document.querySelector(".player-1-panel").classList.remove("active");
  document.querySelector(".player-0-panel").classList.add("active");
}
