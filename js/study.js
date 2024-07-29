let detectedCountryName = "";
let countryDropdown = document.getElementById("countryDropdown");

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

        getCountryName(latitude, longitude)
          .then((countryName) => {
            console.log("Country Name: " + countryName);

            return fetchCountryDataByName(countryName);
          })
          .then((countryData) => {
            if (countryData && countryData[0]) {
              detectedCountryName = countryData[0].name.common;
              console.log("Detected Country Name: " + detectedCountryName);

              displayCountryData(countryData[0]);
              displayMap(latitude, longitude, detectedCountryName);

              return getRandomImage(detectedCountryName);
            } else {
              throw new Error("Country data is invalid.");
            }
          })
          .then((image) => {
            displayRandomImage(image);
          })
          .catch((error) => {
            showError(error.message);
            console.error("Error:", error);
          });
      },
      function (error) {
        showError(`Error Code = ${error.code} - ${error.message}`);
        console.error("Error Code = " + error.code + " - " + error.message);
      }
    );
  } else {
    showError("Geolocation is not supported by this browser.");
    console.error("Geolocation is not supported by this browser.");
  }

  const countryInput = document.getElementById("countryInput");

  countryInput.addEventListener("input", () => {
    clearMessage(); // Clear error message when input changes
    if (countryInput.value === "") {
      countryDropdown.style.display = "none";
    }
  });

  document.getElementById("searchbtn").addEventListener("click", () => {
    if (countryInput.value) {
      fetchCountryDataByName(countryInput.value)
        .then((countryData) => {
          if (countryData.length > 1) {
            displayCountryOptions(countryData);
          } else {
            if (countryData[0]) {
              displayCountryData(countryData[0]);

              geocodeCountryName(countryData[0].name.common)
                .then(({ latitude, longitude }) => {
                  displayMap(latitude, longitude, countryData[0].name.common);

                  return getRandomImage(countryData[0].name.common);
                })
                .then((image) => {
                  displayRandomImage(image);
                })
                .catch((error) => {
                  showError(error.message);
                  console.error("Error fetching random image:", error);
                });
            } else {
              throw new Error("Country data is invalid.");
            }
          }
        })
        .catch((error) => {
          showError(error.message);
          console.error("Error:", error);
        });
    }
  });

  const randomImageBtn = document.getElementById("randomImageBtn");
  randomImageBtn.addEventListener("click", () => {
    const countryNameToUse = countryInput.value || detectedCountryName;
    console.log("Country name for random image: " + countryNameToUse);

    if (countryNameToUse) {
      getRandomImage(countryNameToUse)
        .then((image) => {
          displayRandomImage(image);
        })
        .catch((error) => {
          showError(error.message);
          console.error("Error fetching random image:", error);
        });
    } else {
      showError(
        "Please enter a country name or allow geolocation to detect your country."
      );
      console.error(
        "No country input provided and no detected country name available."
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
          showError("Country name not found");
          throw new Error(`Country '${country}' not found.`);
        }
        return response.json();
      })
      .then((data) => {
        console.log(data);
        if (data.length > 0) {
          return data;
        } else {
          throw new Error(`Country '${country}' not found.`);
        }
      });
  }

  function displayCountryOptions(countries) {
    countryDropdown.innerHTML = "";
    countryDropdown.style.display = "block";

    countries.forEach((country) => {
      const countryItem = document.createElement("div");
      countryItem.textContent = `${country.name.common}, ${country.region}`;
      countryItem.className = "dropdown-item";
      countryItem.onclick = () => {
        countryInput.value = country.name.common;
        countryDropdown.style.display = "none";

        displayCountryData(country);

        geocodeCountryName(country.name.common)
          .then(({ latitude, longitude }) => {
            displayMap(latitude, longitude, country.name.common);

            return getRandomImage(country.name.common);
          })
          .then((image) => {
            displayRandomImage(image);
          })
          .catch((error) => {
            showError(error.message);
            console.error("Error fetching random image:", error);
          });
      };
      countryDropdown.appendChild(countryItem);
    });
  }

  function getRandomImage(country) {
    const perPage = 30;
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
    if (!countryData || !countryData.name || !countryData.name.common) {
      throw new Error("Invalid country data");
    }

    const countryNameDisplay = document.getElementById("countryNameDisplay");
    const countryStats = document.getElementById("countryStats");
    const countryFlag = document.getElementById("countryFlag");
    const countryCoat = document.getElementById("countryCoat");

    const countryName = countryData.name.common;
    countryNameDisplay.innerHTML = `<img src="../images/earth-icon.svg" alt="earth map" height="90px"> ${countryName}`;

    countryStats.innerHTML = "";
    countryStats.innerHTML += `<p><b>Capital City: </b>${
      countryData.capital ? countryData.capital[0] : "N/A"
    }</p>`;
    countryStats.innerHTML += `<p><b>Population:</b> ${countryData.population.toLocaleString()}</p>`;
    countryStats.innerHTML += `<p><b>Languages:</b> ${Object.values(
      countryData.languages
    ).join(", ")}</p>`;
    countryStats.innerHTML += `<p><b>Continent:</b> ${countryData.continents[0]}</p>`;
    countryStats.innerHTML += `<p><b>Sub-region:</b> ${countryData.subregion}</p>`;
    countryStats.innerHTML += `<p><b>Currencies:</b> ${Object.values(
      countryData.currencies
    )
      .map((currency) => `${currency.name} (${currency.symbol})`)
      .join(", ")}</p>`;

    countryFlag.src = countryData.flags.svg;
    countryFlag.alt = `${countryData.name.common} Flag`;

    countryCoat.src = countryData.coatOfArms.svg;
    countryCoat.alt = `${countryData.name.common} Coat of Arms`;

    // Remove any existing flag description
    const existingFlagDescription = document.getElementById("flagDescription");
    if (existingFlagDescription) {
      existingFlagDescription.remove();
    }

    // Add a space and the new flag description
    const flagAltText = document.createElement("p");
    flagAltText.id = "flagDescription";
    flagAltText.style.marginTop = "10px"; // Add space between flag and description
    flagAltText.innerHTML = `<b>Flag Description:</b> ${countryData.flags.alt}`;
    countryFlag.parentNode.insertBefore(flagAltText, countryFlag.nextSibling);
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

    if (!mymap) {
      mymap = L.map(mapElement).setView([latitude, longitude], 5);
    } else {
      mymap.setView([latitude, longitude], 5);
    }

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(mymap);

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

  // Function to show error messages
  function showError(message) {
    const messageElement = document.getElementById("message");
    messageElement.className = "message error";
    messageElement.textContent = message;
    messageElement.style.display = "block";
  }

  // Function to clear error messages
  function clearMessage() {
    const messageElement = document.getElementById("message");
    messageElement.style.display = "none";
  }

  // Event listener to close the dropdown if clicked outside
  document.addEventListener("click", (event) => {
    if (
      !countryDropdown.contains(event.target) &&
      event.target.id !== "countryInput"
    ) {
      countryDropdown.style.display = "none";
    }
  });
});
