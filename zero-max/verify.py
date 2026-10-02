#!/usr/bin/env python3
"""Exercise the running API with known-length and chunked multipart uploads."""
import http.client
import json

BOUNDARY = "zero-max-boundary"


def body(size):
    return (
        f'--{BOUNDARY}\r\n'
        'Content-Disposition: form-data; name="file"; filename="sample.bin"\r\n'
        'Content-Type: application/octet-stream\r\n\r\n'
    ).encode() + b'x' * size + f'\r\n--{BOUNDARY}--\r\n'.encode()


for size, chunked, expected in [(100, False, 200), (1024, False, 413), (2048, True, 200)]:
    payload = body(size)
    conn = http.client.HTTPConnection('127.0.0.1', 8888, timeout=10)
    headers = {'Content-Type': f'multipart/form-data; boundary={BOUNDARY}'}
    data = iter([payload]) if chunked else payload
    conn.request('POST', '/upload', body=data, headers=headers, encode_chunked=chunked)
    response = conn.getresponse()
    result = response.read().decode()
    print(f'file={size} body={len(payload)} chunked={chunked}: HTTP {response.status} {result}')
    assert response.status == expected, f'expected {expected}, got {response.status}'
    if expected == 200:
        assert json.loads(result)['bytes'] == size
    conn.close()
