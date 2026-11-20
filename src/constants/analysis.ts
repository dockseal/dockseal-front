import type { TAnalysisStatus } from '@/@types/analysis'
import type { TTone } from '@/@types/ui'

export const EAnalysisStatus = {
	CONFORME: 'CONFORME',
	DIVERGENTE: 'DIVERGENTE',
	INCONCLUSIVO: 'INCONCLUSIVO',
} as const satisfies Record<string, TAnalysisStatus>

export const ANALYSIS_STATUS_LABEL: Record<TAnalysisStatus, string> = {
	CONFORME: 'Conforme',
	DIVERGENTE: 'Divergente',
	INCONCLUSIVO: 'Inconclusivo',
}

export const ANALYSIS_STATUS_TONE: Record<TAnalysisStatus, TTone> = {
	CONFORME: 'success',
	DIVERGENTE: 'danger',
	INCONCLUSIVO: 'warning',
}
