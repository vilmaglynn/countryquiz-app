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
      // Log the data to the console or display on screen
      console.log("Country Data:", data);
    })
    .catch((error) => {
      // Log any errors that occur during the fetch
      console.error("Error fetching country data:", error);
    });
}

// Call the function with "Austria" to fetch and log the data
fetchCountryDataByName("united kingdom");
fetchCountryDataByName("england");
fetchCountryDataByName("honduras");
fetchCountryDataByName("scotland");
fetchCountryDataByName("spain");
fetchCountryDataByName("italy");
fetchCountryDataByName("ireland");
