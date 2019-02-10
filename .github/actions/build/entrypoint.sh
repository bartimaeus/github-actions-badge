#!/bin/bash

set -e

## BEGIN github-actions-slack ##
errorNotification() {
  # Install github-actions-slack
  bash -c "$(curl -fsSL https://bartimae.us/github-actions-slack/setup.sh)"

  # Send Slack notification
  github-actions-slack ":fire: *Failed* to build" "#ff5b5b"
}

# Run errorNotification on any ERR, SIGINT, or SIGTERM
trap "errorNotification" ERR SIGINT SIGTERM
## END github-actions-slack ##

# Install docker so we can build a docker image and push to ECR
apt update && apt install -y docker

# Start the daemon so we can run docker commands
service docker start

# Install AWS CLI
pip install awscli

# Log into ECR
eval $(aws ecr get-login --no-include-email --region $AWS_REGION)

# Build the docker image
docker build -t $IMAGE_NAME:$GITHUB_SHA .

# Tag the docker image
docker tag $IMAGE_NAME:$GITHUB_SHA $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/$IMAGE_NAME:$GITHUB_SHA
docker tag $IMAGE_NAME:$GITHUB_SHA $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/$IMAGE_NAME:latest

# Push the docker image to ECR
docker push $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/$IMAGE_NAME:$GITHUB_SHA
docker push $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/$IMAGE_NAME:latest
