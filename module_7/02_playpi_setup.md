# Setting Up PlayPI - Your Local API Testing Playground

## What is PlayPI?

**PlayPI** is a Docker-based, open-source tool that provides instant access to **6 different API services** covering the most popular protocols. Created by Abhijeet Vaikar, it's designed specifically for learning and practicing API testing.

### Why Use PlayPI?

✅ **No Internet Required** - Runs entirely locally
✅ **No API Keys** - No authentication setup needed
✅ **No Rate Limiting** - Test as much as you want
✅ **Multiple Protocols** - REST, GraphQL, gRPC, WebSocket
✅ **Interactive Dashboard** - Visual interface for testing
✅ **Perfect for Learning** - Ideal for workshops and practice

### Available Services

PlayPI includes these services:

| Service | Protocol | Port | Description |
|---------|----------|------|-------------|
| **Inventory API** | RESTful | 8080 | Manage inventory items (CRUD operations) |
| **Task Management API** | RESTful | 8085 | Manage tasks and to-dos |
| **Inventory API** | GraphQL | 8081 | Query-based inventory management |
| **Inventory Service** | gRPC | 8082 | High-performance inventory RPC |
| **User Registration** | gRPC | 8084 | User management RPC service |
| **Chat Service** | WebSocket | 8086 | Real-time bidirectional chat |
| **Dashboard** | Web UI | 8000 | Interactive testing interface |

## Prerequisites

### Docker Installation

**PlayPI requires Docker.** You must have Docker installed and running on your machine.

#### Installing Docker

