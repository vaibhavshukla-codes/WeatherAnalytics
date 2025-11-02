#!/bin/bash

# Quick start script for Weather Analytics with network access

echo ""
echo "╔════════════════════════════════════════════════════════════════╗"
echo "║                                                                ║"
echo "║        🌦️  Weather Analytics Dashboard                        ║"
echo "║                                                                ║"
echo "╚════════════════════════════════════════════════════════════════╝"
echo ""

# Get IP address
if [[ "$OSTYPE" == "darwin"* ]]; then
    IP=$(ipconfig getifaddr en0 2>/dev/null || ipconfig getifaddr en1 2>/dev/null || echo "Not found")
elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
    IP=$(hostname -I | awk '{print $1}' 2>/dev/null || echo "Not found")
else
    IP="Not found"
fi

echo "📋 Setup Options:"
echo ""
echo "1. Same Network (Free) - Phone on same WiFi"
echo "   Your IP: $IP"
echo "   URL: http://$IP:3001"
echo ""
echo "2. Different Network - Use Ngrok (Free tunneling)"
echo "   Install: brew install ngrok"
echo "   Run: ngrok http 3001"
echo ""
echo "3. Use Render Deployment (Already deployed!)"
echo "   URL: https://weather-analytics-api-xsyq.onrender.com"
echo ""

echo "Starting servers..."
echo ""

# Start both servers
npm run dev

