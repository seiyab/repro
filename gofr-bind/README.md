# GoFr Request.Bind playground

A tiny HTTP server using GoFr **v1.62.0**'s `http.Request.Bind()` directly.
The standard library hosts the server; no database or other service is needed.
`POST /bind` returns the bound struct and, on failure, the Bind error (HTTP 400).
Successful binds return HTTP 200.

```sh
cd gofr-bind
go run .
```

In another terminal:

```sh
# JSON -> {"value":{"name":"Ada","age":37}}
curl -i localhost:8000/bind -H 'Content-Type: application/json' \
  -d '{"name":"Ada","age":37}'

# URL-encoded form (curl sets the content type automatically)
curl -i localhost:8000/bind -d 'name=Ada&age=37'

# Multipart form
curl -i localhost:8000/bind -F 'name=Ada' -F 'age=37'

# Invalid JSON field type -> 400, possibly with a partially populated struct
curl -i localhost:8000/bind -H 'Content-Type: application/json' \
  -d '{"name":"Ada","age":"oops"}'

# Unsupported content type -> 200 with zero values and no error
curl -i localhost:8000/bind -H 'Content-Type: text/plain' \
  -d '{"name":"Ada","age":37}'

# Missing content type -> also zero values and no error
curl -i localhost:8000/bind -H 'Content-Type:' \
  -d '{"name":"Ada","age":37}'

# JSON does not bind query parameters -> zero values
curl -i 'localhost:8000/bind?name=Ada&age=37' \
  -H 'Content-Type: application/json' -d '{}'
```

JSON uses `json` tags; forms use `form` tags. JSON unknown fields are ignored,
and Bind does not enforce required fields. URL-encoded binding uses Go's
`ParseForm`, so it also sees URL query parameters (body values take precedence).
The app passes a pointer, as required by Bind. Binary content types expect a
pointer to a byte slice and will fail with this struct target.

Source: [GoFr Request.Bind implementation](https://github.com/gofr-dev/gofr/blob/v1.62.0/pkg/gofr/http/request.go).
