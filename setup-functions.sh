#!/bin/bash

# Setup script for Firebase Functions
echo "Setting up Firebase Functions..."

# Navigate to functions directory
cd functions

# Initialize npm if package.json doesn't exist
if [ ! -f "package.json" ]; then
    echo "Initializing npm..."
    npm init -y
fi

# Install dependencies
echo "Installing dependencies..."
npm install firebase-admin@^12.0.0 firebase-functions@^4.8.0 @sendgrid/mail@^8.1.0

# Install dev dependencies
echo "Installing dev dependencies..."
npm install --save-dev typescript@^4.9.0 @types/node@^18.0.0

# Create tsconfig.json if it doesn't exist
if [ ! -f "tsconfig.json" ]; then
    echo "Creating tsconfig.json..."
    cat > tsconfig.json << 'EOF'
{
  "compilerOptions": {
    "module": "commonjs",
    "noImplicitReturns": true,
    "noUnusedLocals": true,
    "outDir": "lib",
    "sourceMap": true,
    "strict": true,
    "target": "es2017"
  },
  "compileOnSave": true,
  "include": [
    "src"
  ]
}
EOF
fi

echo "Firebase Functions setup complete!"
echo "Run 'npm run build' in the functions directory to compile TypeScript"