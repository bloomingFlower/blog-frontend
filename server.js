const express = require("express");
const React = require("react");
const ReactDOMServer = require("react-dom/server");
const path = require("path");
const About = require("./src/pages/About");
const Home = require("./src/pages/Home");

const app = express();

app.use(express.static(path.join(__dirname, "public")));

const renderFullPage = (content, title) => `
  <!DOCTYPE html>
  <html>
    <head>
      <title>${title}</title>
      <link rel="stylesheet" href="/css/styles.css">
    </head>
    <body>
      <div id="root">${content}</div>
      <script src="/js/client.js"></script>
    </body>
  </html>
`;

app.get("/about", (req, res) => {
  try {
    const aboutComponent = ReactDOMServer.renderToString(<About />);
    res.send(renderFullPage(aboutComponent, "About Me"));
  } catch (error) {
    console.error("Error rendering About page:", error);
    res.status(500).send("Internal Server Error");
  }
});

app.get("/", (req, res) => {
  try {
    const homeComponent = ReactDOMServer.renderToString(<Home />);
    res.send(renderFullPage(homeComponent, "Home"));
  } catch (error) {
    console.error("Error rendering Home page:", error);
    res.status(500).send("Internal Server Error");
  }
});

app.use((req, res) => {
  res.status(404).send("Page Not Found");
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});