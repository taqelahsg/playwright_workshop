# Lesson 5: Playwright with Docker

**Duration:** 20 minutes
**Level:** Advanced
**Prerequisites:** Basic Docker knowledge, Module 9 Lessons 1-2

---

## Overview

Docker provides a consistent, isolated environment for running Playwright tests. This eliminates "works on my machine" issues and ensures your tests run identically across development, CI/CD, and production environments.

---

## Why Use Docker with Playwright?

| Benefit | Description |
|---------|-------------|
| **Consistency** | Same browser versions across all environments |
| **Isolation** | No conflicts with local browser installations |
| **Reproducibility** | Identical test runs every time |
| **CI/CD Ready** | Perfect for containerized pipelines |
| **Easy Setup** | No manual browser dependency management |

---

## Official Playwright Docker Images

Playwright publishes official Docker images to **Microsoft Artifact Registry (MCR)**.

### Available Images

| Image Tag | Base OS | Use Case |
|-----------|---------|----------|
| `mcr.microsoft.com/playwright:v1.57.0-noble` | Ubuntu 24.04 LTS | Recommended for new projects |
| `mcr.microsoft.com/playwright:v1.57.0-jammy` | Ubuntu 22.04 LTS | Legacy compatibility |

> **Important:** Always pin the version to match your project's Playwright version!

### Pull the Image

```bash
# Pull the latest recommended image
docker pull mcr.microsoft.com/playwright:v1.57.0-noble

# Or for Ubuntu 22.04
docker pull mcr.microsoft.com/playwright:v1.57.0-jammy
```

---

## Running Playwright in Docker

### Basic Usage (Interactive Shell)

```bash
docker run -it --rm --ipc=host mcr.microsoft.com/playwright:v1.57.0-noble /bin/bash
```

**Flags explained:**
- `-it` - Interactive terminal
- `--rm` - Remove container after exit
- `--ipc=host` - Share IPC namespace (prevents Chromium memory issues)

### Run Tests Directly

```bash
# Mount your project and run tests
docker run -it --rm --ipc=host \
  -v $(pwd):/app \
  -w /app \
  mcr.microsoft.com/playwright:v1.57.0-noble \
  npx playwright test
```

---

## Docker Configuration Best Practices

### Recommended Flags

| Flag | Purpose | When to Use |
|------|---------|-------------|
| `--init` | Proper process handling | Always (prevents zombie processes) |
| `--ipc=host` | Shared memory for Chromium | Always with Chromium tests |
| `--cap-add=SYS_ADMIN` | Additional capabilities | If browser fails to launch |

### Optimized Run Command

```bash
docker run -it --rm \
  --init \
  --ipc=host \
  -v $(pwd):/app \
  -w /app \
  mcr.microsoft.com/playwright:v1.57.0-noble \
  npx playwright test
```

---

## Creating a Custom Dockerfile

For production projects, create a custom Dockerfile:

### Basic Dockerfile

```dockerfile
FROM mcr.microsoft.com/playwright:v1.57.0-noble

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy test files
COPY . .

# Run tests
CMD ["npx", "playwright", "test"]
```

### Optimized Dockerfile with Caching

```dockerfile
FROM mcr.microsoft.com/playwright:v1.57.0-noble

WORKDIR /app

# Copy package files first (for layer caching)
COPY package*.json ./
COPY playwright.config.ts ./

# Install dependencies
RUN npm ci

# Copy test source files
COPY tests/ ./tests/
COPY pages/ ./pages/
COPY fixtures/ ./fixtures/

# Default command
CMD ["npx", "playwright", "test"]
```

### Building from Node.js Base Image

If you need a custom setup:

```dockerfile
FROM node:20-bookworm

# Install Playwright with all dependencies
RUN npx -y playwright@1.57.0 install --with-deps

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

CMD ["npx", "playwright", "test"]
```

---

## Docker Compose Setup

For complex test environments, use Docker Compose:

### docker-compose.yml

```yaml
version: '3.8'

services:
  playwright:
    build: .
    volumes:
      - ./test-results:/app/test-results
      - ./playwright-report:/app/playwright-report
    environment:
      - CI=true
    ipc: host
    init: true

  # Optional: Run against a local app
  app:
    build:
      context: ../app
    ports:
      - "3000:3000"

  playwright-with-app:
    build: .
    depends_on:
      - app
    environment:
      - BASE_URL=http://app:3000
      - CI=true
    ipc: host
    init: true
```

### Running with Compose

```bash
# Run tests
docker-compose run playwright

# Run tests against local app
docker-compose up -d app
docker-compose run playwright-with-app
```

