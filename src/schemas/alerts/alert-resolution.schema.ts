import { z } from 'zod'

import { ALERT_RESOLUTION_NOTE_MAX_LENGTH } from '@/constants/alert'

export const alertResolutionSchema = z.object({
	resolutionNote: z
		.string()
		.max(ALERT_RESOLUTION_NOTE_MAX_LENGTH, `Máximo de ${ALERT_RESOLUTION_NOTE_MAX_LENGTH} caracteres.`),
})

export type TAlertResolutionValues = z.infer<typeof alertResolutionSchema>
