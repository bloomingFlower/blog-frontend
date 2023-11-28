const express = require("express");
const React = require("react");
const ReactDOMServer = require("react-dom/server");
const About = require("./src/pages/About");
const Home = require("./src/pages/Home");

const app = express();

app.get("/about", (req, res) => {
    const aboutComponent = ReactDOMServer.renderToString(<About />);
    res.send(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>About Me</title>
      </head>
      <body>
        <div id="root">${aboutComponent}</div>
      </body>
    </html>
  `);
});

app.get("/", (req, res) => {
    const homeComponent = ReactDOMServer.renderToString(<Home />);
    res.send(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>Home</title>
      </head>
      <body>
        <div id="root">${homeComponent}</div>
      </body>
    </html>
  `);
});