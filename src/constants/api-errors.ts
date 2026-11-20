export const HTTP_ERROR_MESSAGE = {
	NETWORK: 'Não foi possível conectar à API. Verifique se ela está em execução e tente novamente.',
	TIMEOUT: 'A operação demorou mais que o esperado. Tente novamente.',
	401: 'Sua sessão expirou. Entre novamente.',
	403: 'Você não tem permissão para esta ação.',
	404: 'Registro não encontrado.',
	413: 'Arquivo excede o limite de 20 MB.',
	415: 'Formato de arquivo não suportado.',
	422: 'Verifique os dados informados.',
	502: 'Não foi possível analisar agora. Tente novamente em instantes.',
	DEFAULT: 'Ocorreu um erro inesperado. Tente novamente.',
} as const

export const API_DETAIL_STATUSES = [401, 403, 404, 413, 415, 422] as const

export const FIELD_ERROR_MESSAGE = 'Valor inválido'