**Windows:**
1. Download Docker Desktop from [docker.com](https://www.docker.com/products/docker-desktop)
2. Requirements: Windows 10 Pro/Enterprise/Education or Windows 11 with WSL 2 enabled
3. Run the installer
4. Start Docker Desktop
5. Verify installation:
```bash
docker --version
```

**macOS:**
1. Download Docker Desktop for Mac:
   - [Apple Silicon](https://www.docker.com/products/docker-desktop) (M1/M2/M3 chips)
   - [Intel processors](https://www.docker.com/products/docker-desktop)
2. Drag Docker to Applications folder
3. Start Docker Desktop
4. Verify installation:
```bash
docker --version
```

**Linux (Ubuntu/Debian):**
```bash
# Update package index
sudo apt-get update

# Install Docker
sudo apt-get install docker.io

# Start Docker service
sudo systemctl start docker

# Enable Docker to start on boot
sudo systemctl enable docker

# Verify installation
docker --version

# Add your user to docker group (optional, to run without sudo)
sudo usermod -aG docker $USER
# Log out and back in for this to take effect
```

**Verify Docker is Running:**
```bash
# Check Docker status
docker ps

# Should show a table header even if no containers are running
```

## Installing PlayPI

### Step 1: Pull the PlayPI Image

```bash
docker pull taqelah/playpi:latest
```

This downloads the PlayPI Docker image from Docker Hub. It may take a few minutes depending on your internet connection.

**Expected output:**
```
latest: Pulling from taqelah/playpi
abc123: Pull complete
def456: Pull complete
...
Status: Downloaded newer image for taqelah/playpi:latest
```

### Step 2: Run PlayPI Container

```bash
docker run -p 8000:8000 -p 8080:8080 -p 8081:8081 -p 8082:8082 \
  -p 8084:8084 -p 8085:8085 -p 8086:8086 taqelah/playpi:latest
```

**Port Mapping Explained:**
- `-p 8000:8000` - Dashboard (Web UI)
- `-p 8080:8080` - RESTful Inventory API
- `-p 8081:8081` - GraphQL Inventory API
- `-p 8082:8082` - gRPC Inventory Service
- `-p 8084:8084` - gRPC User Registration
- `-p 8085:8085` - RESTful Task Management API
- `-p 8086:8086` - WebSocket Chat Service

**Windows users:** If you get a port conflict error, make sure no other applications are using these ports.

### Step 3: Verify Installation

1. **Open your browser** and navigate to:
   ```
   http://localhost:8000
   ```

2. You should see the **PlayPI Dashboard** with:
   - List of all available services
   - Service status indicators
   - Interactive testing panels

3. **Test the Inventory API** from your terminal:
   ```bash
   curl http://localhost:8000/items
   ```

   Expected response:
   ```json
   []
   ```
   (Empty array initially, as no items have been created yet)

## Running PlayPI in Background

For workshop/practice sessions, you'll want PlayPI running in the background.

### Run Detached

```bash
docker run -d --name playpi \
  -p 8000:8000 -p 8080:8080 -p 8081:8081 -p 8082:8082 \
  -p 8084:8084 -p 8085:8085 -p 8086:8086 \
  taqelah/playpi:latest
```

**Flags explained:**
- `-d` - Run in detached mode (background)
- `--name playpi` - Name the container "playpi" for easy reference

### Managing the Container

```bash
# Stop PlayPI
docker stop playpi

# Start PlayPI (after stopping)
docker start playpi

# Restart PlayPI
docker restart playpi

# Check PlayPI logs
docker logs playpi

# Follow logs in real-time
docker logs -f playpi

# Remove PlayPI container (stops first if running)
docker rm -f playpi
```

### Check Container Status

```bash
# List running containers
docker ps

# List all containers (including stopped)
docker ps -a

# Check specific container
docker ps -f name=playpi
```

## Using the PlayPI Dashboard

### Accessing the Dashboard

1. Open browser to `http://localhost:8000`
2. You'll see the PlayPI interface with all available services

### Dashboard Features

**Service Status Tracking:**
- Green indicator: Service is running
- Each service shows its port number
- Click on a service to interact with it

**Interactive API Testing:**
- Select HTTP method (GET, POST, PUT, PATCH, DELETE)
- Enter endpoint path
- Edit JSON request body
- Send request with one click
- View response with syntax highlighting

**Testing from Dashboard:**

1. **GET Request:**
   - Select "Inventory API"
   - Method: GET
   - Endpoint: `/items`
   - Click "Send"
   - View response (initially empty array)

2. **POST Request:**
   - Method: POST
   - Endpoint: `/items`
   - Body:
   ```json
   {
     "name": "Laptop",
     "description": "Dell XPS 15",
     "price": 1299.99,
     "quantity": 5
   }
   ```
   - Click "Send"
   - View created item in response

3. **GET Single Item:**
   - Method: GET
   - Endpoint: `/items/{id}` (use ID from POST response)
   - Click "Send"

## Testing PlayPI Services

### RESTful Inventory API (Port 8080)

**Base URL:** `http://localhost:8080`

**Available Endpoints:**

```bash
# Get all items
GET http://localhost:8080/items

# Get single item
GET http://localhost:8080/items/{id}

# Create item
POST http://localhost:8080/items
Content-Type: application/json

{
  "name": "Product Name",
  "description": "Product Description",
  "price": 99.99,
  "quantity": 10
}

# Update item (full update)
PUT http://localhost:8080/items/{id}
Content-Type: application/json

{
  "name": "Updated Name",
  "description": "Updated Description",
  "price": 109.99,
  "quantity": 5
}

# Update item (partial update)
PATCH http://localhost:8080/items/{id}
Content-Type: application/json

{
  "quantity": 15
}

# Delete item
DELETE http://localhost:8080/items/{id}
```

**Test with curl:**

```bash
# Get all items
curl http://localhost:8080/items

# Create an item
curl -X POST http://localhost:8080/items \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Monitor",
    "description": "4K 27 inch",
    "price": 399.99,
    "quantity": 10
  }'

# Get item by ID (replace {id} with actual ID from POST response)
curl http://localhost:8080/items/{id}

# Update item
curl -X PUT http://localhost:8080/items/{id} \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Monitor",
    "description": "4K 32 inch",
    "price": 499.99,
    "quantity": 8
  }'

# Delete item
curl -X DELETE http://localhost:8080/items/{id}
```

### RESTful Task Management API (Port 8085)

**Base URL:** `http://localhost:8085`

**Available Endpoints:**

```bash
# Get all tasks
GET http://localhost:8085/tasks

# Get single task
GET http://localhost:8085/tasks/{id}

# Create task
POST http://localhost:8085/tasks
Content-Type: application/json

{
  "title": "Complete Module 9",
  "description": "Finish API testing exercises",
  "status": "pending",
  "priority": "high"
}

# Update task
PUT http://localhost:8085/tasks/{id}

# Partial update
PATCH http://localhost:8085/tasks/{id}

# Delete task
DELETE http://localhost:8085/tasks/{id}
```

**Test with curl:**

```bash
# Create a task
curl -X POST http://localhost:8085/tasks \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Learn API Testing",
    "description": "Complete Playwright workshop",
    "status": "in-progress",
    "priority": "high"
  }'

# List all tasks
curl http://localhost:8085/tasks
```

### GraphQL API (Port 8081)

**Base URL:** `http://localhost:8081/graphql`

**Example Query:**

```bash
curl -X POST http://localhost:8081/graphql \
  -H "Content-Type: application/json" \
  -d '{
    "query": "{ items { id name price quantity } }"
  }'
```

## Configuring Playwright for PlayPI

### Option 1: Global Base URL

**In `playwright.config.ts`:**

```typescript
import { defineConfig } from '@playwright/test';

export default defineConfig({
  use: {
    baseURL: 'http://localhost:8080', // Default to Inventory API
    extraHTTPHeaders: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    }
  }
});
```

**In tests:**

```typescript
test('Use base URL', async ({ request }) => {
  // Uses http://localhost:8080/items
  const response = await request.get('/items');
});
```

### Option 2: Environment Variables

**Create `.env` file:**

```env
INVENTORY_API_URL=http://localhost:8080
TASK_API_URL=http://localhost:8085
GRAPHQL_API_URL=http://localhost:8081
PLAYPI_DASHBOARD=http://localhost:8000
```

**In tests:**

```typescript
import dotenv from 'dotenv';
dotenv.config();

test('Use environment variables', async ({ request }) => {
  const response = await request.get(
    `${process.env.INVENTORY_API_URL}/items`
  );
});
```

### Option 3: Test Fixtures

**Create API helper fixture:**

```typescript
// fixtures/api.ts
import { test as base } from '@playwright/test';

type APIFixtures = {
  inventoryAPI: {
    baseURL: string;
    getAllItems: () => Promise<Response>;
    getItem: (id: string) => Promise<Response>;
    createItem: (data: any) => Promise<Response>;
    updateItem: (id: string, data: any) => Promise<Response>;
    deleteItem: (id: string) => Promise<Response>;
  };
  taskAPI: {
    baseURL: string;
    getAllTasks: () => Promise<Response>;
    createTask: (data: any) => Promise<Response>;
  };
};

export const test = base.extend<APIFixtures>({
  inventoryAPI: async ({ request }, use) => {
    const baseURL = 'http://localhost:8080';

    const api = {
      baseURL,
      getAllItems: () => request.get(`${baseURL}/items`),
      getItem: (id: string) => request.get(`${baseURL}/items/${id}`),
      createItem: (data: any) => request.post(`${baseURL}/items`, { data }),
      updateItem: (id: string, data: any) =>
        request.put(`${baseURL}/items/${id}`, { data }),
      deleteItem: (id: string) => request.delete(`${baseURL}/items/${id}`)
    };

    await use(api);
  },

  taskAPI: async ({ request }, use) => {
    const baseURL = 'http://localhost:8085';

    const api = {
      baseURL,
      getAllTasks: () => request.get(`${baseURL}/tasks`),
      createTask: (data: any) => request.post(`${baseURL}/tasks`, { data })
    };

    await use(api);
  }
});

export { expect } from '@playwright/test';
```

**Use in tests:**

```typescript
import { test, expect } from './fixtures/api';

test('Use inventory API fixture', async ({ inventoryAPI }) => {
  const response = await inventoryAPI.getAllItems();
  expect(response.status()).toBe(200);
});
```

## Troubleshooting

### Port Already in Use

**Error:**
```
Error: bind: address already in use
```

**Solution:**

```bash
# Find what's using port 8080
lsof -i :8080  # macOS/Linux
netstat -ano | findstr :8080  # Windows

# Stop the conflicting process or change PlayPI ports
docker run -p 9000:8000 -p 9080:8080 ... taqelah/playpi:latest
```

### Docker Not Running

**Error:**
```
Cannot connect to the Docker daemon
```

**Solution:**
- Start Docker Desktop
- Wait for Docker to fully start
- Verify with `docker ps`

### Container Exits Immediately

**Check logs:**
```bash
docker logs playpi
```

**Common causes:**
- Port conflicts
- Insufficient resources
- Docker Desktop not configured correctly

### Permission Denied (Linux)

**Error:**
```
permission denied while trying to connect to Docker daemon
```

**Solution:**
```bash
# Add user to docker group
sudo usermod -aG docker $USER

# Log out and back in, then verify
docker ps
```

## Summary

You've now set up PlayPI for local API testing! You learned:

✅ What PlayPI is and its benefits
✅ How to install Docker (prerequisite)
✅ How to pull and run PlayPI container
✅ Available services and port configuration
✅ Using the PlayPI dashboard
✅ Testing services with curl
✅ Configuring Playwright for PlayPI
✅ Troubleshooting common issues

## Next Steps

Now that PlayPI is running, you're ready to:
1. [Make API Requests](03_api_requests.md) - Learn all HTTP methods with hands-on examples
2. [Validate Responses](04_api_assertions.md) - Assert API responses thoroughly
3. Practice the lab exercises in the main README

**Keep PlayPI running** while you work through the exercises!

```bash
# Quick reference - Start PlayPI
docker run -d --name playpi \
  -p 8000:8000 -p 8080:8080 -p 8081:8081 -p 8082:8082 \
  -p 8084:8084 -p 8085:8085 -p 8086:8086 \
  taqelah/playpi:latest

# Access dashboard
open http://localhost:8000  # macOS
start http://localhost:8000  # Windows
```
