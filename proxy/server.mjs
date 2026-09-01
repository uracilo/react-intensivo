import { createServer } from 'node:http'

const API = 'http://52.87.135.237:8080'
const PORT = process.env.PORT || 3000

const server = createServer(async (req, res) => {
  const origin = req.headers.origin ?? '*'
  res.setHeader('Access-Control-Allow-Origin', origin)
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')

  if (req.method === 'OPTIONS') {
    res.writeHead(204)
    res.end()
    return
  }

  const url = `${API}${req.url}`
  const headers = { ...req.headers, host: new URL(API).host }

  try {
    const body =
      req.method === 'GET' || req.method === 'HEAD'
        ? undefined
        : await new Promise((resolve, reject) => {
            const chunks = []
            req.on('data', (c) => chunks.push(c))
            req.on('end', () => resolve(Buffer.concat(chunks)))
            req.on('error', reject)
          })

    const upstream = await fetch(url, { method: req.method, headers, body })
    res.writeHead(upstream.status, Object.fromEntries(upstream.headers))
    const text = await upstream.text()
    res.end(text)
  } catch (err) {
    res.writeHead(502, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify({ error: String(err) }))
  }
})

server.listen(PORT, () => console.log(`TaskFlow proxy on :${PORT} → ${API}`))
