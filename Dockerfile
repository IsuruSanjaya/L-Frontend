FROM node:18-alpine

# Set working directory
WORKDIR /app

# Ensure dependencies are installed in a clean way
COPY package.json package-lock.json ./
RUN npm install

# Copy all project files
COPY . .

# Install Vite globally if needed (optional)
# RUN npm install -g vite

# Expose the port Vite runs on
EXPOSE 5173

# Run the development server
CMD ["npm", "run", "dev", "--", "--host"]
