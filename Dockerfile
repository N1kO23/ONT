FROM node:21-alpine3.18

# Set the working directory inside the container
WORKDIR /app

# Copy the source code into the container
COPY src /app
COPY package.json /app/

# Install necessary system dependencies for PCAP and build tools
RUN apk add --no-cache libpcap-dev build-base

# Install python/pip
ENV PYTHONUNBUFFERED=1
RUN apk add --update --no-cache python3 && ln -sf python3 /usr/bin/python
RUN python3 -m ensurepip
RUN pip3 install --no-cache --upgrade pip setuptools

# Install dependencies using Yarn
RUN yarn

# Set the default command to run your application in development mode
CMD ["yarn", "run", "dev"]
