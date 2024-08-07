document.addEventListener("DOMContentLoaded", () => {
  playGame();
});

let timerInterval;
let displayCounter = 0; // Global counter for the number of displays
let correctAnswerCounter = 0; // Global counter for correct answers

// Timer to the game
function startTimer() {
  const timerDisplay = document.getElementById("timerDisplay");
  let timeRemaining = 40; // Time in seconds

  // Clear any existing intervals
  clearInterval(timerInterval);

  // Set up the interval to count down every second
  timerInterval = setInterval(() => {
    timeRemaining--;

    // Update the timer display
    timerDisplay.textContent = `Timer: ${timeRemaining}s`;

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

// Function to generate a random hex color
function getRandomHexColor() {
  const randomInt = Math.floor(Math.random() * 16777215);
  const hexColor = `#${randomInt.toString(16).padStart(6, "0")}`;
  return hexColor;
}

// Function to display the capitals and set up event listeners
function displayCapitals(countries) {
  const capitalElements = [
    document.getElementById("capital1"),
    document.getElementById("capital2"),
    document.getElementById("capital3")
  ];

  const shuffledCountries = shuffleArray(countries);

  const randomIndex = Math.floor(Math.random() * 3);
  document.getElementById("countryName").textContent =
    shuffledCountries[randomIndex].name.common;

  capitalElements.forEach((capitalElement, index) => {
    capitalElement.textContent = shuffledCountries[index].capital[0]; // Capital is an array, select the first element
    capitalElement.style.backgroundColor = getRandomHexColor(); // Set random background color

    // Add styling to the text
    capitalElement.classList.add("capital-text");

    capitalElement.onclick = () =>
      capitalClicked(
        shuffledCountries[index].capital[0], // Pass the capital name
        shuffledCountries[randomIndex].capital[0] // Pass the correct capital name
      );
  });

  displayCounter++; // Increment the display counter
}

// Function to handle capital click
function capitalClicked(clickedCapitalName, correctCapitalName) {
  const resultElement = document.getElementById("result");
  const correctSound = document.getElementById("correctSound");
  const wrongSound = document.getElementById("wrongSound");
  let score = document.getElementById("score");

  if (clickedCapitalName === correctCapitalName) {
    resultElement.innerHTML = `<i class="fa-solid fa-square-check correct"></i>`;
    playSound(correctSound);
    correctAnswerCounter++; // Increment the counter
  } else {
    resultElement.innerHTML = `<i class="fa-solid fa-square-xmark wrong"></i>`;
    playSound(wrongSound);
  }

  score.textContent = `${correctAnswerCounter} / ${displayCounter}`;

  // Check if the display counter has reached 10
  if (displayCounter >= 10) {
    endGame();
  } else {
    // Wait for 1 second before fetching and displaying new countries if the game is not over
    setTimeout(() => {
      resultElement.innerHTML = ""; // Clear the result icon
      fetchAndDisplayCountries();
    }, 1000);
  }
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
    displayCapitals(countries);
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
  document.getElementById("capital1").onclick = null;
  document.getElementById("capital2").onclick = null;
  document.getElementById("capital3").onclick = null;
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
