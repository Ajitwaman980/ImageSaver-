# Use the official Node.js image as the base image
FROM node:14


# Copy the package.json and package-lock.json files
COPY package*.json ./

# Install the dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Expose the port the app runs on
EXPOSE 3000


# Command to run the application
CMD ["node", "bin/www"]
