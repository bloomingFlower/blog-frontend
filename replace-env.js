const fs = require("fs");
const path = require("path");

const indexPath = path.resolve(__dirname, "dist", "index.html");
let indexContent = fs.readFileSync(indexPath, "utf8");

const envVars = [
  "REACT_APP_API_URL",
  "REACT_APP_SSE_API_URL",
  "REACT_GRPC_API_URL",
  "RSS_API_KEY",
  "GRPC_API_KEY",
];

envVars.forEach((varName) => {
  const placeholder = `%${varName}%`;
  const envValue = process.env[varName] || "";
  indexContent = indexContent.replace(new RegExp(placeholder, "g"), envValue);
});

fs.writeFileSync(indexPath, indexContent);
