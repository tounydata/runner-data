#!/usr/bin/env bash
set -e
echo "📦 Installation des dépendances..."
rm -rf node_modules package-lock.json
npm install
echo ""
echo "🚀 Démarrage d'Expo en mode tunnel..."
echo "   → Ouvre Expo Go sur ton iPhone et scanne le QR code"
echo ""
npx expo start --tunnel
