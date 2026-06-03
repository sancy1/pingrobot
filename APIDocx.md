✅ COMPLETE API CONSUMPTION GUIDE - Updated for Render Deployment
Here is your updated and complete API documentation with all endpoints, authentication, and external consumption procedures.

📚 PINGROBOT API CONSUMPTION GUIDE
Complete Documentation for External Services
🌐 Base URL Configuration
Environment	Base URL
Development	http://localhost:3000/api
Production (Render)	https://pingrobot.onrender.com/api
Production (Vercel)	https://pingrobot.vercel.app/api
🔑 Authentication Requirements
All API endpoints require the X-API-Key header for authentication.

Set Your API Key:
In your .env.local or Render/Vercel environment variables:

bash
EXTERNAL_API_KEY=ZoY098Sd0aDIl7TdLi4V4fiYIoyo
Generate a Secure Key (Production Only):
bash
# Generate a random 32-character key
openssl rand -hex 32

# Or using Node.js
node -e "console.log(crypto.randomBytes(32).toString('hex'))"
📡 Available API Endpoints
Method	Endpoint	Description
GET	/monitors	List all monitors
POST	/monitors	Create a new monitor
GET	/monitors/{id}	Get single monitor details
PUT	/monitors/{id}	Update monitor configuration
DELETE	/monitors/{id}	Delete a monitor
POST	/monitors/{id}/ping	Trigger manual ping
GET	/pings	Get ping history
GET	/health/db	Database health check
1️⃣ GET - List All Monitors
Endpoint: GET /api/monitors

Description: Returns all monitors in your account.

cURL Example:
bash
curl -X GET "https://pingrobot.onrender.com/api/monitors" \
  -H "X-API-Key: ZoY098Sd0aDIl7TdLi4V4fiYIoyo"
JavaScript/Fetch Example:
javascript
const response = await fetch('https://pingrobot.onrender.com/api/monitors', {
  method: 'GET',
  headers: {
    'X-API-Key': 'ZoY098Sd0aDIl7TdLi4V4fiYIoyo',
    'Content-Type': 'application/json'
  }
});

const data = await response.json();
console.log(data.monitors);
Python Example:
python
import requests

headers = {
    'X-API-Key': 'ZoY098Sd0aDIl7TdLi4V4fiYIoyo',
    'Content-Type': 'application/json'
}

response = requests.get('https://pingrobot.onrender.com/api/monitors', headers=headers)
monitors = response.json()
for monitor in monitors['monitors']:
    print(f"{monitor['name']}: {monitor['status']}")
Successful Response (200 OK):
json
{
  "success": true,
  "monitors": [
    {
      "id": 1,
      "name": "Production API",
      "url": "https://api.example.com/health",
      "status": "up",
      "isActive": true,
      "uptimePercentage": "99.98",
      "intervalSeconds": 300
    }
  ],
  "count": 1
}
2️⃣ POST - Create a New Monitor
Endpoint: POST /api/monitors

Description: Creates a new monitor to track a URL.

Request Body Parameters:
Field	Type	Required	Description	Validation
name	string	Yes	Monitor display name	Max 255 chars
url	string	Yes	Endpoint URL	Must start with http:// or https://
description	string	No	Optional notes	Max 1000 chars
intervalSeconds	integer	No	Check frequency (default: 300)	30-86400 seconds
timeoutMs	integer	No	Request timeout (default: 60000)	5000-120000 ms
monitorType	string	No	http/https/api/website (default: http)	Valid type
method	string	No	GET/HEAD/POST/OPTIONS (default: GET)	Valid method
region	string	No	auto/us-east-1/etc (default: auto)	Valid region
sslEnabled	boolean	No	Monitor SSL expiry (default: false)	true/false
customHeaders	object	No	JSON key-value pairs	Valid JSON
requestBody	string	No	POST request body	Any string
expectedStatusCodes	array	No	Success codes (default: [200,201,202,204])	Array of numbers
cURL Example:
bash
curl -X POST "https://pingrobot.onrender.com/api/monitors" \
  -H "X-API-Key: ZoY098Sd0aDIl7TdLi4V4fiYIoyo" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "My API Monitor",
    "url": "https://api.example.com/health",
    "intervalSeconds": 300,
    "timeoutMs": 60000
  }'
