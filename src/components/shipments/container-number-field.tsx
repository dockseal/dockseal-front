import type { ChangeEvent, ComponentProps } from 'react'

import { TextField } from '@/components/form/text-field'
import { CONTAINER_NUMBER_PLACEHOLDER } from '@/constants/shipment'
import { maskContainerNumber } from '@/utils/container'

type TContainerNumberFieldProps = Omit<ComponentProps<typeof TextField>, 'label' | 'placeholder'>

export function ContainerNumberField({ onChange, ...fieldProps }: TContainerNumberFieldProps) {
	function handleContainerNumberChange(event: ChangeEvent<HTMLInputElement>) {
		event.target.value = maskContainerNumber(event.target.value)

		onChange?.(event)
	}

	return (
		<TextField
			label="Número do contêiner"
			placeholder={CONTAINER_NUMBER_PLACEHOLDER}
			autoCapitalize="characters"
			autoComplete="off"
			spellCheck={false}
			{...fieldProps}
			onChange={handleContainerNumberChange}
		/>
	)
}
