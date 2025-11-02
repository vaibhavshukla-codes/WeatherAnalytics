#!/bin/bash

echo "╔════════════════════════════════════════════════════════════════╗"
echo "║                                                                ║"
echo "║        🔍 Network Access Diagnostic Tool                       ║"
echo "║                                                                ║"
echo "╚════════════════════════════════════════════════════════════════╝"
echo ""

# Get IP
if [[ "$OSTYPE" == "darwin"* ]]; then
    IP=$(ipconfig getifaddr en0 2>/dev/null || ipconfig getifaddr en1 2>/dev/null || echo "Not found")
elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
    IP=$(hostname -I | awk '{print $1}' 2>/dev/null || echo "Not found")
else
    IP="Not found"
fi

echo "📍 Your IP Address: $IP"
echo ""

# Check if ports are in use
echo "🔍 Checking Ports:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

PORT_3001=$(lsof -ti:3001 2>/dev/null)
PORT_5001=$(lsof -ti:5001 2>/dev/null)

if [ -z "$PORT_3001" ]; then
    echo "❌ Port 3001: NOT IN USE (Frontend not running)"
else
    echo "✅ Port 3001: IN USE"
    # Check what's listening
    LISTEN_3001=$(lsof -i:3001 | grep LISTEN)
    if [[ $LISTEN_3001 == *"0.0.0.0"* ]] || [[ $LISTEN_3001 == *"*"* ]]; then
        echo "   ✅ Binding to 0.0.0.0 (network accessible)"
    else
        echo "   ⚠️  Binding to localhost only (not network accessible)"
    fi
fi

if [ -z "$PORT_5001" ]; then
    echo "❌ Port 5001: NOT IN USE (Backend not running)"
else
    echo "✅ Port 5001: IN USE"
    LISTEN_5001=$(lsof -i:5001 | grep LISTEN)
    if [[ $LISTEN_5001 == *"0.0.0.0"* ]] || [[ $LISTEN_5001 == *"*"* ]]; then
        echo "   ✅ Binding to 0.0.0.0 (network accessible)"
    else
        echo "   ⚠️  Binding to localhost only (not network accessible)"
    fi
fi

echo ""
echo "🌐 Access URLs:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

if [ "$IP" != "Not found" ]; then
    echo "✅ Frontend: http://$IP:3001"
    echo "✅ Backend:  http://$IP:5001/api/health"
else
    echo "⚠️  Could not detect IP address"
fi

echo ""
echo "📋 Quick Checklist:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

if [ -z "$PORT_3001" ] || [ -z "$PORT_5001" ]; then
    echo "❌ Servers not running"
    echo "   → Run: npm run dev"
else
    echo "✅ Servers running"
fi

echo ""
echo "✅ On other device, use: http://$IP:3001"
echo "   (NOT localhost!)"
echo ""
