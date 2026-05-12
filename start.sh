#!/usr/bin/env bash
set -e
echo "📦 Installation des dépendances..."
npx expo install
echo ""
echo "🚀 Démarrage d'Expo en mode tunnel..."
echo "   → Ouvre Expo Go sur ton iPhone et scanne le QR code"
echo ""
npx expo start --tunnel
