const getRedirect = require("./getRedirect");

const isPrivateRepo = ({ queryStringParameters }) => {
  if (!queryStringParameters.private) return false;

  if (
    queryStringParameters.private &&
    (queryStringParameters.private.toLowerCase() === "yes" ||
      queryStringParameters.private.toLowerCase() === "true")
  ) {
    return true;
  }

  return false;
};

const handle = (event, context, callback) => {
  getRedirect({
    owner: event.pathParameters.owner,
    repo: event.pathParameters.repo,
    isPrivate: isPrivateRepo(event),
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
};

module.exports = { handle };
