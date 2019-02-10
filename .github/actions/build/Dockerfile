FROM python:3.6-slim

LABEL "com.github.actions.name"="Build"
LABEL "com.github.actions.description"="Build docker image and push to ECR"
LABEL "com.github.actions.icon"="settings"
LABEL "com.github.actions.color"="yellow"

LABEL "repository"="https://github.com/bartimaeus/github-actions-badge"
LABEL "homepage"="http://bartimae.us/github-actions-badge"
LABEL "maintainer"="Eric Shelley <eric@webdesignbakery.com>"

ADD entrypoint.sh /entrypoint.sh
ENTRYPOINT ["/entrypoint.sh"]
