#!/bin/sh
# Cloudflare Pages 建置：建置指令填「sh build.sh」，輸出目錄填「dist」。
# 網站放在 lumineerlab.com/animal-colors-disc/，所以測驗檔案複製到 dist/animal-colors-disc/。
# 只有這裡複製的檔案會上線；新增網站檔案時要加在這裡，也要加進 .gitignore 的白名單。
set -e
APP=animal-colors-disc

rm -rf dist
mkdir -p "dist/$APP"
cp -R *.html brand js "dist/$APP/"
rm -f "dist/$APP/brand/og-image.html"

# 資安標頭對整個網域都有效，放在最上層
cp _headers dist/
