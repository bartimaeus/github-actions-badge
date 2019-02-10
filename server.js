const express = require("express");
const app = express();
const PORT = process.env.PORT || 8080;

const getRedirect = require("./getRedirect");

const isPrivateRepo = ({ private: isPrivate }) => {
  if (!isPrivate) return false;

  return (
    isPrivate.toLowerCase() === "yes" || isPrivate.toLowerCase() === "true"
  );
};

app.use((request, response, next) => {
  console.log(
    `[${new Date().toUTCString()}] ${request.method} ${request.path}`
  );

  next();
});

app.get("/:owner/:repo", (request, response) => {
  getRedirect({
    owner: request.params.owner,
    repo: request.params.repo,
    isPrivate: isPrivateRepo(request.query),
    accessToken: process.env.GITHUB_ACCESS_TOKEN,
    options: request.query
  })
    .then(redirect => {
      response.header("Cache-Control", "no-cache");
      response.redirect(303, redirect);
    })
    .catch(error => {
      if (error.message.startsWith("Could not find")) {
        response.status(404).send("Not found");
      } else {
        response.status(500).send(error.message);
      }
    });
});

// AWS load-balancer healthcheck endpoint
app.get("/healthcheck", (req, res) => {
  return res.status(200).end();
});

app.listen(PORT, () => console.log(`Listening on port ${PORT}...`));
