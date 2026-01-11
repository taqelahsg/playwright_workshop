# Network Mocking Examples Index

Complete index of all 60+ network mocking examples organized by use case.

## 📂 Test Files Overview

| File | Tests | Focus Area |
|------|-------|------------|
| [01-blocking-requests.spec.ts](tests/01-blocking-requests.spec.ts) | 7 | Block unwanted requests |
| [02-mocking-api-responses.spec.ts](tests/02-mocking-api-responses.spec.ts) | 9 | Mock API responses |
| [03-modifying-requests.spec.ts](tests/03-modifying-requests.spec.ts) | 10 | Modify outgoing requests |
| [04-modifying-responses.spec.ts](tests/04-modifying-responses.spec.ts) | 10 | Modify incoming responses |
| [05-monitoring-network.spec.ts](tests/05-monitoring-network.spec.ts) | 11 | Monitor network activity |
| [06-real-world-scenarios.spec.ts](tests/06-real-world-scenarios.spec.ts) | 11 | Practical use cases |
| [07-advanced-patterns.spec.ts](tests/07-advanced-patterns.spec.ts) | 11 | Advanced techniques |

**Total: 69 Examples**

---

## 🚫 Blocking Requests

### Performance Optimization
- **Block images** - Speed up tests by preventing image loading
- **Block CSS** - Skip stylesheet downloads
- **Block JavaScript** - Prevent JS execution
- **Block fonts** - Skip web font downloads
- **Block media** - Prevent audio/video loading

### Privacy & Security
- **Block analytics** - Prevent Google Analytics, GTM
- **Block tracking** - Block Facebook, DoubleClick
- **Block third-party** - Block all external domains

### Resource Filtering
- **By resource type** - Filter by document, stylesheet, image, etc.
- **By file extension** - Block .png, .jpg, .js, .css files
- **By domain pattern** - Block specific domains or subdomains

---

## 🎭 Mocking API Responses

### Success Responses
- **Empty response** - Return empty array `[]`
- **Test data** - Return predefined mock data
- **Single item** - Mock individual resource
- **List of items** - Mock collection of resources
- **Paginated data** - Mock paginated API responses

### Error Responses
- **404 Not Found** - Resource doesn't exist
- **500 Server Error** - Internal server error
- **401 Unauthorized** - Authentication required
- **403 Forbidden** - Access denied
- **400 Bad Request** - Invalid request

### Dynamic Responses
- **Based on method** - Different responses for GET/POST/PUT
- **Based on URL** - Dynamic based on URL parameters
- **Based on ID** - Different data for different IDs
- **Based on query params** - Filter by query parameters

### Authentication
- **Login response** - Mock successful login
- **Login error** - Mock failed authentication
- **Token generation** - Return mock JWT tokens
- **User data** - Return mock user profile

---

## ✏️ Modifying Requests

### Headers
- **Add auth header** - Add Bearer token to all API calls
- **Add custom headers** - Request ID, client version, platform
- **Remove headers** - Remove sensitive headers
- **Modify content-type** - Change content type
- **Add correlation ID** - Track requests across services

### Request Data
- **Modify method** - Change GET to POST
- **Modify body** - Add metadata to POST data
- **Add query params** - Append test parameters
- **Modify URL** - Change request destination

### Use Cases
- **Authentication** - Add tokens to protected endpoints
- **Test mode** - Add test-mode headers
- **Tracking** - Add correlation/request IDs
- **Debugging** - Add debug headers

---

## 🔄 Modifying Responses

### Response Data
- **Modify text** - Change response text content
- **Add JSON fields** - Add metadata to JSON responses
- **Filter data** - Remove items from arrays
- **Sort data** - Sort response arrays
- **Transform structure** - Change response format

### Response Metadata
- **Add headers** - Add custom response headers
- **Modify status** - Change status code
- **Add timestamps** - Track response timing
- **Add test flags** - Mark as mocked/test data

### Performance Testing
- **Simulate delays** - Add artificial latency
- **Variable delays** - Delays based on data size
- **Track timing** - Measure fetch duration

### Combining Data
- **Real + Mock** - Combine real API with mock data
- **Fallback** - Mock some, real for others
- **Enhancement** - Add fields to real responses

---

## 📊 Monitoring Network

### Request Tracking
- **Log all requests** - Track every request made
- **Log API calls only** - Filter to API endpoints
- **Count by type** - Group by resource type
- **Track methods** - Count GET/POST/PUT/DELETE

### Response Tracking
- **Log all responses** - Track every response
- **Track status codes** - Count 200/404/500 responses
- **Track timing** - Measure response times
- **Track sizes** - Measure response body sizes

### Waiting & Assertions
- **Wait for specific URL** - Wait for exact endpoint
- **Wait with predicate** - Wait for matching response
- **Wait for multiple** - Wait for several responses
- **Assert API called** - Verify request was made

