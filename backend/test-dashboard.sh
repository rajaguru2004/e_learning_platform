#!/bin/bash

# Admin Dashboard API - Quick Test Script
# This script tests the admin dashboard endpoint with different scenarios

echo "🧪 Admin Dashboard API Test Suite"
echo "=================================="
echo ""

BASE_URL="http://localhost:3000"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo "Test 1: Unauthenticated Access (Should return 401)"
echo "---------------------------------------------------"
RESPONSE=$(curl -s -w "\n%{http_code}" "$BASE_URL/api/admin/dashboard")
HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
BODY=$(echo "$RESPONSE" | sed '$d')

if [ "$HTTP_CODE" = "401" ]; then
    echo -e "${GREEN}✓ PASSED${NC} - Got 401 Unauthorized"
    echo "Response: $BODY"
else
    echo -e "${RED}✗ FAILED${NC} - Expected 401, got $HTTP_CODE"
    echo "Response: $BODY"
fi

echo ""
echo "---------------------------------------------------"
echo ""

echo "Test 2: Register and Login as Admin User"
echo "---------------------------------------------------"

# Register admin user
echo "Registering admin user..."
REGISTER_RESPONSE=$(curl -s -X POST "$BASE_URL/api/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Admin",
    "email": "testadmin@example.com",
    "password": "admin123",
    "role": "ADMIN"
  }')

echo "Register Response: $REGISTER_RESPONSE"
echo ""

# Login as admin
echo "Logging in as admin..."
LOGIN_RESPONSE=$(curl -s -X POST "$BASE_URL/api/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "testadmin@example.com",
    "password": "admin123"
  }')

# Extract token
ADMIN_TOKEN=$(echo $LOGIN_RESPONSE | grep -o '"token":"[^"]*' | sed 's/"token":"//')

if [ -z "$ADMIN_TOKEN" ]; then
    echo -e "${RED}✗ FAILED${NC} - Could not get admin token"
    echo "Login Response: $LOGIN_RESPONSE"
    exit 1
else
    echo -e "${GREEN}✓ Got admin token${NC}"
fi

echo ""
echo "---------------------------------------------------"
echo ""

echo "Test 3: Access Dashboard with Admin Token (Should return 200)"
echo "---------------------------------------------------"
DASHBOARD_RESPONSE=$(curl -s -w "\n%{http_code}" "$BASE_URL/api/admin/dashboard" \
  -H "Authorization: Bearer $ADMIN_TOKEN")

HTTP_CODE=$(echo "$DASHBOARD_RESPONSE" | tail -n1)
BODY=$(echo "$DASHBOARD_RESPONSE" | sed '$d')

if [ "$HTTP_CODE" = "200" ]; then
    echo -e "${GREEN}✓ PASSED${NC} - Got 200 OK"
    echo "Dashboard Data:"
    echo "$BODY" | python3 -m json.tool 2>/dev/null || echo "$BODY"
else
    echo -e "${RED}✗ FAILED${NC} - Expected 200, got $HTTP_CODE"
    echo "Response: $BODY"
fi

echo ""
echo "---------------------------------------------------"
echo ""

echo "Test 4: Register Learner and Try to Access Dashboard (Should return 403)"
echo "---------------------------------------------------"

# Register learner
echo "Registering learner user..."
curl -s -X POST "$BASE_URL/api/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Learner",
    "email": "testlearner@example.com",
    "password": "learner123",
    "role": "LEARNER"
  }' > /dev/null

# Login as learner
echo "Logging in as learner..."
LEARNER_LOGIN=$(curl -s -X POST "$BASE_URL/api/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "testlearner@example.com",
    "password": "learner123"
  }')

LEARNER_TOKEN=$(echo $LEARNER_LOGIN | grep -o '"token":"[^"]*' | sed 's/"token":"//')

if [ -z "$LEARNER_TOKEN" ]; then
    echo -e "${YELLOW}⚠ WARNING${NC} - Could not get learner token (maybe user already exists)"
else
    echo -e "${GREEN}✓ Got learner token${NC}"
    
    # Try to access dashboard
    LEARNER_ACCESS=$(curl -s -w "\n%{http_code}" "$BASE_URL/api/admin/dashboard" \
      -H "Authorization: Bearer $LEARNER_TOKEN")
    
    HTTP_CODE=$(echo "$LEARNER_ACCESS" | tail -n1)
    BODY=$(echo "$LEARNER_ACCESS" | sed '$d')
    
    if [ "$HTTP_CODE" = "403" ]; then
        echo -e "${GREEN}✓ PASSED${NC} - Got 403 Forbidden"
        echo "Response: $BODY"
    else
        echo -e "${RED}✗ FAILED${NC} - Expected 403, got $HTTP_CODE"
        echo "Response: $BODY"
    fi
fi

echo ""
echo "=================================="
echo "✅ Test Suite Complete!"
echo "=================================="
