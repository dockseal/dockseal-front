import { zodResolver } from '@hookform/resolvers/zod'
import { LoaderPinwheelIcon } from 'lucide-react'
import { useForm } from 'react-hook-form'

import { TextField } from '@/components/form/text-field'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useAddShipmentContainer } from '@/mutations/shipments/add-shipment-container'
import { useSetShipmentContainer } from '@/mutations/shipments/set-shipment-container'
import { containerFormSchema, type TContainerFormValues } from '@/schemas/shipments/container-form.schema'
import { toContainerInput } from '@/utils/shipment'

interface IContainerFormProps {
	shipmentId: string
	hasPrimary: boolean
}

const MODE_OPTIONS = [
	{ value: 'primary', label: 'Definir como principal' },
	{ value: 'additional', label: 'Adicionar contêiner' },
] as const

export function ContainerForm({ shipmentId, hasPrimary }: IContainerFormProps) {
	const {
		register,
		handleSubmit,
		reset,
		formState: { errors },
	} = useForm<TContainerFormValues>({
		resolver: zodResolver(containerFormSchema),
		defaultValues: { containerNumber: '', isoCode: '', type: '', owner: '', mode: 'primary' },
	})

	const { mutateAsync: setShipmentContainerFn, isPending: isSettingContainer } = useSetShipmentContainer({
		onSuccess: () => reset(),
	})
	const { mutateAsync: addShipmentContainerFn, isPending: isAddingContainer } = useAddShipmentContainer({
		onSuccess: () => reset(),
	})
	const isSaving = isSettingContainer || isAddingContainer
	const modeOptions = hasPrimary ? MODE_OPTIONS : MODE_OPTIONS.slice(0, 1)

	async function handleContainerSubmit(data: TContainerFormValues) {
		const variables = { shipmentId, container: toContainerInput(data) }
		const save = hasPrimary && data.mode === 'additional' ? addShipmentContainerFn : setShipmentContainerFn

		await save(variables).catch(() => undefined)
	}

	return (
		<Card>
			<CardHeader>
				<CardTitle>Associar contêiner</CardTitle>
				<CardDescription>Padrão ISO 6346: 4 letras e 7 números, por exemplo MSCU 123456-7.</CardDescription>
			</CardHeader>
			<CardContent>
				<form noValidate onSubmit={handleSubmit(handleContainerSubmit)} className="flex flex-col gap-4">
					<fieldset className="flex flex-wrap gap-4">
						<legend className="sr-only">Forma de associação</legend>
						{modeOptions.map((option) => (
							<label key={option.value} className="flex items-center gap-2 text-sm">
								<input type="radio" value={option.value} className="accent-primary" {...register('mode')} />
								{option.label}
							</label>
						))}
					</fieldset>
					<div className="grid gap-4 sm:grid-cols-2">
						<TextField
							id="container-number"
							label="Número do contêiner"
							placeholder="MSCU 123456-7"
							error={errors.containerNumber?.message}
							{...register('containerNumber')}
						/>
						<TextField
							id="container-iso-code"
							label="Código ISO"
							placeholder="22G1"
							error={errors.isoCode?.message}
							{...register('isoCode')}
						/>
						<TextField id="container-type" label="Tipo" error={errors.type?.message} {...register('type')} />
						<TextField id="container-owner" label="Proprietário" error={errors.owner?.message} {...register('owner')} />
					</div>
					<div className="flex justify-end">
						<Button type="submit" disabled={isSaving}>
							{isSaving && <LoaderPinwheelIcon className="size-4 animate-spin" />}
							Associar contêiner
						</Button>
					</div>
				</form>
			</CardContent>
		</Card>
	)
}
