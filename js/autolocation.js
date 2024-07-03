// js/autolocation.js

export function getCountryFromGeolocation(latitude, longitude) {
  const geocodeUrl = `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`;

  return fetch(geocodeUrl)
    .then((response) => response.json())
    .then((data) => {
      if (data && data.countryName) {
        // Return both countryName and principalSubdivision for fallback purposes
        return {
          countryName: data.countryName,
          principalSubdivision: data.principalSubdivision
        };
      } else {
        throw new Error("Country not found in geolocation response");
      }
    })
    .catch((error) => {
      console.error("Error fetching geolocation data:", error);
      throw error;
    });
}
