export function textFile(name: string, content = 'Bill of Lading MSCU1234567 peso bruto 18.000 kg') {
	return { name, mimeType: 'text/plain', buffer: Buffer.from(content) }
}

export function pngFile(name: string) {
	const png = Buffer.from(
		'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=',
		'base64',
	)

	return { name, mimeType: 'image/png', buffer: png }
}

export function sizedFile(name: string, bytes: number) {
	return { name, mimeType: 'application/pdf', buffer: Buffer.alloc(bytes, 1) }
}
