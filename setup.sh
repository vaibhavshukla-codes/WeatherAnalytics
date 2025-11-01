#!/bin/bash

echo "🚀 Setting up Weather Analytics Dashboard..."

# Check if MongoDB is running (optional check)
if ! pgrep -x "mongod" > /dev/null && ! command -v mongod &> /dev/null; then
    echo "⚠️  MongoDB is not running. Please start MongoDB before running the application."
    echo "   On macOS: brew services start mongodb-community"
    echo "   On Linux: sudo systemctl start mongod"
    echo "   Or download from: https://www.mongodb.com/try/download/community"
    echo ""
fi

# Install root dependencies
echo "📦 Installing root dependencies..."
npm install

# Install server dependencies
echo "📦 Installing server dependencies..."
cd server
npm install
cd ..

# Install client dependencies
echo "📦 Installing client dependencies..."
cd client
npm install
cd ..

echo "✅ Setup complete!"
echo ""
echo "Next steps:"
echo "1. Configure your .env file in the server directory:"
echo "   cp server/.env.example server/.env"
echo "   Then edit server/.env with your API keys"
echo ""
echo "2. Make sure MongoDB is running"
echo ""
echo "3. Start the development servers:"
echo "   npm run dev"
echo ""

