# go-zero upload limit reproduction

Dependency pinned to go-zero **v1.10.3** in `go.mod`.

Run from this directory:

```sh
go run .
```

`POST /upload` accepts a multipart field named `file`, consumes it without saving
it, and returns the filename, file size, and request Content-Length as JSON.
The server's `MaxBytes` is **1024 bytes (1 KiB)** in `etc/upload.yaml`.
This is the entire request body limit, including multipart overhead; a 1024-byte
file therefore exceeds it.

```sh
printf 'hello\n' > /tmp/zero-max-small.txt
curl -i -F 'file=@/tmp/zero-max-small.txt' http://127.0.0.1:8888/upload
head -c 2048 /dev/zero > /tmp/zero-max-large.bin
curl -i -F 'file=@/tmp/zero-max-large.bin' http://127.0.0.1:8888/upload
```

Run the behavior checks against the running server:

```sh
python3 verify.py
```

The checks expect HTTP 200 for a small upload, HTTP 413 for an oversized
request with Content-Length, and HTTP 200 for an oversized chunked upload.
go-zero's MaxBytes middleware checks Content-Length rather than wrapping the
body in a limited reader. Chunked requests report an unknown length (-1) and
can pass that check. This example deliberately leaves that behavior observable.
`ParseMultipartForm(1024)` controls buffering and temporary file usage; it does
not enforce an upload size limit. Temporary multipart files are cleaned up.

Upstream middleware: https://github.com/zeromicro/go-zero/blob/master/rest/handler/maxbyteshandler.go
