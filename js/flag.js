// Fetch data from the REST Countries API
fetch("https://restcountries.com/v3.1/all")
  .then((response) => {
    if (!response.ok) {
      throw new Error("Network response was not ok " + response.statusText);
    }
    return response.json();
  })
  .then((data) => {
    // Process the data
    data.forEach((country) => {
      console.log(
        `Country: ${country.name.common}, Population: ${country.population}, Region: ${country.region}`
      );
    });
  })
  .catch((error) => {
    console.error("There was a problem with the fetch operation:", error);
  });
