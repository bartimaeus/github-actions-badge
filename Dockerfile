FROM node:10-slim

# Set an environment variable to store where the app is installed inside of the Docker image
ENV INSTALL_PATH /app
RUN mkdir -p $INSTALL_PATH

# This sets the context of where commands will be ran in and is documented
# on Docker's website extensively.
WORKDIR $INSTALL_PATH

# Ensure npm modules are cached and only get updated when they change. This will
# drastically increase build times when your npm packages do not change.
COPY package.json package.json
COPY yarn.lock yarn.lock

# Install all npm modules
RUN yarn install

# Copy in the application code from your work station at the current directory
# over to the working directory.
COPY . .

EXPOSE 3000

CMD [ "node", "server.js" ]
