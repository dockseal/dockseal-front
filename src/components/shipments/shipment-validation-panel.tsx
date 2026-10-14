import { ScanSearch, Sparkles } from 'lucide-react'

import { AnalysisPending } from '@/components/analysis/analysis-pending'
import { AnalysisResultView } from '@/components/analysis/analysis-result-view'
import { EmptyState } from '@/components/feedback/empty-state'
import { ErrorState } from '@/components/feedback/error-state'
import { LoadingState } from '@/components/feedback/loading-state'
import { ValidationHistory } from '@/components/shipments/validation-history'
import { Button } from '@/components/ui/button'
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { EPermission } from '@/constants/auth'
import { usePermission } from '@/hooks/use-permission'
import { useValidateShipment } from '@/mutations/shipments/validate-shipment'
import { useShipmentValidations } from '@/queries/shipment-validations'
import { getApiErrorMessage } from '@/utils/api-error'
import { formatDateTime } from '@/utils/date'

interface IShipmentValidationPanelProps {
	shipmentId: string
}

export function ShipmentValidationPanel({ shipmentId }: IShipmentValidationPanelProps) {
	const canRun = usePermission(EPermission.ANALYSIS_RUN)
	const {
		data: validations,
		isLoading: isLoadingValidations,
		error: validationsError,
		refetch: refetchValidations,
	} = useShipmentValidations(shipmentId)
	const { mutateAsync: validateShipmentFn, isPending: isValidating } = useValidateShipment()

	const [latest, ...previous] = validations ?? []

	async function handleValidate() {
		await validateShipmentFn(shipmentId).catch(() => undefined)
	}

	return (
		<Card>
			<CardHeader>
				<CardTitle>Validação com IA</CardTitle>
				<CardDescription>Confere os documentos do embarque e aponta divergências.</CardDescription>
				{canRun && (
					<CardAction>
						<Button type="button" onClick={handleValidate} disabled={isValidating}>
							<Sparkles />
							Validar com IA
						</Button>
					</CardAction>
				)}
			</CardHeader>
			<CardContent className="flex flex-col gap-6">
				{isValidating && <AnalysisPending />}
				{isLoadingValidations && <LoadingState />}
				{validationsError && (
					<ErrorState message={getApiErrorMessage(validationsError)} onRetry={() => refetchValidations()} />
				)}
				{validations && !latest && <EmptyState icon={ScanSearch} title="Nenhuma validação realizada." />}
				{latest && (
					<div className="flex flex-col gap-2">
						<span className="text-xs text-muted-foreground">
							Última validação em {formatDateTime(latest.created_at)}
						</span>
						<AnalysisResultView result={latest.result} />
					</div>
				)}
				{previous.length > 0 && <ValidationHistory validations={previous} />}
			</CardContent>
		</Card>
	)
}
