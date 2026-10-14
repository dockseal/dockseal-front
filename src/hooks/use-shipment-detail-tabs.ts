import type { TShipmentDetailTab } from '@/@types/shipment'
import { SHIPMENT_DETAIL_TAB_PERMISSION, SHIPMENT_DETAIL_TABS } from '@/constants/shipment'
import { useMe } from '@/queries/auth'
import { hasPermission } from '@/utils/permission'

export function useShipmentDetailTabs(requestedTab: TShipmentDetailTab | undefined) {
	const { data: me } = useMe()

	const tabs = SHIPMENT_DETAIL_TABS.filter((tab) => {
		const permission = SHIPMENT_DETAIL_TAB_PERMISSION[tab]

		return !permission || hasPermission(me, permission)
	})
	const activeTab = requestedTab && tabs.includes(requestedTab) ? requestedTab : 'resumo'

	return { tabs, activeTab }
}
