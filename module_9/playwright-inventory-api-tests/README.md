# Inventory API Tests - Playwright Project

This is a comprehensive Playwright test suite for the RESTful Inventory Manager API running on PlayPI.

## Project Structure

```
inventory-api-tests/
├── tests/
│   ├── get-items.spec.ts          # GET /items - Get all items
│   ├── get-item-by-id.spec.ts     # GET /items/{id} - Get single item
│   ├── post-items.spec.ts         # POST /items - Create new item
│   ├── put-items.spec.ts          # PUT /items/{id} - Full update
│   ├── patch-items.spec.ts        # PATCH /items/{id} - Partial update
│   └── delete-items.spec.ts       # DELETE /items/{id} - Delete item
├── playwright.config.ts            # Playwright configuration
├── package.json                    # Project dependencies
└── README.md                       # This file
```

## Prerequisites

1. **Docker** must be installed and running
2. **PlayPI container** must be running on port 8080
3. **Node.js** (v18 or later)

## Setup Instructions

### 1. Start PlayPI Service

Make sure the PlayPI container is running:

```bash
docker run -d --name playpi \
  -p 8000:8000 -p 8080:8080 -p 8081:8081 -p 8082:8082 \
  -p 8084:8084 -p 8085:8085 -p 8086:8086 \
  taqelah/playpi:latest
```

Verify the service is running:
```bash
curl http://localhost:8080/items
```

### 2. Install Dependencies

```bash
cd inventory-api-tests
npm install
```

## Running Tests

### Run All Tests
```bash
npm test
```

### Run Tests in UI Mode
```bash
npm run test:ui
```

### Run Tests in Debug Mode
```bash
npm run test:debug
```

### Run Specific Test File
```bash
npx playwright test tests/get-items.spec.ts
```

### Run Tests with Headed Browser
```bash
npm run test:headed
```

### View Test Report
```bash
npm run report
```

## Test Coverage

### GET /items - Get All Items
- Status code validation (200)
- Content-Type validation
- Response structure validation
- Data type validation
- Response time measurement

### GET /items/{id} - Get Item by ID
- Successful retrieval (200)
- Item data validation
- 404 for non-existent items
- Data type validation
- Response time measurement

### POST /items - Create New Item
- Successful creation (201)
- Response structure validation
- Special characters handling
- Decimal price handling
- Zero values handling
- Large quantity handling

### PUT /items/{id} - Full Update
- Successful full update (200)
- All fields update validation
- ID preservation
- 404 for non-existent items
- Zero values handling
- Long description handling

### PATCH /items/{id} - Partial Update
- Individual field updates
- Multiple field updates
- Unchanged field preservation
- 404 for non-existent items
- ID preservation
- Change persistence validation

### DELETE /items/{id} - Delete Item
- Successful deletion (204)
- Deletion verification
- 404 for non-existent items
- Double deletion handling
- Other items preservation
- Response time measurement

## API Configuration

The base URL is configured in [playwright.config.ts](playwright.config.ts):

```typescript
use: {
  baseURL: 'http://localhost:8080',
  extraHTTPHeaders: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  }
}
```

## Test Data

Tests use the following item structure:

```json
{
  "id": 1,
  "name": "Item Name",
  "description": "Item Description",
  "price": 99.99,
  "quantity": 10
}
```

### Field Specifications
- `id`: Auto-generated integer (read-only)
- `name`: String (required)
- `description`: String (required)
- `price`: Number (required, can be 0)
- `quantity`: Integer (required, can be 0)

## Best Practices Used

1. **Test Isolation**: Each test creates its own data using `beforeEach` hooks
2. **Cleanup**: Tests don't rely on external test data
3. **Assertions**: Multiple assertions per test for thorough validation
4. **Response Time**: Performance checks included where relevant
5. **Error Cases**: 404 and edge case testing included
6. **Data Validation**: Type checking and value validation

## Troubleshooting

### Tests Fail with Connection Error
**Problem**: Cannot connect to http://localhost:8080

**Solution**:
1. Check if PlayPI container is running:
   ```bash
   docker ps | grep playpi
   ```
2. If not running, start it:
   ```bash
   docker start playpi
   ```

### Port Already in Use
**Problem**: Port 8080 is already in use

**Solution**:
1. Find and stop the conflicting process
2. Or update `playwright.config.ts` to use a different port

### Tests Create Too Many Items
**Problem**: Database fills up with test items

**Solution**:
1. Restart PlayPI container to reset:
   ```bash
   docker restart playpi
   ```

## Next Steps

1. Add integration test flows (create -> update -> delete)
2. Add data-driven tests using test fixtures
3. Add schema validation using JSON Schema
4. Add authentication tests (if required)
5. Add negative test cases (invalid data, malformed requests)
6. Add performance/load testing

## Resources

- [Playwright Documentation](https://playwright.dev)
- [PlayPI Repository](https://github.com/abhivaikar/PlayPI)
- [REST API Testing Guide](../01_api_testing_basics.md)
- [PlayPI Setup Guide](../02_playpi_setup.md)
