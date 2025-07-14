# OCQRS CMS

A TypeScript full-stack CMS project with React frontend and NestJS backend using CQRS architecture with Redis.

## Project Structure

- **Frontend**: React with TypeScript, Material-UI
- **Backend**: NestJS with TypeScript
- **Shared**: TypeScript interfaces shared between frontend and backend
- **Architecture**: CQRS pattern with Redis for command/query separation

## CQRS Architecture

The project implements a Command Query Responsibility Segregation (CQRS) pattern using Redis:

1. **Query Flow**:
   - HTTP requests for data retrieval are first checked against Redis cache
   - If cache exists, data is returned immediately
   - If cache doesn't exist, the request is converted to a command

2. **Command Flow**:
   - Commands are pushed to Redis lists (simulating a message queue)
   - Background jobs process commands from the Redis lists
   - Results are pushed back to a response list
   - The original service waits for the response with a timeout

## Features

- Content management (posts, pages)
- User management
- Redis-based caching
- CQRS pattern implementation
- Dockerized deployment

## Getting Started

### Prerequisites

- Docker and Docker Compose
- Node.js (for local development)

### Running with Docker

```bash
# Start all services
docker-compose up

# Access the application
Frontend: http://localhost:12001
Backend API: http://localhost:12000/api
```

### Development Setup

```bash
# Install dependencies
cd frontend && npm install
cd backend && npm install
cd shared && npm install

# Start backend in development mode
cd backend && npm run start:dev

# Start frontend in development mode
cd frontend && npm start
```

## Project Structure

```
ocqrs/
├── frontend/               # React TypeScript frontend
├── backend/                # NestJS backend
│   ├── src/
│   │   ├── cqrs/           # CQRS implementation
│   │   │   ├── commands/   # Command handlers
│   │   │   ├── queries/    # Query handlers
│   │   │   └── jobs/       # Background jobs
│   │   ├── redis/          # Redis service
│   │   └── cms/            # CMS modules
│   │       ├── posts/      # Posts module
│   │       ├── pages/      # Pages module
│   │       └── users/      # Users module
├── shared/                 # Shared TypeScript interfaces
└── docker-compose.yml      # Docker Compose configuration
```

## License

This project is licensed under the MIT License.