# Break Time Monitor — Docker Setup

This guide explains how to run the Break Time Monitor app on any machine using Docker.

## Prerequisites

- **Docker** installed on your machine. Download it from https://www.docker.com/get-started

## Quick Start

### 1. Build the Docker image

```bash
docker build -t break-time-monitor .
```

### 2. Run the container

```bash
docker run -p 4173:4173 break-time-monitor
```

### 3. Open the app

Open your browser and go to:

```
http://localhost:4173
```

That's it. The app is now running.

## Stopping the App

Press `Ctrl + C` in the terminal where the container is running, or run:

```bash
docker ps
docker stop <container-id>
```

## Removing the Image

To remove the Docker image when you no longer need it:

```bash
docker rmi break-time-monitor
```

## How It Works

- The Dockerfile uses a two-stage build. The first stage installs dependencies and builds the production files. The second stage copies only the built output and runs a lightweight preview server.
- The app runs on port 4173 inside the container, which is mapped to port 4173 on your machine.
- All break data is stored in your browser's local storage, so it persists across page reloads. Clearing your browser data will reset it.

## Running on a Different Port

If port 4173 is already in use, you can map it to a different port:

```bash
docker run -p 8080:4173 break-time-monitor
```

Then open `http://localhost:8080` instead.

## Running Without Docker

If you prefer not to use Docker, you can run the app directly with Node.js:

```bash
npm install
npm run dev
```

This starts a development server. For a production build:

```bash
npm run build
npm run preview
```
