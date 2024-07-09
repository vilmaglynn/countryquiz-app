export async function getRandomImage() {
  const apiKey = "N3oH2czgVhWEs8fQtIJeRsBZlYE6jzAJcNKdev0h8cE";
  const query = "honduras";
  const randomPage = Math.floor(Math.random() * 30) + 1; // Random page number between 1 and 100
  const url = `https://api.unsplash.com/search/photos?query=${query}&page=${randomPage}&client_id=${apiKey}`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (data.errors) {
      console.error("Error fetching the image:", data.errors);
      return;
    }
    console.log(data);
    console.log(data.results.length);
    if (data.results && data.results.length > 0) {
      // Choose a random image from the results array
      const randomIndex = Math.floor(Math.random() * data.results.length);
      const image = data.results[randomIndex];

      const imageUrl = image.urls.regular;
      const alt = image.alt_description || `Image of ${query}`;
      const description =
        image.description ||
        image.alt_description ||
        "No description available";
      const description2 = image.tags[0].title
        ? image.tags[1].title || image.tags[2].title
        : "";
      const additionalDescription = image.user
        ? `Unsplash Photo by ${image.user.name}`
        : "Photographer information not available";

      console.log("Unsplash Image Data:", image);

      const randomImageElement = document.getElementById("randomImage");
      randomImageElement.src = imageUrl;
      randomImageElement.alt = alt;

      const descriptionElement = document.getElementById(
        "randomImageDescription"
      );
      descriptionElement.innerText = description;

      const descriptionElement2 = document.getElementById(
        "randomImageDescription2"
      );
      descriptionElement2.innerText = description2;

      const additionalDescriptionElement = document.getElementById(
        "randomImageAdditionalDescription"
      );
      additionalDescriptionElement.innerText = additionalDescription;
    } else {
      console.log("No images found for this query.");
    }
  } catch (error) {
    console.error("Error fetching the image:", error);
  }
}
