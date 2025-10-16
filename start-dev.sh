#!/bin/bash

echo "🚀 Starting Full-Stack Development Environment..."
echo ""

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to check if port is in use
check_port() {
    if lsof -Pi :$1 -sTCP:LISTEN -t >/dev/null ; then
        return 0
    else
        return 1
    fi
}

# Check if required ports are available
if check_port 5000; then
    echo -e "${YELLOW}⚠️  Warning: Port 5000 (Backend) is already in use${NC}"
    echo "   Please stop the process using port 5000 or change the backend port"
fi

if check_port 5173; then
    echo -e "${YELLOW}⚠️  Warning: Port 5173 (Frontend) is already in use${NC}"
    echo "   Please stop the process using port 5173 or the frontend will use a different port"
fi

echo ""
echo -e "${BLUE}📦 Starting Backend (Flask) on port 5001...${NC}"
cd backend
python app.py &
BACKEND_PID=$!
cd ..

echo -e "${BLUE}📦 Starting Frontend (Vite) on port 5173...${NC}"
cd frontend
npm run dev &
FRONTEND_PID=$!
cd ..

echo ""
echo -e "${GREEN}✅ Both servers are starting!${NC}"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo -e "${GREEN}🌐 Frontend:${NC} http://localhost:5173"
echo -e "${GREEN}🔧 Backend:${NC}  http://localhost:5001"
echo -e "${GREEN}📊 API Health:${NC} http://localhost:5001/health"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo -e "${YELLOW}Press Ctrl+C to stop both servers${NC}"
echo ""

# Wait for background processes
wait $BACKEND_PID $FRONTEND_PID

