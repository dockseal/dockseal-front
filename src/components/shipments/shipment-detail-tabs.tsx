import { useNavigate } from '@tanstack/react-router'

import type { IShipmentDetail, TShipmentDetailTab } from '@/@types/shipment'
import { ShipmentContainers } from '@/components/shipments/shipment-containers'
import { ShipmentDocuments } from '@/components/shipments/shipment-documents'
import { ShipmentHistory } from '@/components/shipments/shipment-history'
import { ShipmentSummary } from '@/components/shipments/shipment-summary'
import { ShipmentValidationPanel } from '@/components/shipments/shipment-validation-panel'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { SHIPMENT_DETAIL_TAB_LABEL } from '@/constants/shipment'

interface IShipmentDetailTabsProps {
	shipment: IShipmentDetail
	tab: TShipmentDetailTab
	tabs: TShipmentDetailTab[]
}

export function ShipmentDetailTabs({ shipment, tab, tabs }: IShipmentDetailTabsProps) {
	const navigate = useNavigate()

	function handleTabChange(value: string) {
		const nextTab = value as TShipmentDetailTab

		navigate({
			to: '/shipments/$shipmentId',
			params: { shipmentId: shipment.id },
			search: { tab: nextTab === 'summary' ? undefined : nextTab },
		})
	}

	return (
		<Tabs value={tab} onValueChange={handleTabChange}>
			<TabsList className="w-full justify-start overflow-x-auto sm:w-fit">
				{tabs.map((item) => (
					<TabsTrigger key={item} value={item}>
						{SHIPMENT_DETAIL_TAB_LABEL[item]}
					</TabsTrigger>
				))}
			</TabsList>
			<TabsContent value="summary">
				<ShipmentSummary shipment={shipment} />
			</TabsContent>
			<TabsContent value="containers">
				<ShipmentContainers shipment={shipment} />
			</TabsContent>
			<TabsContent value="documents">
				<ShipmentDocuments shipment={shipment} />
			</TabsContent>
			<TabsContent value="validation">
				<ShipmentValidationPanel shipmentId={shipment.id} />
			</TabsContent>
			{tabs.includes('history') && (
				<TabsContent value="history">
					<ShipmentHistory shipmentId={shipment.id} />
				</TabsContent>
			)}
		</Tabs>
	)
}
