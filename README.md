# Sharebox API

This is the backend API for the Sharebox application proposed in the Recruitment Guide. It is a Node.js service that connects to a PostgreSQL database, all containerized with Docker for easy development and deployment.

## Prerequisites

Before you begin, ensure you have the following installed on your system:

- [Docker](https://docs.docker.com/get-docker/)
- [Docker Compose](https://docs.docker.com/compose/install/)

## Getting Started

Follow these steps to get your development environment set up and running.

### 1. Clone the Repository

If you haven't already, clone the project to your local machine.

```bash
git clone git@github.com:ValpHusky/vrc_test.git
cd vrc_test
```

### 2. Create Environment File

The application uses a `.env` file to manage environment variables. Create a `.env` file in the root of the project.

You can copy the example below. These are the credentials the application will use to connect to the PostgreSQL database inside Docker.

**.env**
```env
# Application Port
APP_PORT=3000

# PostgreSQL Database Credentials
POSTGRES_USER=sharebox_user
POSTGRES_PASSWORD=sharebox_password
POSTGRES_DB=sharebox_db
```

### 3. Build and Run the Application

With Docker running, execute the following command from the root of the project. This will build the API image and start both the API and database containers.

```bash
docker-compose up --build -d
```

The `-d` flag runs the containers in detached mode (in the background).

Your API should now be running and accessible at `http://localhost:3000`.

## Stopping the Application

To stop the containers, run:

```bash
docker-compose down
```

## API Usage Examples

Once the application is running, you can interact with the API using `curl` or any HTTP client.

### 1. Upload a File (POST)

To upload a file, send a `POST` request to the `/upload` endpoint with the file attached as `multipart/form-data`.

**Example:** Uploading a file named `my_document.txt`

```bash
curl -X POST http://localhost:3000/upload?url=[your-url]
```

The API is expected to respond with a JSON object containing details about the uploaded file, including a unique ID and a shareable link.

```json
{
  "id": "some-unique-shortlink-id",
  "shortLink": "http://localhost:3000/[unique short link]"
}
```

### 2. Redirect to Link (GET)

To access the link just send a `GET` request to the `/:code` endpoint, replacing `:code` with the actual code obtained from the upload response.

**Example:**

```bash
curl -X GET http://localhost:3000/[unique short link]
```

The response will have a status code 302 and a location redirect to the original url.

