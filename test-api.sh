#!/bin/bash

echo "🧪 MaiPro API Test Suite"
echo "========================"
echo ""

BASE_URL="http://localhost:5000"

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Test counter
PASSED=0
FAILED=0

# Function to test endpoint
test_endpoint() {
    local name=$1
    local method=$2
    local endpoint=$3
    local expected_status=$4
    
    echo -n "Testing: $name... "
    
    response=$(curl -s -o /dev/null -w "%{http_code}" -X $method "$BASE_URL$endpoint")
    
    if [ "$response" == "$expected_status" ]; then
        echo -e "${GREEN}✓ PASSED${NC} (HTTP $response)"
        ((PASSED++))
    else
        echo -e "${RED}✗ FAILED${NC} (Expected $expected_status, got $response)"
        ((FAILED++))
    fi
}

# Check if server is running
echo "Checking if server is running..."
if ! curl -s "$BASE_URL/health" > /dev/null; then
    echo -e "${RED}✗ Server is not running!${NC}"
    echo "Please start the server with: npm start or npm run dev"
    exit 1
fi
echo -e "${GREEN}✓ Server is running${NC}"
echo ""

# Run tests
echo "Running API Tests:"
echo "------------------"

# Health check
test_endpoint "Health Check" "GET" "/health" "200"

# Service categories
test_endpoint "Get Service Categories" "GET" "/api/services/categories" "200"

# List services
test_endpoint "List Services" "GET" "/api/services" "200"

# Search providers
test_endpoint "Search Providers" "GET" "/api/providers/search" "200"

# Auth endpoints (these should work)
test_endpoint "Register Endpoint Available" "POST" "/api/auth/register" "400"
test_endpoint "Login Endpoint Available" "POST" "/api/auth/login" "400"

# Protected endpoints (should return 401)
test_endpoint "Protected Profile Endpoint" "GET" "/api/auth/profile" "401"
test_endpoint "Protected Create Booking" "POST" "/api/bookings" "401"

echo ""
echo "========================"
echo "Test Results:"
echo -e "${GREEN}Passed: $PASSED${NC}"
echo -e "${RED}Failed: $FAILED${NC}"
echo ""

if [ $FAILED -eq 0 ]; then
    echo -e "${GREEN}🎉 All tests passed!${NC}"
    exit 0
else
    echo -e "${RED}⚠️  Some tests failed${NC}"
    exit 1
fi
