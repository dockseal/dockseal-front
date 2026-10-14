import { History, LayoutDashboard, type LucideIcon, ScanSearch, Settings, Ship, TriangleAlert } from 'lucide-react'

import type { TPermission } from '@/@types/auth'

export interface INavItem {
	label: string
	to: '/dashboard' | '/embarques' | '/analise' | '/alertas' | '/auditoria' | '/configuracoes'
	permission: TPermission | null
	icon: LucideIcon
}

export const APP_NAV_ITEMS: INavItem[] = [
	{ label: 'Dashboard', to: '/dashboard', permission: 'shipment:read', icon: LayoutDashboard },
	{ label: 'Embarques', to: '/embarques', permission: 'shipment:read', icon: Ship },
	{ label: 'Análise rápida', to: '/analise', permission: 'analysis:run', icon: ScanSearch },
	{ label: 'Alertas', to: '/alertas', permission: 'alert:read', icon: TriangleAlert },
	{ label: 'Auditoria', to: '/auditoria', permission: 'history:read', icon: History },
	{ label: 'Configurações', to: '/configuracoes', permission: null, icon: Settings },
]
