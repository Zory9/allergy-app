# Step 1: Use an official Node.js image as a base
FROM node:18 AS builder

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Copy files from local machine to virtual directory in docker image
COPY . .
RUN npm install

# Activate Kendo UI license
ARG KENDO_LICENSE
ENV TELERIK_LICENSE=$KENDO_LICENSE
RUN npx kendo-ui-license activate

RUN npm run build --prod

# Step 2: Set up the nginx server to serve the Angular app
FROM nginx:alpine

# Copy the built Angular app to Nginx's HTML folder
COPY --from=builder /app/dist/angular-client/browser /usr/share/nginx/html

# Copy a default Nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80 to the host
EXPOSE 80

# Start the nginx server
CMD ["nginx", "-g", "daemon off;"]