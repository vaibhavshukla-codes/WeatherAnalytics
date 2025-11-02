#!/bin/bash
# Script to get your machine's IP address for network access

echo "╔════════════════════════════════════════════════════════════════╗"
echo "║                                                                ║"
echo "║        📍 Your Network IP Addresses                            ║"
echo "║                                                                ║"
echo "╚════════════════════════════════════════════════════════════════╝"
echo ""
echo "To access this app from other devices on your network, use:"
echo ""

# Get IP addresses
if [[ "$OSTYPE" == "darwin"* ]]; then
    # macOS
    IP=$(ipconfig getifaddr en0 2>/dev/null || ipconfig getifaddr en1 2>/dev/null || echo "Not found")
    echo "🌐 Frontend: http://${IP}:3001"
    echo "🌐 Backend:  http://${IP}:5001"
elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
    # Linux
    IP=$(hostname -I | awk '{print $1}' 2>/dev/null || echo "Not found")
    echo "🌐 Frontend: http://${IP}:3001"
    echo "🌐 Backend:  http://${IP}:5001"
else
    echo "⚠️  Unable to detect IP automatically"
    echo "   Please run: ipconfig (Windows) or ifconfig (Mac/Linux)"
fi

echo ""
echo "📋 Instructions:"
echo "1. Make sure both frontend and backend are running"
echo "2. Access from other devices using the IP addresses above"
echo "3. Make sure all devices are on the same WiFi/network"
echo ""
