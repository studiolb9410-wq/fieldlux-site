#!/usr/bin/env python3
"""Local preview server that behaves like the Vercel deployment.

vercel.json sets cleanUrls:true and trailingSlash:false, so every internal link
on this site is written /videos and /pricing, never /videos.html. Python's stock
http.server does not do that, so a plain `python3 -m http.server` answers 404 to
every nav link on the site and the local preview disagrees with production on
the one thing a preview exists to check.

Three behaviours, matching vercel.json:
  cleanUrls      /videos          -> videos.html
  trailingSlash  /videos/         -> redirect to /videos
  404 page       anything missing -> 404.html, with a real 404 status

Nothing else is emulated. The security headers and the cache-control rules in
vercel.json are production concerns and are deliberately not reproduced here.
"""

import os
import sys
from http.server import HTTPServer, SimpleHTTPRequestHandler

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PORT = int(sys.argv[1]) if len(sys.argv) > 1 else 4173


class PreviewHandler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=ROOT, **kwargs)

    def send_head(self):
        raw = self.path
        path = raw.split("?", 1)[0].split("#", 1)[0]
        query = raw[len(path):]
        bare = path.rstrip("/") or "/"
        local = os.path.join(ROOT, bare.lstrip("/"))

        # A DIRECTORY IS SERVED FROM ITS OWN index.html, WITH NO REDIRECT EITHER
        # WAY. This is the /embed case and it is why this branch comes first.
        # SimpleHTTPRequestHandler answers a slashless directory with a 301 that
        # ADDS the slash; the trailingSlash rule below REMOVES it. Run both and
        # /embed/ and /embed bounce off each other until the browser gives up
        # with ERR_TOO_MANY_REDIRECTS, which is exactly what happened to the hero
        # embed the first time this file shipped. Serving the index in place ends
        # the argument, and relative asset paths inside embed/ still resolve
        # because the URL the browser holds is unchanged.
        if os.path.isdir(local) and os.path.isfile(os.path.join(local, "index.html")):
            self.path = (bare.rstrip("/") + "/index.html") + query
            return super().send_head()

        # trailingSlash:false, for everything that is not a directory.
        if len(path) > 1 and path.endswith("/"):
            self.send_response(308)
            self.send_header("Location", bare + query)
            self.end_headers()
            return None

        # cleanUrls. Only rewrite when the bare path is not already a real file,
        # so /assets/logo-ink.png is never touched.
        if bare != "/" and not os.path.isfile(local) and os.path.isfile(local + ".html"):
            self.path = bare + ".html" + query
            return super().send_head()

        if bare == "/" or os.path.isfile(local) or os.path.isdir(local):
            return super().send_head()

        return self.send_404()

    def send_404(self):
        page = os.path.join(ROOT, "404.html")
        if not os.path.isfile(page):
            self.send_error(404)
            return None
        body = open(page, "rb").read()
        self.send_response(404)
        self.send_header("Content-Type", "text/html; charset=utf-8")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        return __import__("io").BytesIO(body)

    def log_message(self, fmt, *args):
        # One line per request, without the date noise, so a failing nav link is
        # visible at a glance in the preview log.
        sys.stderr.write("%s %s\n" % (self.address_string(), fmt % args))


if __name__ == "__main__":
    print(f"preview: http://localhost:{PORT} (cleanUrls, 404.html, serving {ROOT})")
    HTTPServer(("127.0.0.1", PORT), PreviewHandler).serve_forever()
