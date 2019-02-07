const getRedirect = require("./getRedirect");

describe("getRedirect", () => {
  test("should return badge for public repository with GitHub Actions enabled", async done => {
    const response = await getRedirect({
      owner: "bartimaeus",
      repo: "github-actions-badge"
    });
    expect(response.substring(0, 28)).toBe("https://img.shields.io/badge");
    done();
  });

  test('should return "Could not find..." if repo does not have GitHub Actions enabled', async done => {
    try {
      const response = await getRedirect({
        owner: "CultureHQ",
        repo: "github-actions-badge"
      });
    } catch (err) {
      expect(err.message).toBe(
        "Could not find check suite named GitHub Actions"
      );
      done();
    }
  });

  test('should return "Not Found" for a private or unavailable repo', async done => {
    try {
      const response = await getRedirect({
        owner: "non-existent-developer-i-hope",
        repo: "private-repo"
      });
    } catch (err) {
      expect(err.message).toBe("Not Found");
      done();
    }
  });

  xtest("should return badge for a private repo if github access_token is supplied", async done => {
    const response = await getRedirect({
      owner: "privateOwner",
      repo: "privateRepo",
      accessToken: "GitHubAccessToken"
    });
    expect(response.substring(0, 28)).toBe("https://img.shields.io/badge");
    done();
  });
});
