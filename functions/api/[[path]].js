export async function onRequest({ request, params }) {
  const path = Array.isArray(params.path) ? params.path.join('/') : (params.path ?? '')
  const search = new URL(request.url).search
  const upstream = new Request(`https://dockseal-api.onrender.com/${path}${search}`, request)
  upstream.headers.delete('origin')
  return fetch(upstream)
}
