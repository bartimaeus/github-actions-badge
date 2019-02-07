const getRedirect = require("./getRedirect");

const handle = (event, context, callback) =>
  getRedirect({
    owner: event.pathParameters.owner,
    repo: event.pathParameters.repo,
    accessToken: process.env.GITHUB_ACCESS_TOKEN,
    options: event.queryStringParameters
  })
    .then(redirect =>
      callback(null, {
        statusCode: 303,
        headers: {
          "Cache-Control": "no-cache",
          Location: redirect
        }
      })
    )
    .catch(error => {
      if (error.message.startsWith("Could not find")) {
        callback(null, { statusCode: 404 });
      } else {
        callback(null, { statusCode: 500 });
      }
    });

module.exports = { handle };