### Performance
- **Response times** - Track API performance
- **Failed requests** - Track and debug failures
- **Total bandwidth** - Calculate data transferred
- **Average timing** - Calculate average response time

---

## 🌍 Real-World Scenarios

### UI State Testing
- **Loading states** - Test loading indicators
- **Empty states** - Test "no data" messages
- **Error states** - Test error displays
- **Success states** - Test success messages

### Error Handling
- **404 handling** - Not found errors
- **500 handling** - Server errors
- **Network failure** - Connection errors
- **Timeout handling** - Request timeouts
- **Rate limiting** - 429 Too Many Requests

### Authentication Flows
- **Login flow** - Mock successful login
- **Login errors** - Invalid credentials
- **Registration** - Mock user registration
- **Validation errors** - Field validation errors
- **Protected routes** - Authorized access

### Data Operations
- **Pagination** - Mock page navigation
- **Search** - Mock search results
- **Filtering** - Mock filtered data
- **Sorting** - Mock sorted results

### File Operations
- **Upload** - Mock file upload
- **Download** - Mock file download
- **Validation** - File type/size validation

---

## 🎯 Advanced Patterns

### Stateful Mocking
- **CRUD operations** - Full create/read/update/delete
- **In-memory store** - Persistent mock data
- **State management** - Track changes across requests
- **Request counter** - Count API calls

### Conditional Mocking
- **Environment-based** - Mock based on NODE_ENV
- **Feature flags** - Enable/disable mocking
- **Selective mocking** - Mock some, real for others
- **Fallback to real** - Mock specific IDs only

### Performance Testing
- **Response time tracking** - Measure API speed
- **Average/min/max** - Calculate statistics
- **Performance assertions** - Assert < 1000ms
- **Load simulation** - Simulate slow networks

### Chaos Engineering
- **Random failures** - Probability-based errors
- **Rotating responses** - Different data each call
- **Variable delays** - Random latency
- **Error injection** - Inject errors randomly

### Request Validation
- **Field validation** - Require specific fields
- **Type validation** - Check data types
- **Business logic** - Validate business rules
- **Error responses** - Return validation errors

### Complex Flows
- **Authentication chain** - Login → fetch data
- **Dependent requests** - Request A → Request B
- **Multi-step flows** - Complete workflows
- **Token management** - Track and use tokens

### Recording & Replay
- **Record mode** - Save real interactions
- **Replay mode** - Use saved responses
- **HAR support** - HTTP Archive format
- **Session replay** - Replay entire sessions

---

## 🎓 Learning Path

### Beginner (Start Here)
1. Block images and CSS (01)
2. Mock simple API response (02)
3. Wait for API response (05)
4. Test loading state (06)

### Intermediate
1. Add authentication header (03)
2. Mock error responses (02)
3. Modify response data (04)
4. Track API calls (05)
5. Test error handling (06)

### Advanced
1. Stateful CRUD mock (07)
2. Conditional mocking (07)
3. Performance testing (07)
4. Chaos engineering (07)
5. Request validation (07)

---

## 🔍 Find Examples By Use Case

### "I want to..."

**...make my tests faster**
→ Block images/CSS (01)
→ Block tracking (01)

**...test without backend**
→ Mock API responses (02)
→ Stateful mocking (07)

**...test error handling**
→ Mock errors (02)
→ Network failures (06)

**...test authentication**
→ Add auth headers (03)
→ Mock login (06)

**...test loading states**
→ Delayed responses (04, 06)

**...test with realistic data**
→ Mock with test data (02)
→ Modify real responses (04)

**...debug network issues**
→ Log all requests (05)
→ Track API calls (05)

**...test performance**
→ Track timing (05)
→ Performance testing (07)

**...simulate slow network**
→ Add delays (04)
→ Variable delays (07)

**...test pagination**
→ Mock paginated response (02)
→ Pagination scenario (06)

---

## 📝 Running Specific Examples

```bash
# Run all examples
npm test

# Run specific file
npx playwright test tests/01-blocking-requests.spec.ts

# Run specific test
npx playwright test -g "Block all images"

# Run by use case
npx playwright test -g "authentication"
npx playwright test -g "error"
npx playwright test -g "loading"

# Run in UI mode (recommended for learning)
npm run test:ui
```

---

## 💡 Tips

1. **Start simple** - Begin with blocking and basic mocking
2. **Use UI mode** - Best way to see what's happening
3. **Read comments** - Each test has detailed explanations
4. **Modify examples** - Change URLs, data, patterns
5. **Combine techniques** - Mix blocking + mocking + monitoring
6. **Check console** - Many examples log useful information
7. **Use breakpoints** - Debug with `await page.pause()`

---

**Happy Learning! 🚀**

For more details, see:
- [README.md](README.md) - Project overview
- [QUICK_REFERENCE.md](QUICK_REFERENCE.md) - Quick syntax reference
- [Network Mocking Guide](../03_network_mocking.md) - Complete guide
