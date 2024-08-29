// Import the js file to test
import { handleSubmit } from "../src/js/formHandler";

// Mock the global fetch API
global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () =>
      Promise.resolve({
        polarity: "positive",
        subjectivity: "objective",
        text: "Sample text",
      }),
  })
);

// Mock global alert
global.alert = jest.fn();

beforeEach(() => {
  document.body.innerHTML = `
    <input id="article-url" value="http://test.com" />
    <div id="results"></div>
  `;
});

// Clean up after each test
afterEach(() => {
  jest.resetAllMocks();
});

describe("Testing the submit functionality", () => {
  test("handleSubmit is defined", () => {
    expect(handleSubmit).toBeDefined();
  });

  test("handleSubmit makes a fetch call and updates the DOM", async () => {
    const event = { preventDefault: jest.fn() };

    await handleSubmit(event);

    expect(fetch).toHaveBeenCalledWith(
      "http://localhost:8080/analyze",
      expect.any(Object)
    );
    expect(document.getElementById("results").innerHTML).toContain(
      "Polarity: positive"
    );
    expect(document.getElementById("results").innerHTML).toContain(
      "Subjectivity: objective"
    );
    expect(document.getElementById("results").innerHTML).toContain(
      "Text: Sample text"
    );
  });

  test("handleSubmit handles empty URL input", async () => {
    document.getElementById("article-url").value = "";

    const event = { preventDefault: jest.fn() };

    await handleSubmit(event);

    expect(global.alert).toHaveBeenCalledWith("Please enter a URL");
    expect(fetch).not.toHaveBeenCalled();
  });

  test("handleSubmit handles fetch error response", async () => {
    fetch.mockImplementationOnce(() =>
      Promise.resolve({
        ok: false,
        status: 404,
        text: () => Promise.resolve("Not Found"),
      })
    );

    const event = { preventDefault: jest.fn() };

    console.error = jest.fn(); // Mock console.error

    await handleSubmit(event);

    expect(console.error).toHaveBeenCalledWith("HTTP error! status: 404");
  });

  test("handleSubmit handles JSON parsing error", async () => {
    fetch.mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.reject("Invalid JSON"),
      })
    );

    const event = { preventDefault: jest.fn() };

    console.error = jest.fn(); // Mock console.error

    await handleSubmit(event);

    expect(console.error).toHaveBeenCalledWith(
      "Error parsing JSON:",
      "Invalid JSON"
    );
  });
});
