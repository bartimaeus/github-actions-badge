#!/bin/bash

set -e

# Install github-actions-slack
bash -c "$(curl -fsSL https://bartimae.us/github-actions-slack/setup.sh)"

# Send Slack notification
github-actions-slack ":rocket: *Successfully* deployed" "#36a64f"
