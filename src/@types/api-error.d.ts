export interface IValidationErrorItem {
	loc: (string | number)[]
	msg: string
	type: string
	input?: unknown
}

export interface IApiErrorBody {
	detail: string | IValidationErrorItem[]
}
