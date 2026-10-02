run server:

```sh
cd gofr-bind
go run .
```

---

send request with 64MiB JSON:


```sh
python3 - <<'PY' | curl --http1.1 -sS \
  -H 'Content-Type: application/json' \
  -H 'Transfer-Encoding: chunked' \
  --data-binary @- \
  -o /dev/null -w 'HTTP %{http_code}\n' \
  http://localhost:8000/bind
import sys
sys.stdout.write('{"name":"')
for _ in range(64):
    sys.stdout.write('a' * (1024 * 1024))
sys.stdout.write('","age":37}')
PY
```
