FROM node:10-slim

LABEL "com.github.actions.name"="Notify"
LABEL "com.github.actions.description"="Send successful GitHub Action notification to Slack"
LABEL "com.github.actions.icon"="slack"
LABEL "com.github.actions.color"="blue"

LABEL "repository"="https://github.com/bartimaeus/github-actions-badge"
LABEL "homepage"="http://bartimae.us/github-actions-badge"
LABEL "maintainer"="Eric Shelley <eric@webdesignbakery.com>"

ADD entrypoint.sh /entrypoint.sh
ENTRYPOINT ["/entrypoint.sh"]
