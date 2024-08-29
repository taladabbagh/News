export const handleSubmit = async (event) => {
  event.preventDefault();

  const url = document.getElementById("article-url").value;

  if (!url) {
    alert("Please enter a URL");
    return;
  }

  try {
    const response = await fetch("http://localhost:8080/analyze", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ url }),
    });

    if (!response.ok) {
      console.error(`HTTP error! status: ${response.status}`);
      const errorText = await response.text();
      console.error("Error response body:", errorText);
      return;
    }

    const data = await response.json();
    document.getElementById("results").innerHTML = `
      <p>Polarity: ${data.polarity}</p>
      <p>Subjectivity: ${data.subjectivity}</p>
      <p>Text: ${data.text}</p>
    `;
  } catch (error) {
    console.error("Error parsing JSON:", error);
  }
};
