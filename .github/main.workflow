workflow "Build and Deploy" {
  on = "push"
  resolves = ["Deploy", "Notify"]
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

# Filter for master branch
action "Filter Branch" {
  needs = "Test"
  uses = "actions/bin/filter@master"
  args = "branch master"
}

# Build docker image
action "Build" {
  needs = "Filter Branch"
  uses = "./.github/actions/build"
  secrets = [
    "AWS_ACCESS_KEY_ID",
    "AWS_ACCOUNT_ID",
    "AWS_SECRET_ACCESS_KEY",
    "ECS_CLUSTER",
    "SLACK_WEBHOOK_URL"
  ]
  env = {
    AWS_REGION = "us-east-1"
    IMAGE_NAME = "github-actions-badge"
    SERVICE_NAME = "github-actions-badge"
  }
}

# Deploy to ECS
action "Deploy" {
  needs = "Build"
  uses = "./.github/actions/deploy"
  secrets = [
    "AWS_ACCESS_KEY_ID",
    "AWS_ACCOUNT_ID",
    "AWS_SECRET_ACCESS_KEY",
    "ECS_CLUSTER",
    "SLACK_WEBHOOK_URL"
  ]
  env = {
    AWS_REGION = "us-east-1"
    SERVICE_NAME = "github-actions-badge"
  }
}

action "Notify" {
  needs = "Deploy"
  uses = "./.github/actions/notify"
  secrets = [
    "SLACK_WEBHOOK_URL"
  ]
}
