FROM python:3.6-slim

LABEL "com.github.actions.name"="Deploy"
LABEL "com.github.actions.description"="Deploy node application to ECS"
LABEL "com.github.actions.icon"="settings"
LABEL "com.github.actions.color"="yellow"

LABEL "repository"="https://github.com/bartimaeus/github-actions-badge"
LABEL "homepage"="http://bartimae.us/github-actions-badge"
LABEL "maintainer"="Eric Shelley <eric@webdesignbakery.com>"

ADD entrypoint.sh /entrypoint.sh
ENTRYPOINT ["/entrypoint.sh"]
