/**
 * Cloudflare Worker — proxy HTTPS → TaskFlow API (HTTP)
 */
const API_ORIGIN = 'https://d3ujwk09smrk9z.cloudfront.net'

export default {
  async fetch(request) {
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        headers: corsHeaders(request.headers.get('Origin') ?? '*'),
      })
    }

    const incoming = new URL(request.url)
    const target = `${API_ORIGIN}${incoming.pathname}${incoming.search}`

    const headers = new Headers(request.headers)
    headers.delete('host')

    const response = await fetch(target, {
      method: request.method,
      headers,
      body: request.method === 'GET' || request.method === 'HEAD' ? undefined : request.body,
    })

    const out = new Headers(response.headers)
    const origin = request.headers.get('Origin') ?? '*'
    for (const [k, v] of Object.entries(corsHeaders(origin))) {
      out.set(k, v)
    }

    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: out,
    })
  },
}

function corsHeaders(origin) {
  return {
    'Access-Control-Allow-Origin': origin,
    'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Max-Age': '86400',
  }
}
