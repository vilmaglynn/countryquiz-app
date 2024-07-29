let displayedCountryName = ""; // Global variable to store the displayed country name

function playGame() {
  let buttonPlay = document.getElementById("buttonPlay");
  buttonPlay.addEventListener("click", fetchAndDisplayCountries);
}

// Fetch data from the REST Countries API
function fetchCountries() {
  const url = "https://restcountries.com/v3.1/all";

  return fetch(url)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok " + response.statusText);
      }
      return response.json();
    })
    .then((data) => {
      // Filter data to include only independent countries
      const independentCountries = data.filter(
        (country) => country.independent
      );
      return independentCountries;
    });
}

// Function to get a specified number of random countries from the data
function getRandomCountries(data, num) {
  let shuffled = data.sort(() => 0.5 - Math.random());
  return shuffled.slice(0, num);
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
  const shuffledCountries = shuffleArray(countries);

  document.getElementById("flag1").src = shuffledCountries[0].flags.svg;
  document.getElementById("flag2").src = shuffledCountries[1].flags.svg;
  document.getElementById("flag3").src = shuffledCountries[2].flags.svg;

  const randomIndex = Math.floor(Math.random() * 3);
  displayedCountryName = shuffledCountries[randomIndex].name.common; // Set the global variable
  document.getElementById("countryName").textContent = displayedCountryName;

  document
    .getElementById("flag1")
    .addEventListener("click", () =>
      flagClicked(shuffledCountries[0].name.common)
    );
  document
    .getElementById("flag2")
    .addEventListener("click", () =>
      flagClicked(shuffledCountries[1].name.common)
    );
  document
    .getElementById("flag3")
    .addEventListener("click", () =>
      flagClicked(shuffledCountries[2].name.common)
    );
}

// Function to handle flag click
function flagClicked(countryName) {
  const resultElement = document.getElementById("result");
  const correctSound = document.getElementById("correctSound");
  const wrongSound = document.getElementById("wrongSound");

  if (countryName === displayedCountryName) {
    resultElement.innerHTML = `<i class="fa-solid fa-square-check correct"></i>`;
    correctSound
      .play()
      .catch((error) => console.error("Error playing correct sound:", error)); // Play the correct sound
  } else {
    resultElement.innerHTML = `<i class="fa-solid fa-square-xmark wrong"></i>`;
    wrongSound
      .play()
      .catch((error) => console.error("Error playing wrong sound:", error)); // Play the wrong sound
  }

  // Wait for 2 seconds before fetching and displaying new countries
  setTimeout(() => {
    resultElement.innerHTML = ""; // Clear the result icon
    fetchAndDisplayCountries();
  }, 2000);
}

// Main function to fetch and display three random independent countries
function fetchAndDisplayCountries() {
  fetchCountries()
    .then((independentCountries) => {
      const countries = getRandomCountries(independentCountries, 3);
      displayFlags(countries);
    })
    .catch((error) => {
      console.error("There was a problem with the fetch operation:", error);
    });
}

// Initialize the game
playGame();
