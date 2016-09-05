# CORS-proxy
A modified version of https://github.com/gr2m/CORS-Proxy that enables proxying to `https` URLs.

CORS-Proxy proxies HTTP(S) requests and adds CORS permissive headers to the response.

## Usage

### Format:

`protocol://cors-container/url-to-proxy`

### Examples:

Insecure: `http://corsproxy.our.buildo.io/http://jsonplaceholder.typicode.com/posts`

Secure (TLS): `https://corsproxy.our.buildo.io/https://jsonplaceholder.typicode.com/posts`
