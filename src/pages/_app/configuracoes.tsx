import { createFileRoute } from '@tanstack/react-router'

import { ErrorState } from '@/components/feedback/error-state'
import { LoadingState } from '@/components/feedback/loading-state'
import { PageHeader } from '@/components/page-header'
import { ProfileCard } from '@/components/settings/profile-card'
import { useMe } from '@/queries/auth'
import { getApiErrorMessage } from '@/utils/api-error'

export const Route = createFileRoute('/_app/configuracoes')({
	head: () => ({ meta: [{ title: 'Configurações | Dockseal' }] }),
	component: SettingsPage,
})

function SettingsPage() {
	const { data: me, isLoading: isLoadingMe, error: meError, refetch: refetchMe } = useMe()

	return (
		<>
			<PageHeader title="Configurações" description="Preferências e dados da sua conta." />
			{isLoadingMe && <LoadingState />}
			{meError && <ErrorState message={getApiErrorMessage(meError)} onRetry={() => refetchMe()} />}
			{me && <ProfileCard user={me} />}
		</>
	)
}
