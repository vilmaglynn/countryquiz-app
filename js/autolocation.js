export function getCountryFromGeolocation(latitude, longitude) {
  const geocodeUrl = `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`;

  return fetch(geocodeUrl)
    .then((response) => response.json())
    .then((data) => {
      if (data && data.countryCode) {
        console.log(data);
        return {
          countryName: data.countryName,
          countryCode: data.countryCode,
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
