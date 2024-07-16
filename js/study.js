let detectedCountryName = "";

document.addEventListener("DOMContentLoaded", () => {
  const apiKey = "N3oH2czgVhWEs8fQtIJeRsBZlYE6jzAJcNKdev0h8cE";
  let mymap;

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      function (position) {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;

        console.log("Latitude: " + latitude);
        console.log("Longitude: " + longitude);

        // Call getCountryName function
        getCountryName(latitude, longitude)
          .then((countryName) => {
            console.log("Country Name: " + countryName);

            // Call fetchCountryDataByName function
            return fetchCountryDataByName(countryName);
          })
          .then((countryData) => {
            console.log("Country Data:", countryData);
            // Display country data
            displayCountryData(countryData);

            // Display map with current location
            displayMap(latitude, longitude, countryData.name.common);

            // Fetch and display random image
            getRandomImage(countryData.name.common)
              .then((image) => {
                displayRandomImage(image);
                detectedCountryName = countryData.name.common;
              })
              .catch((error) => {
                console.error("Error fetching random image:", error);
              });
          })
          .catch((error) => {
            console.error("Error:", error);
          });
      },
      function (error) {
        console.error("Error Code = " + error.code + " - " + error.message);
      }
    );
  } else {
    console.error("Geolocation is not supported by this browser.");
  }

  // Add event listener to the search button
  document.getElementById("searchbtn").addEventListener("click", () => {
    const countryInput = document.getElementById("countryInput").value;
    if (countryInput) {
      fetchCountryDataByName(countryInput)
        .then((countryData) => {
          console.log("Country Data:", countryData);
          // Display country data
          displayCountryData(countryData);

          // Geocode the country name to get coordinates
          geocodeCountryName(countryData.name.common)
            .then(({ latitude, longitude }) => {
              // Display map with the searched country location
              displayMap(latitude, longitude, countryData.name.common);

              // Fetch and display random image
              getRandomImage(countryData.name.common)
                .then((image) => {
                  displayRandomImage(image);
                })
                .catch((error) => {
                  console.error("Error fetching random image:", error);
                });
            })
            .catch((error) => {
              console.error("Error:", error);
            });
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    }
  });

  // Add event listener to the random image button
  const randomImageBtn = document.getElementById("randomImageBtn");
  randomImageBtn.addEventListener("click", () => {
    const countryInput = document.getElementById("countryInput").value;
    const countryNameToUse = countryInput || detectedCountryName; // Use input or stored country name

    if (countryNameToUse) {
      getRandomImage(countryNameToUse)
        .then((image) => {
          displayRandomImage(image);
        })
        .catch((error) => {
          console.error("Error fetching random image:", error);
        });
    } else {
      console.error(
        "No country input provided and no detected country name available."
      );
      // Optionally, you could display a message to the user
      alert(
        "Please enter a country name or allow geolocation to detect your country."
      );
    }
  });

  function getCountryName(latitude, longitude) {
    return new Promise((resolve, reject) => {
      fetch(
        `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
      )
        .then((response) => response.json())
        .then((data) => {
          console.log(data);
          if (data.countryCode) {
            resolve(data.countryCode);
          } else if (data.countryName) {
            resolve(data.countryName);
          } else {
            reject("Country not found.");
          }
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  function fetchCountryDataByName(country) {
    const url = `https://restcountries.com/v3.1/name/${country}`;

    return fetch(url)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        if (data.length > 0) {
          return data[0]; // Return the first result (assuming exact match)
        } else {
          throw new Error(`Country '${country}' not found.`);
        }
      });
  }

  function getRandomImage(country) {
    const perPage = 30; // Number of results per page
    const url = `https://api.unsplash.com/search/photos?query=${country}&client_id=${apiKey}&per_page=${perPage}&page=1`;

    return fetch(url)
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        if (data.results.length > 0) {
          const randomIndex = Math.floor(Math.random() * data.results.length);
          return data.results[randomIndex];
        } else {
          throw new Error(`No images found for '${country}' on Unsplash.`);
        }
      });
  }

  function displayCountryData(countryData) {
    const countryNameDisplay = document.getElementById("countryNameDisplay");
    const countryStats = document.getElementById("countryStats");
    const countryFlag = document.getElementById("countryFlag");
    const countryCoat = document.getElementById("countryCoat");

    const countryName = countryData.name.common;
    countryNameDisplay.innerHTML = `<img src="./images/earth-icon.svg" alt="earth map" height="90px"> ${countryName}`;

    // Clear previous data
    countryStats.innerHTML = "";

    // Display country stats
    countryStats.innerHTML += `<p>Capital City: ${
      countryData.capital ? countryData.capital[0] : "N/A"
    }</p>`;
    countryStats.innerHTML += `<p>Population: ${countryData.population.toLocaleString()}</p>`;
    countryStats.innerHTML += `<p>Languages: ${Object.values(
      countryData.languages
    ).join(", ")}</p>`;
    countryStats.innerHTML += `<p>Continent: ${countryData.continents[0]}</p>`;
    countryStats.innerHTML += `<p>Sub-region: ${countryData.subregion}</p>`;
    countryStats.innerHTML += `<p>Currencies: ${Object.values(
      countryData.currencies
    )
      .map((currency) => currency.name)
      .join(", ")}</p>`;

    // Display flag
    countryFlag.src = countryData.flags.png;
    countryFlag.alt = `${countryData.name.common} Flag`;

    // Display coat of arms
    countryCoat.src = countryData.coatOfArms.png;
    countryCoat.alt = `${countryData.name.common} Coat of Arms`;
  }

  function displayRandomImage(image) {
    console.log(image);
    const randomImage = document.getElementById("randomImage");
    const randomImageDescription = document.getElementById(
      "randomImageDescription"
    );
    const randomImageTags = document.getElementById("randomImageTags");
    const randomImageUser = document.getElementById("randomImageUser");

    randomImage.src = image.urls.regular;
    randomImage.alt = `Description: ${
      image.alt_description || "No description available."
    }`;
    randomImageDescription.innerHTML = `<strong>Description:</strong> ${
      image.description || image.alt_description || "No description available."
    }`;
    randomImageTags.innerHTML = `<strong>Tags:</strong> ${image.tags
      .map((tag) => tag.title)
      .join(", ")}`;
    randomImageUser.innerHTML = `<strong>Unsplash Photographer:</strong> ${image.user.name}`;
  }

  function displayMap(latitude, longitude, countryName) {
    const mapElement = document.getElementById("map");

    // Initialize map or set view if map already exists
    if (!mymap) {
      mymap = L.map(mapElement).setView([latitude, longitude], 5);
    } else {
      mymap.setView([latitude, longitude], 5);
    }

    // Add OpenStreetMap tiles to the map
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(mymap);

    // Add a marker to the map at the current location
    const marker = L.marker([latitude, longitude]).addTo(mymap);
    marker.bindPopup(`${countryName} is here!`).openPopup();
  }

  function geocodeCountryName(countryName) {
    const url = `https://nominatim.openstreetmap.org/search?q=${countryName}&format=json&limit=1`;

    return fetch(url)
      .then((response) => response.json())
      .then((data) => {
        if (data.length > 0) {
          const { lat, lon } = data[0];
          return { latitude: parseFloat(lat), longitude: parseFloat(lon) };
        } else {
          throw new Error(`Geocoding failed for '${countryName}'.`);
        }
      });
  }
});