JavaScript Example:
javascript
const response = await fetch('https://pingrobot.onrender.com/api/monitors', {
  method: 'POST',
  headers: {
    'X-API-Key': 'ZoY098Sd0aDIl7TdLi4V4fiYIoyo',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    name: 'My API Monitor',
    url: 'https://api.example.com/health',
    intervalSeconds: 300,
    timeoutMs: 60000
  })
});

const data = await response.json();
console.log('Monitor created:', data.monitor);
Python Example:
python
import requests
import json

payload = {
    'name': 'My API Monitor',
    'url': 'https://api.example.com/health',
    'intervalSeconds': 300,
    'timeoutMs': 60000
}

headers = {
    'X-API-Key': 'ZoY098Sd0aDIl7TdLi4V4fiYIoyo',
    'Content-Type': 'application/json'
}

response = requests.post('https://pingrobot.onrender.com/api/monitors', 
                         headers=headers, 
                         json=payload)
print(response.json())
Successful Response (201 Created):
json
{
  "success": true,
  "monitor": {
    "id": 10,
    "name": "My API Monitor",
    "url": "https://api.example.com/health",
    "status": "pending",
    "isActive": true,
    "intervalSeconds": 300,
    "createdAt": "2024-01-15T10:30:00.000Z"
  },
  "message": "Monitor created successfully"
}
Error Responses:
Status	Error	Description
400	Validation Error	Missing or invalid fields
409	Conflict	Monitor with this URL already exists
401	Unauthorized	Invalid or missing X-API-Key
3️⃣ GET - Retrieve Single Monitor
Endpoint: GET /api/monitors/{id}

Description: Fetches complete configuration for a specific monitor.

cURL Example:
bash
curl -X GET "https://pingrobot.onrender.com/api/monitors/1" \
  -H "X-API-Key: ZoY098Sd0aDIl7TdLi4V4fiYIoyo"
JavaScript Example:
javascript
const response = await fetch('https://pingrobot.onrender.com/api/monitors/1', {
  headers: { 'X-API-Key': 'ZoY098Sd0aDIl7TdLi4V4fiYIoyo' }
});
const monitor = await response.json();
Python Example:
python
response = requests.get(
    'https://pingrobot.onrender.com/api/monitors/1',
    headers={'X-API-Key': 'ZoY098Sd0aDIl7TdLi4V4fiYIoyo'}
)
monitor = response.json()
print(monitor['monitor']['name'], monitor['monitor']['status'])
Successful Response (200 OK):
json
{
  "success": true,
  "monitor": {
    "id": 1,
    "name": "Production API",
    "url": "https://api.example.com/health",
    "status": "up",
    "isActive": true,
    "uptimePercentage": "99.98",
    "intervalSeconds": 300,
    "timeoutMs": 60000,
    "averageResponseMs": 234
  },
  "message": "Monitor retrieved successfully"
}
4️⃣ PUT - Update Monitor
Endpoint: PUT /api/monitors/{id}

Description: Updates specific fields of an existing monitor.

cURL Example:
bash
curl -X PUT "https://pingrobot.onrender.com/api/monitors/1" \
  -H "X-API-Key: ZoY098Sd0aDIl7TdLi4V4fiYIoyo" \
  -H "Content-Type: application/json" \
  -d '{
    "intervalSeconds": 600,
    "timeoutMs": 60000,
    "isActive": false
  }'
