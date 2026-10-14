import type { ComponentProps } from 'react'

import { Field, FieldError, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'

interface ITextFieldProps extends ComponentProps<typeof Input> {
	id: string
	label: string
	error?: string
}

export function TextField({ id, label, error, className, ...inputProps }: ITextFieldProps) {
	return (
		<Field data-invalid={Boolean(error)} className={className}>
			<FieldLabel htmlFor={id}>{label}</FieldLabel>
			<Input id={id} aria-invalid={Boolean(error)} {...inputProps} />
			<FieldError>{error}</FieldError>
		</Field>
	)
}
