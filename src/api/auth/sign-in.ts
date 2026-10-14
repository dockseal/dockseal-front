import { api } from '@/lib/axios'

export interface ISignInBody {
	email: string
	password: string
}

export interface ISignInResponse {
	token: string
}

export async function signIn(body: ISignInBody) {
	const response = await api.post('/auth/sign-in', body)

	return response.data
}
