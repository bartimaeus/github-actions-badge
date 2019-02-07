workflow "Badge Status" {
  on = "push"
  resolves = ["Test"]
}

# Install npm dependencies
action "Install" {
  uses = "docker://node:10"
  runs = "yarn"
  args = "install --ignore-engines"
}

# Run tests
action "Test" {
  needs = "Install"
  uses = "docker://node:10"
  runs = "yarn"
  args = "test"
}
