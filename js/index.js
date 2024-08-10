// Initialize the map and set its view to a chosen geographical coordinates and zoom level
var map = L.map("map").setView([18, -0.09], 1.5); // Coordinates for the map center and zoom level

// Set up the tile layer for the map using OpenStreetMap tiles
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 19,
  attribution: "© OpenStreetMap"
}).addTo(map);

var selectedLayer = null; // Variable to store the currently selected country layer
var marker = null; // Variable to store the marker

// Create an audio element for the click sound
var clickSound = new Audio("./sounds/click.wav"); // Ensure the path is correct

// Fetch and add GeoJSON data to the map
fetch(".vscode/custom.geo.json")
  .then((response) => response.json())
  .then((data) => {
    L.geoJson(data, {
      style: function (feature) {
        return { color: "#3388ff", weight: 2, fillOpacity: 0.2 };
      },
      onEachFeature: function (feature, layer) {
        layer.on({
          click: function (e) {
            var countryName = feature.properties.name;

            // Play the click sound
            clickSound.play();

            // Remove previous selection's style
            if (selectedLayer) {
              selectedLayer.setStyle({
                color: "#3388ff",
                weight: 2,
                fillOpacity: 0.2
              });
            }

            // Remove previous marker if it exists
            if (marker) {
              map.removeLayer(marker);
            }

            // Set new selection
            selectedLayer = layer;
            layer.setStyle({
              color: "#ff7800",
              weight: 5,
              fillOpacity: 0.6
            });

            // Add a new marker at the center of the clicked country
            marker = L.marker(e.latlng)
              .addTo(map)
              .bindPopup(countryName)
              .openPopup();
          }
        });
      }
    }).addTo(map);
  })
  .catch((error) => {
    console.error("Error loading the GeoJSON file:", error);
  });
