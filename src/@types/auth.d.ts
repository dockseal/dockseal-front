export type TUserRole = 'OPERADOR' | 'GESTOR' | 'ADMIN'

export type TPermission =
	| 'shipment:read'
	| 'shipment:write'
	| 'document:upload'
	| 'analysis:run'
	| 'alert:read'
	| 'alert:manage'
	| 'history:read'

export interface ILoginInput {
	username: string
	password: string
}

export interface ILoginUser {
	id: string
	name: string
	role: TUserRole
}

export interface IToken {
	access_token: string
	token_type?: string
	refresh_token: string
}

export interface ILoginResponse extends IToken {
	user: ILoginUser
}

export interface IRefreshSessionInput {
	refresh_token: string
}

export interface IRole {
	name: TUserRole
}

export interface IUser {
	id: string
	name: string
	email: string
	status: string
	role: IRole
	permissions: TPermission[]
}
