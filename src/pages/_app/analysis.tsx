import { createFileRoute } from '@tanstack/react-router'

import { AnalysisForm } from '@/components/analysis/analysis-form'
import { PageHeader } from '@/components/page-header'
import { EPermission } from '@/constants/auth'
import { requireRoutePermission } from '@/utils/permission'

export const Route = createFileRoute('/_app/analysis')({
	beforeLoad: ({ context }) => requireRoutePermission(context.queryClient, EPermission.ANALYSIS_RUN),
	head: () => ({ meta: [{ title: 'Análise rápida | Dockseal' }] }),
	component: AnalysisPage,
})

function AnalysisPage() {
	return (
		<>
			<PageHeader
				title="Análise rápida"
				description="Envie de 1 a 10 documentos para a IA conferir divergências. Os arquivos não são armazenados."
			/>
			<AnalysisForm />
		</>
	)
}
