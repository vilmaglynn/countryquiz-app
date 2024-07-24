// Fetch data from the REST Countries API

function fetch3Countries() {
  let url = "https://restcountries.com/v3.1/all";

  fetch(url)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok " + response.statusText);
      }

      return response.json();
    })
    .then((data) => {
      // Process data
      data.forEach((country) => {
        console.log(
          `Country: ${country.name.common}, Population: ${country.population}, Region: ${country.region}, ${country.flags.svg}, ${country.independent}`
        );
      });
    })
    .catch((error) => {
      console.error("There was a problem with the fetch operation:", error);
    });
}

fetch3Countries();

fetch3Countries();
