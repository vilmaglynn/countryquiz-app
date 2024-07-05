// Get references to the input, button elements, and all other id elements
const countryInput = document.getElementById("countryInput");
const searchbtn = document.getElementById("searchbtn");
const countryNameDisplay = document.getElementById("countryNameDisplay");

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

      // Call the function to display the country data
      displayCountryData(data);
    })
    .catch((error) => {
      // Log any errors that occur during the fetch
      console.error("Error fetching country data:", error);
    });
}

// Function to display the country data
function displayCountryData(data) {
  // Extract the common name of the country from the first element of the data array
  const countryName = data[0].name.common;

  // Display the country name in the h1 element
  countryNameDisplay.innerHTML = `<img src="./images/earth-icon.svg" alt="" height="90px"> ${countryName}`;
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
