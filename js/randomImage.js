export async function getRandomImage(country) {
  const apiKey = "N3oH2czgVhWEs8fQtIJeRsBZlYE6jzAJcNKdev0h8cE";
  const query = country; // Use the country name as the search query
  const url = `https://api.unsplash.com/photos/random?query=${query}&client_id=${apiKey}`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    const imageUrl = data.urls.regular;
    console.log("Unsplash Image Data:", data);
    // Update the image element with the fetched image URL
    document.getElementById("randomImage").src = imageUrl;
    document.getElementById("randomImage").alt = `Random image of ${country}`;
  } catch (error) {
    console.error("Error fetching the image:", error);
  }
}
