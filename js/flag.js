document.addEventListener("DOMContentLoaded", () => {
  playGame();
});

function playGame() {
  const buttonPlay = document.getElementById("buttonPlay");
  buttonPlay.addEventListener("click", fetchAndDisplayCountries);
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

  flagElements.forEach((flagElement, index) => {
    flagElement.src = shuffledCountries[index].flags.svg;
    flagElement.onclick = () =>
      flagClicked(
        shuffledCountries[index].name.common,
        shuffledCountries[randomIndex].name.common
      );
  });

  const randomIndex = Math.floor(Math.random() * 3);
  document.getElementById("countryName").textContent =
    shuffledCountries[randomIndex].name.common;
}

// Function to handle flag click
function flagClicked(clickedCountryName, correctCountryName) {
  const resultElement = document.getElementById("result");
  const correctSound = document.getElementById("correctSound");
  const wrongSound = document.getElementById("wrongSound");

  if (clickedCountryName === correctCountryName) {
    resultElement.innerHTML = `<i class="fa-solid fa-square-check correct"></i>`;
    playSound(correctSound);
  } else {
    resultElement.innerHTML = `<i class="fa-solid fa-square-xmark wrong"></i>`;
    playSound(wrongSound);
  }

  // Wait for 2 seconds before fetching and displaying new countries
  setTimeout(() => {
    resultElement.innerHTML = ""; // Clear the result icon
    fetchAndDisplayCountries();
  }, 2000);
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
