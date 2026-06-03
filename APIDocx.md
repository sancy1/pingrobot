📚 API CONSUMPTION GUIDE - External Services
Base URL Configuration
text
Development: http://localhost:3000/api/monitors
Production:  https://your-domain.vercel.app/api/monitors
Authentication Requirement
All endpoints require the X-API-Key header. Set your key in .env.local:

bash
EXTERNAL_API_KEY=your-strong-secret-key-here
1. GET - Retrieve a Single Monitor
Endpoint: GET /api/monitors/{id}
Description: Fetches complete configuration details for a specific monitor by its ID.
Request Example (cURL):
bash
curl -X GET "https://your-domain.vercel.app/api/monitors/1" \
  -H "X-API-Key: your-secret-key" \
  -H "Content-Type: application/json"
Request Example (JavaScript/Fetch):
javascript
const response = await fetch('https://your-domain.vercel.app/api/monitors/1', {
  method: 'GET',
  headers: {
    'X-API-Key': 'your-secret-key',
    'Content-Type': 'application/json'
  }
});

const data = await response.json();
console.log(data.monitor);
Request Example (Python):
python
import requests

headers = {
    'X-API-Key': 'your-secret-key',
    'Content-Type': 'application/json'
}

response = requests.get('https://your-domain.vercel.app/api/monitors/1', headers=headers)
monitor = response.json()
print(monitor['monitor']['name'])
Successful Response (200 OK):
json
{
  "success": true,
  "monitor": {
    "id": 1,
    "name": "Production API",
    "url": "https://api.example.com/health",
    "status": "up",
    "intervalSeconds": 300,
    "uptimePercentage": "99.98"
  },
  "message": "Monitor retrieved successfully"
}
Error Responses:
Status Code	Reason	Response
401	Missing/invalid API key	{"error": "Unauthorized..."}
400	Invalid ID format	{"error": "Invalid monitor ID format"}
404	Monitor not found	{"error": "Monitor not found"}
500	Server error	{"error": "Internal server error"}
2. PUT - Update a Monitor
Endpoint: PUT /api/monitors/{id}
Description: Updates configuration parameters for an existing monitor. Only provided fields will be updated.
Request Example (cURL):
bash
curl -X PUT "https://your-domain.vercel.app/api/monitors/1" \
  -H "X-API-Key: your-secret-key" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Updated API Name",
    "intervalSeconds": 600,
    "timeoutMs": 60000
  }'
Request Example (JavaScript):
javascript
const response = await fetch('https://your-domain.vercel.app/api/monitors/1', {
  method: 'PUT',
  headers: {
    'X-API-Key': 'your-secret-key',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    intervalSeconds: 300,
    timeoutMs: 60000,
    sslEnabled: true
  })
});

const result = await response.json();
Request Example (Python):
python
import requests

payload = {
    'intervalSeconds': 300,
    'timeoutMs': 60000,
    'customHeaders': {'Authorization': 'Bearer token123'}
}

response = requests.put(
    'https://your-domain.vercel.app/api/monitors/1',
    headers={'X-API-Key': 'your-secret-key'},
    json=payload
)
Updatable Fields:
Field	Type	Description	Validation
name	string	Monitor display name	Max 255 chars
url	string	Endpoint URL	Must start with http:// or https://
description	string	Optional notes	Max 1000 chars
intervalSeconds	integer	Check frequency	30-86400 seconds
timeoutMs	integer	Request timeout	5000-120000 ms
monitorType	string	http/https/api/website	Must be valid type
method	string	GET/HEAD/POST/OPTIONS	Must be valid method
region	string	auto/us-east-1/etc	Must be valid region
sslEnabled	boolean	Monitor SSL expiry	true/false
customHeaders	object	JSON key-value pairs	Valid JSON
requestBody	string	POST request body	Any string
expectedStatusCodes	array	Success codes	Array of numbers
isActive	boolean	Enable/disable monitoring	true/false
Successful Response (200 OK):
json
{
  "success": true,
  "monitor": {
    "id": 1,
    "name": "Updated API Name",
    "intervalSeconds": 600,
    "updatedAt": "2024-01-15T10:30:00.000Z"
  },
  "message": "Monitor updated successfully"
}
3. DELETE - Remove a Monitor
Endpoint: DELETE /api/monitors/{id}
Description: Permanently deletes a monitor and ALL associated ping results, health metrics, and alerts. This action is irreversible.
Request Example (cURL):
bash
curl -X DELETE "https://your-domain.vercel.app/api/monitors/1" \
  -H "X-API-Key: your-secret-key"
Request Example (JavaScript):
javascript
const response = await fetch('https://your-domain.vercel.app/api/monitors/1', {
  method: 'DELETE',
  headers: {
    'X-API-Key': 'your-secret-key'
  }
});

if (response.ok) {
  console.log('Monitor deleted successfully');
}
Successful Response (200 OK):
json
{
  "success": true,
  "message": "Monitor \"Production API\" and all associated data deleted successfully",
  "deletedMonitorId": 1
}
4. OPTIONS - CORS Preflight
Endpoint: OPTIONS /api/monitors/{id}
Description: Used by browsers to check CORS permissions before making actual requests. External services rarely need to call this directly.
Response Headers:
text
Access-Control-Allow-Origin: *
Access-Control-Allow-Methods: GET, PUT, DELETE, OPTIONS
Access-Control-Allow-Headers: Content-Type, Authorization, X-API-Key
Access-Control-Max-Age: 86400
🔧 Environment Setup for External Access
Step 1: Set API Key in Production
In your Vercel dashboard or .env.local:

bash
EXTERNAL_API_KEY=your-strong-secret-min-32-chars
Step 2: Generate a Secure Key
bash
# Generate a random 32-character key
openssl rand -hex 32

# Or use Node.js
node -e "console.log(crypto.randomBytes(32).toString('hex'))"
Step 3: Share Key with External Services
Provide your external services with:

Your API endpoint URL

The X-API-Key value

This documentation

🧪 Testing Your API Endpoints
Local Testing:
bash
# Get monitor by ID
curl -X GET "http://localhost:3000/api/monitors/1" \
  -H "X-API-Key: my-super-secret-key-123"

# Update monitor
curl -X PUT "http://localhost:3000/api/monitors/1" \
  -H "X-API-Key: my-super-secret-key-123" \
  -H "Content-Type: application/json" \
  -d '{"intervalSeconds": 120}'

# Delete monitor
curl -X DELETE "http://localhost:3000/api/monitors/1" \
  -H "X-API-Key: my-super-secret-key-123"
Expected Successful Output:
json
{
  "success": true,
  "monitor": { ... },
  "message": "Monitor retrieved successfully"
}
✅ Key Security Features
Feature	Implementation
API Key Authentication	All endpoints require X-API-Key header
CORS Headers	Allows external browser-based clients
OPTIONS Preflight	Handles browser CORS checks
Input Validation	ID format, field types, ranges
Error Messages	Clear, actionable error responses
Async Connection Fix	await dbManager.getDb() resolves promises
🚀 Integration Examples
React/Next.js Frontend (Internal):
javascript
const response = await fetch('/api/monitors/1', {
  headers: {
    'X-API-Key': process.env.NEXT_PUBLIC_API_KEY
  }
});
External Node.js Service:
javascript
const response = await fetch('https://pingforge.vercel.app/api/monitors/1', {
  headers: {
    'X-API-Key': process.env.PINGFORGE_API_KEY
  }
});
External Python Service:
python
import os
import requests

response = requests.get(
    'https://pingforge.vercel.app/api/monitors/1',
    headers={'X-API-Key': os.environ['PINGFORGE_API_KEY']}
)
