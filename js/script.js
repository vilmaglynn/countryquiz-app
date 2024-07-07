//main ./js/script.js

import { getCountryFromGeolocation } from "./autolocation.js";
import { getRandomImage } from "./randomImage.js";

// Get references to the input, button elements, and the stats container
const countryInput = document.getElementById("countryInput");
const searchbtn = document.getElementById("searchbtn");
const countryNameDisplay = document.getElementById("countryNameDisplay");
const countryStats = document.getElementById("countryStats");
const flagContainer = document.getElementById("flagContainer");
const countryFlag = document.getElementById("countryFlag");
const countryCoat = document.getElementById("countryCoat");

// Function to fetch country data by name
function fetchCountryDataByName(country) {
  const url = `https://restcountries.com/v3.1/name/${country}`;

  fetch(url)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      console.log("Country Data:", data);
      displayCountryData(data);
    })
    .catch((error) => {
      console.error("Error fetching country data:", error);
    });
}

// Function to create and append a paragraph element with styled label text
function createAndAppendParagraph(parent, label, value) {
  const paragraph = document.createElement("p");
  paragraph.innerHTML = `<span class="countryStatsLabel">${label}:</span> ${value}`;
  parent.appendChild(paragraph);
}

// Function to display the country data
function displayCountryData(data) {
  const countryName = data[0].name.common;
  countryNameDisplay.innerHTML = `<img src="./images/earth-icon.svg" alt="earth map" height="90px"> ${countryName}`;

  countryStats.innerHTML = "";

  const capitalCity = data[0].capital ? data[0].capital[0] : "N/A";
  createAndAppendParagraph(countryStats, "Capital City", capitalCity);

  const population = data[0].population.toLocaleString();
  createAndAppendParagraph(countryStats, "Population", population);

  const languages = data[0].languages
    ? Object.values(data[0].languages).join(", ")
    : "N/A";
  createAndAppendParagraph(countryStats, "Languages", languages);

  const continent = data[0].continents ? data[0].continents[0] : "N/A";
  createAndAppendParagraph(countryStats, "Continent", continent);

  const subRegion = data[0].subregion || "N/A";
  createAndAppendParagraph(countryStats, "Sub-region", subRegion);

  const currencies = data[0].currencies
    ? Object.values(data[0].currencies)
        .map((currency) => currency.name)
        .join(", ")
    : "N/A";
  createAndAppendParagraph(countryStats, "Currencies", currencies);

  const flagUrl = data[0].flags.svg;
  const flagAlt = data[0].flags.alt;
  countryFlag.src = flagUrl;
  countryFlag.alt = flagAlt;

  const coatUrl = data[0].coatOfArms.svg;
  const coatAlt = `Coat of arms of ${countryName}`;
  countryCoat.src = coatUrl;
  countryCoat.alt = coatAlt;
}

// Function to handle geolocation success
function handleGeolocationSuccess(position) {
  const { latitude, longitude } = position.coords;
  getCountryFromGeolocation(latitude, longitude)
    .then((location) => {
      const countryName =
        location.countryCode ||
        location.countryCode ||
        location.principalSubdivision;
      fetchCountryDataByName(countryName);
      getRandomImage(countryName);
    })
    .catch((error) => {
      console.error("Error getting country from geolocation:", error);
    });
}

// Function to handle geolocation error
function handleGeolocationError(error) {
  console.error("Error getting geolocation:", error);
}

// Add event listener for page load to get user's geolocation
document.addEventListener("DOMContentLoaded", () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      handleGeolocationSuccess,
      handleGeolocationError
    );
  } else {
    console.warn("Geolocation is not supported by this browser.");
  }
});

// Add event listener to the form submission for manual country search
const searchForm = document.getElementById("searchForm");
searchForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const countryName = countryInput.value.trim();
  if (countryName) {
    fetchCountryDataByName(countryName);
  } else {
    console.warn("Please enter a country name.");
  }
});
