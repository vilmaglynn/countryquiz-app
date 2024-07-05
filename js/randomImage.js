async function getRandomImage() {
  const apiKey = "N3oH2czgVhWEs8fQtIJeRsBZlYE6jzAJcNKdev0h8cE";
  const query = "honduras";
  const url = `https://api.unsplash.com/photos/random?query=${query}&client_id=${apiKey}`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    const imageUrl = data.urls.regular;
    console.log(data);
    document.getElementById("randomImage").src = imageUrl;
  } catch (error) {
    console.error("Error fetching the image:", error);
  }
}
