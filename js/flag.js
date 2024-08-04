document.addEventListener("DOMContentLoaded", () => {
  playGame();
});

let timerInterval;
let displayCounter = 0; // Global counter for the number of displays
let correctAnswerCounter = 0; // Global counter for correct answers

// Timer to the game
function startTimer() {
  const timerDisplay = document.getElementById("timerDisplay");
  let timeRemaining = 30; // Time in seconds

  // Update the timer display
  timerDisplay.textContent = `Time Remaining: ${timeRemaining}`;

  // Clear any existing intervals
  clearInterval(timerInterval);

  // Set up the interval to count down every second
  timerInterval = setInterval(() => {
    timeRemaining--;

    // Update the timer display
    timerDisplay.textContent = `Time Remaining: ${timeRemaining}`;

    // Check if the timer has reached zero
    if (timeRemaining <= 0) {
      clearInterval(timerInterval);
      endGame();
    }
  }, 1000);
}

// Initiate the game
function playGame() {
  const buttonPlay = document.getElementById("buttonPlay");
  buttonPlay.addEventListener("click", () => {
    resetGame(); // Reset the game state when starting a new game
    fetchAndDisplayCountries();
    startTimer();
  });
}

// Fetch data from the REST Countries API
async function fetchCountries() {
  const url = "https://restcountries.com/v3.1/all";

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Network response was not ok: ${response.statusText}`);
    }
    const data = await response.json();
    return data.filter((country) => country.independent);
  } catch (error) {
    console.error("There was a problem with the fetch operation:", error);
    throw error;
  }
}

// Function to get a specified number of random countries from the data
function getRandomCountries(data, num) {
  return shuffleArray(data).slice(0, num);
}

// Function to shuffle an array
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

// Function to display the flags and set up event listeners
function displayFlags(countries) {
  const flagElements = [
    document.getElementById("flag1"),
    document.getElementById("flag2"),
    document.getElementById("flag3")
  ];

  const shuffledCountries = shuffleArray(countries);

  const randomIndex = Math.floor(Math.random() * 3);
  document.getElementById("countryName").textContent =
    shuffledCountries[randomIndex].name.common;

  flagElements.forEach((flagElement, index) => {
    flagElement.src = shuffledCountries[index].flags.svg;
    flagElement.onclick = () =>
      flagClicked(
        shuffledCountries[index].name.common,
        shuffledCountries[randomIndex].name.common
      );
  });

  displayCounter++; // Increment the display counter

  // Check if the display counter has reached 10
  if (displayCounter === 11) {
    endGame();
  }
}

// Function to handle flag click
function flagClicked(clickedCountryName, correctCountryName) {
  const resultElement = document.getElementById("result");
  const correctSound = document.getElementById("correctSound");
  const wrongSound = document.getElementById("wrongSound");
  let score = document.getElementById("score");

  if (clickedCountryName === correctCountryName) {
    resultElement.innerHTML = `<i class="fa-solid fa-square-check correct"></i>`;
    playSound(correctSound);
    correctAnswerCounter++; // Increment the counter
  } else {
    resultElement.innerHTML = `<i class="fa-solid fa-square-xmark wrong"></i>`;
    playSound(wrongSound);
  }

  score.textContent = `${correctAnswerCounter} / ${displayCounter}`;

  // Wait for 1 second before fetching and displaying new countries if the game is not over
  setTimeout(() => {
    resultElement.innerHTML = ""; // Clear the result icon
    if (displayCounter < 11) {
      fetchAndDisplayCountries();
    }
  }, 1000);
}

function playSound(soundElement) {
  soundElement.play().catch((error) => {
    console.error("Error playing sound:", error);
  });
}

// Main function to fetch and display three random independent countries
async function fetchAndDisplayCountries() {
  try {
    const independentCountries = await fetchCountries();
    const countries = getRandomCountries(independentCountries, 3);
    displayFlags(countries);
  } catch (error) {
    console.error(
      "There was a problem with the fetch and display operation:",
      error
    );
  }
}

// Function to end the game
function endGame() {
  const gameover = document.getElementById("gameover");
  clearInterval(timerInterval); // Stop the timer
  const resultElement = document.getElementById("result");
  resultElement.textContent = "Game Over!";
  resultElement.classList.add("game-over"); // Add the game-over class
  playSound(gameover);
  // Disable further interactions
  document.getElementById("flag1").onclick = null;
  document.getElementById("flag2").onclick = null;
  document.getElementById("flag3").onclick = null;
}

// Function to reset the game state
function resetGame() {
  clearInterval(timerInterval); // Clear any existing timer
  document.getElementById("result").textContent = ""; // Clear the result message
  document.getElementById("timerDisplay").textContent = ""; // Clear the timer display
  document.getElementById("score").textContent = "0 / 10"; // Reset the score display
  displayCounter = 0; // Reset the display counter
  correctAnswerCounter = 0; // Reset the correct answer counter
}