JavaScript Example:
javascript
const response = await fetch('https://pingrobot.onrender.com/api/monitors/1', {
  method: 'PUT',
  headers: {
    'X-API-Key': 'ZoY098Sd0aDIl7TdLi4V4fiYIoyo',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    intervalSeconds: 600,
    sslEnabled: true,
    customHeaders: { "Authorization": "Bearer token123" }
  })
});
Successful Response (200 OK):
json
{
  "success": true,
  "monitor": {
    "id": 1,
    "name": "Production API",
    "intervalSeconds": 600,
    "updatedAt": "2024-01-15T10:30:00.000Z"
  },
  "message": "Monitor updated successfully"
}
5️⃣ DELETE - Remove Monitor
Endpoint: DELETE /api/monitors/{id}

Description: Permanently deletes a monitor and all associated data (ping results, metrics, alerts). This action is IRREVERSIBLE.

cURL Example:
bash
curl -X DELETE "https://pingrobot.onrender.com/api/monitors/1" \
  -H "X-API-Key: ZoY098Sd0aDIl7TdLi4V4fiYIoyo"
JavaScript Example:
javascript
const response = await fetch('https://pingrobot.onrender.com/api/monitors/1', {
  method: 'DELETE',
  headers: { 'X-API-Key': 'ZoY098Sd0aDIl7TdLi4V4fiYIoyo' }
});

if (response.ok) {
  console.log('Monitor deleted successfully');
}
Successful Response (200 OK):
json
{
  "success": true,
  "message": "Monitor \"Production API\" has been permanently removed",
  "deletedMonitorId": 1
}
6️⃣ POST - Trigger Manual Ping
Endpoint: POST /api/monitors/{id}/ping

Description: Triggers an immediate health check on the monitor. The ping executes with 60-second timeout and 3 retry attempts for wake-up detection.

cURL Example:
bash
curl -X POST "https://pingrobot.onrender.com/api/monitors/1/ping" \
  -H "X-API-Key: ZoY098Sd0aDIl7TdLi4V4fiYIoyo"
JavaScript Example:
javascript
const response = await fetch('https://pingrobot.onrender.com/api/monitors/1/ping', {
  method: 'POST',
  headers: { 'X-API-Key': 'ZoY098Sd0aDIl7TdLi4V4fiYIoyo' }
});

const result = await response.json();
console.log(result.message);
Successful Response (200 OK):
json
{
  "success": true,
  "message": "Ping triggered for Production API",
  "monitorId": 1,
  "note": "Results will be available in the ping history"
}
7️⃣ GET - Ping History
Endpoint: GET /api/pings

Query Parameters:

Parameter	Type	Description	Default
monitorId	integer	Filter by monitor ID	All monitors
limit	integer	Number of results	50
offset	integer	Pagination offset	0
cURL Example:
bash
curl -X GET "https://pingrobot.onrender.com/api/pings?monitorId=1&limit=10" \
  -H "X-API-Key: ZoY098Sd0aDIl7TdLi4V4fiYIoyo"
JavaScript Example:
javascript
const response = await fetch('https://pingrobot.onrender.com/api/pings?monitorId=1&limit=20', {
  headers: { 'X-API-Key': 'ZoY098Sd0aDIl7TdLi4V4fiYIoyo' }
});

const data = await response.json();
data.pings.forEach(ping => {
  console.log(`${ping.createdAt}: ${ping.success ? 'UP' : 'DOWN'} (${ping.responseTimeMs}ms)`);
});
Successful Response (200 OK):
json
{
  "success": true,
  "pings": [
    {
      "id": 100,
      "monitorId": 1,
      "statusCode": 200,
      "responseTimeMs": 234,
      "success": true,
      "isWakeUp": false,
      "jsonResponse": { "status": "healthy" },
      "createdAt": "2024-01-15T10:30:00.000Z"
    },
    {
      "id": 99,
      "monitorId": 1,
      "statusCode": 200,
      "responseTimeMs": 8423,
      "success": true,
      "isWakeUp": true,
      "jsonResponse": { "status": "waking" },
      "createdAt": "2024-01-15T10:25:00.000Z"
    }
  ],
  "total": 100,
  "limit": 10,
  "offset": 0
}
8️⃣ GET - Database Health Check
Endpoint: GET /api/health/db

