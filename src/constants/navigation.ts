import {
	History,
	LayoutDashboard,
	type LucideIcon,
	Plus,
	ScanSearch,
	Settings,
	Ship,
	TriangleAlert,
	Users,
} from 'lucide-react'

import type { TPermission } from '@/@types/auth'

export interface INavItem {
	label: string
	to: '/dashboard' | '/shipments' | '/shipments/new' | '/analysis' | '/alerts' | '/audit' | '/users' | '/settings'
	permission: TPermission | null
	icon: LucideIcon
}

export const APP_NAV_ITEMS: INavItem[] = [
	{ label: 'Dashboard', to: '/dashboard', permission: 'shipment:read', icon: LayoutDashboard },
	{ label: 'Embarques', to: '/shipments', permission: 'shipment:read', icon: Ship },
	{ label: 'Novo embarque', to: '/shipments/new', permission: 'shipment:write', icon: Plus },
	{ label: 'Análise rápida', to: '/analysis', permission: 'analysis:run', icon: ScanSearch },
	{ label: 'Alertas', to: '/alerts', permission: 'alert:read', icon: TriangleAlert },
	{ label: 'Auditoria', to: '/audit', permission: 'history:read', icon: History },
	{ label: 'Usuários', to: '/users', permission: 'user:manage', icon: Users },
	{ label: 'Configurações', to: '/settings', permission: null, icon: Settings },
]
