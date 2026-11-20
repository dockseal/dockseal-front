import { z } from 'zod'

import { isValidContainerNumber } from '@/utils/container'

export const CONTAINER_NUMBER_MESSAGE = 'Use o padrão ISO 6346: 4 letras e 7 números.'

export const optionalContainerNumberSchema = z
	.string()
	.trim()
	.refine((value) => value === '' || isValidContainerNumber(value), CONTAINER_NUMBER_MESSAGE)

export const requiredContainerNumberSchema = z
	.string()
	.trim()
	.min(1, 'Informe o número do contêiner.')
	.refine(isValidContainerNumber, CONTAINER_NUMBER_MESSAGE)
