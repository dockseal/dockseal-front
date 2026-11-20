export type TUserRole = 'OPERADOR' | 'GESTOR' | 'ADMIN'

export type TUserStatus = 'ACTIVE' | 'INACTIVE'

export type TPermission =
	| 'shipment:read'
	| 'shipment:write'
	| 'document:upload'
	| 'analysis:run'
	| 'alert:read'
	| 'alert:manage'
	| 'history:read'
	| 'user:manage'

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
	status: TUserStatus
	role: IRole
	permissions: TPermission[]
}

export interface IGetUsersFilters {
	limit: number
	offset: number
}

export interface ICreateUserInput {
	name: string
	email: string
	password: string
	role: TUserRole
}

export interface IUpdateUserInput {
	name?: string
	email?: string
	role?: TUserRole
	status?: TUserStatus
	password?: string
}
