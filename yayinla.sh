#!/usr/bin/env bash
# Siteyi hommdunyasi.github.io adresinde yayınlar.  Kullanım: bash yayinla.sh "degisiklik notu"
set -e
cd "$(dirname "$0")"
ADRES=hommdunyasi INDEX=1 node build.mjs
find _yayin -mindepth 1 -maxdepth 1 ! -name .git -exec rm -rf {} +
cp -r docs-yeni/. _yayin/
cd _yayin
git add -A
git -c user.name="Arslan Ekip" -c user.email="noreply@users.noreply.github.com" commit -q -m "${1:-Site guncellemesi}" || echo "degisiklik yok"
git push -q
echo "yayinlandi: https://hommdunyasi.github.io/"