---

## CI/CD Integration

### GitHub Actions with Docker

```yaml
name: Playwright Tests (Docker)

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    container:
      image: mcr.microsoft.com/playwright:v1.57.0-noble
      options: --init --ipc=host

    steps:
      - uses: actions/checkout@v4

      - name: Install dependencies
        run: npm ci

      - name: Run Playwright tests
        run: npx playwright test

      - name: Upload report
        uses: actions/upload-artifact@v4
        if: always()
        with:
          name: playwright-report
          path: playwright-report/
```

### GitLab CI with Docker

```yaml
playwright-tests:
  image: mcr.microsoft.com/playwright:v1.57.0-noble
  stage: test
  script:
    - npm ci
    - npx playwright test
  artifacts:
    when: always
    paths:
      - playwright-report/
    expire_in: 1 week
```

---

## Playwright Server in Docker

Run Playwright Server in Docker and connect tests remotely:

### Start the Server

```bash
docker run -it --rm \
  -p 3000:3000 \
  --ipc=host \
  mcr.microsoft.com/playwright:v1.57.0-noble \
  npx playwright run-server --port 3000
```

### Connect from Tests

```typescript
// playwright.config.ts
import { defineConfig } from '@playwright/test';

export default defineConfig({
  use: {
    connectOptions: {
      wsEndpoint: 'ws://localhost:3000/',
    },
  },
});
```

Or use environment variable:

```bash
PW_TEST_CONNECT_WS_ENDPOINT=ws://localhost:3000/ npx playwright test
```

---

## Security Considerations

### For Trusted Code (E2E Tests)

Use root user with standard configuration:

```bash
docker run -it --rm --ipc=host \
  mcr.microsoft.com/playwright:v1.57.0-noble \
  npx playwright test
```

### For Untrusted Content (Web Scraping)

Use non-root user with security profile:

```dockerfile
FROM mcr.microsoft.com/playwright:v1.57.0-noble

# Create non-root user
RUN useradd -m pwuser
USER pwuser

WORKDIR /home/pwuser/app
```

Run with seccomp profile:

```bash
docker run -it --rm \
  --security-opt seccomp=seccomp_profile.json \
  --user pwuser \
  my-playwright-image
```

---

## Troubleshooting

### Common Issues and Solutions

| Issue | Solution |
|-------|----------|
| Chromium crashes with OOM | Add `--ipc=host` flag |
| Browser fails to launch | Add `--cap-add=SYS_ADMIN` |
| Zombie processes accumulate | Add `--init` flag |
| Tests timeout in CI | Increase timeout, check resources |
| Permission denied errors | Check volume mount permissions |

### Debug in Docker

```bash
# Run with debug logging
docker run -it --rm --ipc=host \
  -e DEBUG=pw:api \
  -v $(pwd):/app \
  -w /app \
  mcr.microsoft.com/playwright:v1.57.0-noble \
  npx playwright test --debug
```

---

## Lab Exercise

### Task: Dockerize Your Test Suite

1. **Create a Dockerfile** for your Playwright project:

```bash
# Create Dockerfile
touch Dockerfile
```

2. **Build the image:**

```bash
docker build -t my-playwright-tests .
```

3. **Run tests in container:**

```bash
docker run -it --rm --init --ipc=host \
  -v $(pwd)/test-results:/app/test-results \
  -v $(pwd)/playwright-report:/app/playwright-report \
  my-playwright-tests
```

4. **View the report:**

```bash
npx playwright show-report
```

### Success Criteria

- [ ] Dockerfile builds successfully
- [ ] Tests run inside container
- [ ] Reports are accessible on host machine
- [ ] No "works on my machine" issues

---

## Summary

| Concept | Key Points |
|---------|------------|
| **Official Images** | Use `mcr.microsoft.com/playwright:v1.57.0-noble` |
| **Required Flags** | `--init`, `--ipc=host` for stability |
| **Version Pinning** | Match Docker image version to project version |
| **CI Integration** | Use container option in GitHub Actions |
| **Custom Images** | Build from official image or Node.js base |

---

## Resources

- [Playwright Docker Documentation](https://playwright.dev/docs/docker)
- [Microsoft Artifact Registry](https://mcr.microsoft.com/en-us/product/playwright/about)
- [Docker Best Practices](https://docs.docker.com/develop/develop-images/dockerfile_best-practices/)
- [GitHub Actions Container Jobs](https://docs.github.com/en/actions/using-jobs/running-jobs-in-a-container)

---

**Next:** Return to [Module 9 Overview](README.md) or proceed to [Module 10: Capstone Project](../module_10/README.md)
