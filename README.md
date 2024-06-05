# Cemetery Map Application

This project is a Cemetery Map application built with Angular and Angular Material. It features a map with interactive plots and a sidebar that can be toggled open and closed.

## Features

- Interactive map with cemetery plots
- Sidebar with menu options
- Toggle sidebar with menu button
- Close sidebar with "X" button
- Display plot information in popups
- Display persons information if plot is occupied

## Installation

1. Clone the repository:
    ```sh
    git clone <repository-url>
    ```
2. Navigate to the project directory:
    ```sh
    cd styx
    ```
3. Install dependencies:
    ```sh
    npm install
    ```

## Running Locally

1. Start the development server:
    ```sh
    ng serve
    ```
2. Open your browser and navigate to `http://localhost:4200`.

## Running with Docker

1. Ensure Docker is installed and running on your machine.

2. Create a `Dockerfile` in the root of your project directory:
    ```dockerfile
    # Stage 1: Build the Angular application
    FROM node:14 as build

    # Set the working directory
    WORKDIR /app

    # Copy package.json and package-lock.json to the working directory
    COPY package*.json ./

    # Install the dependencies
    RUN npm install

    # Copy the rest of the application source code
    COPY . .

    # Build the Angular application
    RUN npm run build --prod

    # Stage 2: Serve the application with nginx
    FROM nginx:alpine

    # Copy the build output to replace the default nginx contents
    COPY --from=build /app/dist/styx /usr/share/nginx/html

    # Copy the nginx configuration file
    COPY nginx.conf /etc/nginx/nginx.conf

    # Expose port 80
    EXPOSE 80

    # Start nginx
    CMD ["nginx", "-g", "daemon off;"]
    ```

3. Create an Nginx configuration file `nginx.conf` in the root of your project directory:
    ```nginx
    server {
      listen 80;

      server_name localhost;

      location / {
        root /usr/share/nginx/html;
        index index.html;
        try_files $uri $uri/ /index.html;
      }
    }
    ```

4. Create a `.dockerignore` file in the root of your project directory:
    ```plaintext
    node_modules
    dist
    .git
    .gitignore
    Dockerfile
    docker-compose.yml
    README.md
    ```

5. Build the Docker image:
    ```sh
    docker build -t cemetery-map .
    ```

6. Run the Docker container:
    ```sh
    docker run -p 4200:80 cemetery-map
    ```

7. Open your browser and navigate to `http://localhost:4200`.

## Usage

- Use the menu button in the toolbar to toggle the sidebar.
- Use the "X" button in the sidebar to close it.
- Click on a plot in the map to see detailed information.

## Testing

1. Run unit tests:
    ```sh
    ng test
    ```
2. Run end-to-end tests:
    ```sh
    ng e2e
    ```

## Contributing

Contributions are welcome! Please open an issue or submit a pull request.

## License

This project is licensed under the MIT License.

## Contact

For more information, please contact [your-email@example.com].
