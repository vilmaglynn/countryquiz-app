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
  // Construct the URL with the given country name
  const url = `https://restcountries.com/v3.1/name/${country}`;

  // Use fetch to make the API request
  fetch(url)
    .then((response) => {
      // Check if the response is successful
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      // Parse the response as JSON
      return response.json();
    })
    .then((data) => {
      // Log the data to the console
      console.log("Country Data:", data);
      console.log(data[0].coatOfArms.svg);

      // Call the function to display the country data
      displayCountryData(data);
    })
    .catch((error) => {
      // Log any errors that occur during the fetch
      console.error("Error fetching country data:", error);
    });
}

// Function to create and append a paragraph element with text
function createAndAppendParagraph(parent, label, value) {
  const paragraph = document.createElement("p");
  paragraph.textContent = `${label}: ${value}`;
  parent.appendChild(paragraph);
}

// Function to display the country data
function displayCountryData(data) {
  // Extract the common name of the country from the first element of the data array
  const countryName = data[0].name.common;

  // Display the country name in the h1 element
  countryNameDisplay.innerHTML = `<img src="./images/earth-icon.svg" alt="earth map" height="90px"> ${countryName}`;

  // COUNTRY STATS
  // Clear previous country stats
  countryStats.innerHTML = "";

  // Extract and display the capital city
  const capitalCity = data[0].capital ? data[0].capital[0] : "N/A";
  createAndAppendParagraph(countryStats, "Capital City", capitalCity);

  // Extract and display the population
  const population = data[0].population.toLocaleString();
  createAndAppendParagraph(countryStats, "Population", population);

  // Extract and display the languages
  const languages = data[0].languages
    ? Object.values(data[0].languages).join(", ")
    : "N/A";
  createAndAppendParagraph(countryStats, "Languages", languages);

  // Extract and display the continent
  const continent = data[0].continents ? data[0].continents[0] : "N/A";
  createAndAppendParagraph(countryStats, "Continent", continent);

  // Extract and display the sub-region
  const subRegion = data[0].subregion || "N/A";
  createAndAppendParagraph(countryStats, "Sub-region", subRegion);

  // Extract and display the currencies
  const currencies = data[0].currencies
    ? Object.values(data[0].currencies)
        .map((currency) => currency.name)
        .join(", ")
    : "N/A";
  createAndAppendParagraph(countryStats, "Currencies", currencies);

  // FLAG
  // Extract and display the flag
  const flagUrl = data[0].flags.svg;
  const flagAlt = data[0].flags.alt;

  // Update the flag image
  countryFlag.src = flagUrl;
  countryFlag.alt = flagAlt;

  // COAT OF ARMS
  // Extract and display the coat of arms
  const coatUrl = data[0].coatOfArms.svg;
  const coatAlt = `Coat of arms of ${countryName}`;

  // Update the flag image
  countryCoat.src = coatUrl;
  countryCoat.alt = coatAlt;
}

// Add event listener to the form submission
const searchForm = document.getElementById("searchForm");
searchForm.addEventListener("submit", (event) => {
  // Prevent the default form submission
  event.preventDefault();

  // Get the value from the input field
  const countryName = countryInput.value.trim();

  // Check if the input is not empty
  if (countryName) {
    // Fetch and log the country data
    fetchCountryDataByName(countryName);
  } else {
    console.warn("Please enter a country name.");
  }
});
