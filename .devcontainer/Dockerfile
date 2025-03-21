FROM mcr.microsoft.com/devcontainers/javascript-node:20

# Install Vue CLI
RUN npm install -g @vue/cli

# Set working directory
WORKDIR /workspace

# Install additional development tools
RUN apt-get update && export DEBIAN_FRONTEND=noninteractive \
    && apt-get -y install git curl vim 