Description: Checks database connection status and returns table information.

cURL Example:
bash
curl -X GET "https://pingrobot.onrender.com/api/health/db" \
  -H "X-API-Key: ZoY098Sd0aDIl7TdLi4V4fiYIoyo"
Successful Response (200 OK):
json
{
  "success": true,
  "status": "connected",
  "message": "✅ Database connection is healthy and verified",
  "database": {
    "tables": ["monitors", "ping_results", "health_metrics", "alerts"],
    "monitorCount": 5
  }
}
🧪 Testing Your API Endpoints
Local Testing:
bash
# Get all monitors
curl -X GET "http://localhost:3000/api/monitors" \
  -H "X-API-Key: ZoY098Sd0aDIl7TdLi4V4fiYIoyo"

# Create a monitor
curl -X POST "http://localhost:3000/api/monitors" \
  -H "X-API-Key: ZoY098Sd0aDIl7TdLi4V4fiYIoyo" \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","url":"https://jsonplaceholder.typicode.com/posts/1"}'

# Trigger ping
curl -X POST "http://localhost:3000/api/monitors/1/ping" \
  -H "X-API-Key: ZoY098Sd0aDIl7TdLi4V4fiYIoyo"
Production Testing (Render):
bash
# Replace with your actual Render URL
curl -X GET "https://your-app.onrender.com/api/monitors" \
  -H "X-API-Key: ZoY098Sd0aDIl7TdLi4V4fiYIoyo"
🔒 Security Features
Feature	Implementation
API Key Authentication	All endpoints require X-API-Key header
CORS Headers	Allows external browser-based clients
OPTIONS Preflight	Handles browser CORS checks
Input Validation	ID format, field types, ranges
Error Messages	Clear, actionable error responses
Rate Limiting	Not implemented (consider adding for production)
🚀 Integration Examples
React/Next.js Frontend (Internal):
javascript
const API_KEY = process.env.NEXT_PUBLIC_EXTERNAL_API_KEY;

const response = await fetch('/api/monitors', {
  headers: { 'X-API-Key': API_KEY }
});
External Node.js Service:
javascript
const response = await fetch('https://pingrobot.onrender.com/api/monitors/1', {
  headers: { 'X-API-Key': process.env.PINGROBOT_API_KEY }
});
External Python Service:
python
import os
import requests

response = requests.get(
    'https://pingrobot.onrender.com/api/monitors/1',
    headers={'X-API-Key': os.environ['PINGROBOT_API_KEY']}
)
External PHP Service:
php
<?php
$apiKey = getenv('PINGROBOT_API_KEY');
$ch = curl_init('https://pingrobot.onrender.com/api/monitors');
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'X-API-Key: ' . $apiKey,
    'Content-Type: application/json'
]);
$response = curl_exec($ch);
curl_close($ch);
$data = json_decode($response, true);
print_r($data);
?>
External Go Service:
go
package main

import (
    "fmt"
    "io"
    "net/http"
    "os"
)

func main() {
    apiKey := os.Getenv("PINGROBOT_API_KEY")
    req, _ := http.NewRequest("GET", "https://pingrobot.onrender.com/api/monitors", nil)
    req.Header.Set("X-API-Key", apiKey)
    
    client := &http.Client{}
    resp, err := client.Do(req)
    if err != nil {
        panic(err)
    }
    defer resp.Body.Close()
    
    body, _ := io.ReadAll(resp.Body)
    fmt.Println(string(body))
}
⚠️ Error Codes Summary
Code	Meaning	Action
200	Success	Request processed correctly
201	Created	Monitor successfully created
400	Bad Request	Check input validation errors
401	Unauthorized	Invalid or missing API key
404	Not Found	Monitor ID doesn't exist
409	Conflict	Monitor URL already exists
500	Server Error	Contact administrator
📞 Support
For API support or questions:

Repository: https://github.com/sancy1/pingrobot

Documentation: See README.md

This completes the API Consumption Guide. All endpoints are ready for external integration! 🎯