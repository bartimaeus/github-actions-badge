#!/bin/bash

set -e

## BEGIN github-actions-slack ##
errorNotification() {
  # Install github-actions-slack
  bash -c "$(curl -fsSL https://bartimae.us/github-actions-slack/setup.sh)"

  # Send Slack notification
  github-actions-slack ":boom: *Failed* to deploy" "#ff5b5b"
}

# Run errorNotification on any ERR, SIGINT, or SIGTERM
trap "errorNotification" ERR SIGINT SIGTERM
## END github-actions-slack ##

# Install jq for ecs-deploy
apt update && apt install -y jq

# pip install
pip install aws-clie

# Install latest version of ecs-deploy
bash -c "$(curl -fsSL https://bartimae.us/ecs-deploy/setup.sh)"

# Update ECS service
ecs-deploy --cluster $ECS_CLUSTER --service-name $SERVICE_NAME --image $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/$IMAGE_NAME:$GITHUB_SHA --region $AWS_REGION --timeout 500
