#!/bin/bash
# Sobe o clone estatico em http://localhost:8080
cd "$(dirname "$0")"
echo "Servindo em http://localhost:8080"
python3 -m http.server 8080
