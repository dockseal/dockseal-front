const SENTRY_HOST = 'o4512273352818688.ingest.us.sentry.io'
const PROJECT_IDS = ['4512282681868288']

export async function onRequestPost({ request }) {
	try {
		const envelope = await request.text()
		const header = JSON.parse(envelope.split('\n')[0])
		const dsn = new URL(header.dsn)
		const projectId = dsn.pathname.replace(/^\//, '')

		if (dsn.hostname !== SENTRY_HOST || !PROJECT_IDS.includes(projectId)) {
			return new Response('DSN nao permitido', { status: 400 })
		}

		const upstream = await fetch(`https://${SENTRY_HOST}/api/${projectId}/envelope/`, {
			method: 'POST',
			body: envelope,
			headers: { 'Content-Type': 'application/x-sentry-envelope' },
		})

		return new Response(null, { status: upstream.status })
	} catch {
		return new Response('Envelope invalido', { status: 400 })
	}
}
