#!/bin/bash

# Kill processes on ports 3000 and 5000
# Useful when servers are already running

echo "🔍 Checking for processes on ports 3000 and 5000..."

# Port 5000 (Backend) - Multiple methods
echo "🛑 Killing processes on port 5000..."
pkill -f "node.*server.js" 2>/dev/null
lsof -ti:5000 2>/dev/null | xargs kill -9 2>/dev/null
sleep 1

if lsof -ti:5000 >/dev/null 2>&1; then
  echo "⚠️  Port 5000 still in use. Try manually: lsof -ti:5000 | xargs kill -9"
else
  echo "✅ Port 5000 is now free"
fi

# Port 3000 (Frontend)
echo "🛑 Killing processes on port 3000..."
pkill -f "react-scripts" 2>/dev/null
lsof -ti:3000 2>/dev/null | xargs kill -9 2>/dev/null
sleep 1

if lsof -ti:3000 >/dev/null 2>&1; then
  echo "⚠️  Port 3000 still in use. Try manually: lsof -ti:3000 | xargs kill -9"
else
  echo "✅ Port 3000 is now free"
fi

echo ""
echo "✅ Done! You can now run: npm run dev"

