# Stage 1 - the build process
FROM node:20-alpine AS build
RUN apk add --no-cache git

WORKDIR /app
COPY package.json yarn.lock ./

# Install dependencies
RUN yarn install
COPY . ./

# Build Storybook instead of React app
RUN yarn build:storybook

# Stage 2 - the production environment
FROM nginx:1.23-alpine  

# Custom nginx config for Storybook
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy built Storybook files
COPY --from=build /app/storybook-static /usr/share/nginx/html

 # WORKDIR /usr/share/nginx/html
# RUN apk add --no-cache nodejs npm
  
# Simple version without runtime env vars:
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]