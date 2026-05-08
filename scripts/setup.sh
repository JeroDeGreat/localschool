#!/bin/bash

set -e

echo "🎓 School Hub - Setup Script"
echo "================================"
echo ""

# Check for Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 16 or higher."
    exit 1
fi

echo "✓ Node.js $(node -v)"
echo ""

# Install dependencies
echo "📦 Installing dependencies..."
npm install
echo "✓ Dependencies installed"
echo ""

# Create .env.local if it doesn't exist
if [ ! -f .env.local ]; then
    echo "🔧 Creating .env.local..."
    cp .env.example .env.local
    echo "⚠️  Please update .env.local with your Supabase credentials"
    echo ""
fi

# Check if Supabase credentials are set
if grep -q "<ANON_KEY>" .env.local; then
    echo "⚠️  Please update .env.local with your Supabase credentials"
    echo "   1. Go to https://app.supabase.com"
    echo "   2. Create or select a project"
    echo "   3. Copy Project URL and Anon Key from Project Settings → API"
    echo "   4. Update .env.local"
    echo ""
    read -p "Press Enter once you've updated .env.local..."
fi

echo ""
echo "✨ Setup complete!"
echo ""
echo "🚀 Starting development server..."
echo "   Opening http://localhost:3000"
echo ""
echo "Press Ctrl+C to stop the server"
echo ""

npm run dev
