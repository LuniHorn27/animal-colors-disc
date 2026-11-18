#!/usr/bin/env python3
"""本機預覽伺服器：服務 dist/，並對每個回應加上 _headers 中「/*」區塊的資安標頭。

用途：在本機驗證首頁不會違反 Cloudflare Pages 上線後的內容安全政策（CSP）。
用法：先執行 `sh build.sh`，再執行 `python3 tests/home-serve.py [port]`（預設 8787）。
"""
import http.server
import os
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DIST = os.path.join(ROOT, "dist")


def read_headers(path):
    """解析 _headers 第一個區塊（以 /* 開頭），每行「名稱: 值」。略過註解與空行。"""
    headers, in_block = [], False
    with open(path, encoding="utf-8") as f:
        for raw in f:
            line = raw.rstrip("\n")
            if not in_block:
                if line.strip() == "/*":
                    in_block = True
                continue
            if not line.strip():
                if headers:
                    break
                continue
            if not line.startswith((" ", "\t")):
                break
            name, _, value = line.strip().partition(":")
            if name and value:
                headers.append((name.strip(), value.strip()))
    return headers


HEADERS = read_headers(os.path.join(ROOT, "_headers"))


class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIST, **kwargs)

    def end_headers(self):
        for name, value in HEADERS:
            self.send_header(name, value)
        super().end_headers()


if __name__ == "__main__":
    port = int(sys.argv[1]) if len(sys.argv) > 1 else 8787
    if not os.path.isdir(DIST):
        sys.exit("找不到 dist/，請先執行 sh build.sh")
    print(f"服務 {DIST}，已套用 {len(HEADERS)} 個資安標頭，網址 http://localhost:{port}/")
    http.server.ThreadingHTTPServer(("127.0.0.1", port), Handler).serve_forever()
