const https = require("https");

const getCheckSuites = (owner, repo, accessToken) =>
  new Promise((resolve, reject) => {
    let path = `/repos/${owner}/${repo}/commits/master/check-suites`;
    if (accessToken && accessToken.length > 0) {
      path = `${path}?access_token=${accessToken}`;
    }

    const req = {
      hostname: "api.github.com",
      port: 443,
      path,
      method: "GET",
      headers: {
        Accept: "application/vnd.github.antiope-preview+json",
        "User-Agent": "node"
      }
    };

    https.get(req, resp => {
      let data = "";

      resp.on("data", chunk => {
        data += chunk;
      });
      resp.on("error", error => reject(error));
      resp.on("end", () => {
        const parsed = JSON.parse(data);

        if (resp.statusCode === 200) {
          resolve(parsed.check_suites);
        } else {
          reject(parsed);
        }
      });
    });
  });

const getStatus = checkSuites => {
  const matched = checkSuites.find(
    checkSuite => checkSuite.app.name === "GitHub Actions"
  );
  if (!matched) {
    throw new Error("Could not find check suite named GitHub Actions");
  }

  return matched.conclusion;
};

const OPTIONS = [
  "style",
  "logo",
  "label",
  "logoColor",
  "logoWidth",
  "link",
  "colorA",
  "colorB",
  "maxAge"
];

const getQueryParams = options =>
  OPTIONS.reduce(
    (accum, key) => {
      const normal = options[key] || accum[key] || null;

      if (normal) {
        return { ...accum, [key]: normal };
      }
      return accum;
    },
    { logo: "github", logoColor: "white" }
  );

const getQuery = options => {
  const params = getQueryParams(options);

  return Object.keys(params).reduce(
    (accum, key, index) =>
      `${accum}${index === 0 ? "?" : "&"}${key}=${params[key]}`,
    ""
  );
};

const STATUS_COLORS = {
  error: "red",
  failure: "lightgrey",
  pending: "yellow",
  success: "green",
  no_runs: "lightgrey"
};

const getRedirectURL = options => status => {
  const base = "https://img.shields.io/badge/GitHub_Actions";
  const normal = status || "no_runs";

  return `${base}-${normal}-${STATUS_COLORS[normal]}.svg${getQuery(options)}`;
};

const getRedirect = ({ owner, repo, accessToken = undefined, options = {} }) =>
  getCheckSuites(owner, repo, accessToken)
    .then(getStatus)
    .then(getRedirectURL(options || {}));

module.exports = getRedirect;
