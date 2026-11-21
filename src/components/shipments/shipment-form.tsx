import { zodResolver } from '@hookform/resolvers/zod'
import { Link, useNavigate } from '@tanstack/react-router'
import { LoaderPinwheelIcon } from 'lucide-react'
import type { FormEvent } from 'react'
import { useForm } from 'react-hook-form'

import { TextField } from '@/components/form/text-field'
import { ContainerIsoCodeField } from '@/components/shipments/container-iso-code-field'
import { ContainerNumberField } from '@/components/shipments/container-number-field'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { INVALID_DATE_MESSAGE, SHIPMENT_DATE_FIELDS, SHIPMENT_FORM_FIELD_BY_API_FIELD } from '@/constants/shipment'
import { useCreateShipment } from '@/mutations/shipments/create-shipment'
import { shipmentFormSchema, type TShipmentFormValues } from '@/schemas/shipments/shipment-form.schema'
import { getApiFieldErrors } from '@/utils/api-error'
import { hasUnreadableDateInput, shipmentDateInputBounds } from '@/utils/date'
import { toCreateShipmentInput } from '@/utils/shipment'

const DEFAULT_VALUES: TShipmentFormValues = {
	shipmentIdCustom: '',
	origin: '',
	destination: '',
	transportCompany: '',
	dispatchedAt: '',
	expectedArrival: '',
	expectedReturn: '',
	containerNumber: '',
	containerType: '',
	containerOwner: '',
}

export function ShipmentForm() {
	const navigate = useNavigate()

	const {
		register,
		handleSubmit,
		setError,
		setFocus,
		formState: { errors },
	} = useForm<TShipmentFormValues>({
		resolver: zodResolver(shipmentFormSchema),
		defaultValues: DEFAULT_VALUES,
	})

	const { mutateAsync: createShipmentFn, isPending: isCreatingShipment } = useCreateShipment({
		onSuccess: (shipment) => {
			navigate({ to: '/shipments/$shipmentId', params: { shipmentId: shipment.id } })
		},
		onError: (error) => {
			for (const [apiField, message] of Object.entries(getApiFieldErrors(error))) {
				const field = SHIPMENT_FORM_FIELD_BY_API_FIELD[apiField]

				if (field) setError(field, { message })
			}
		},
	})

	async function handleShipmentSubmit(data: TShipmentFormValues, hasUnreadableDate: boolean) {
		if (hasUnreadableDate) return

		await createShipmentFn(toCreateShipmentInput(data)).catch(() => undefined)
	}

	// O datetime-local entrega '' quando a data digitada é incompleta ou inexistente (ex.: 31/11).
	async function handleFormSubmit(event: FormEvent<HTMLFormElement>) {
		const form = event.currentTarget
		const unreadableFields = SHIPMENT_DATE_FIELDS.filter((field) => hasUnreadableDateInput(form, field))

		await handleSubmit((data) => handleShipmentSubmit(data, unreadableFields.length > 0))(event)

		for (const field of unreadableFields) setError(field, { message: INVALID_DATE_MESSAGE })

		if (unreadableFields.length > 0) setFocus(unreadableFields[0])
	}

	const dateBounds = shipmentDateInputBounds()

	return (
		<form noValidate onSubmit={handleFormSubmit} className="flex flex-col gap-6">
			<Card>
				<CardHeader>
					<CardTitle>Dados do embarque</CardTitle>
				</CardHeader>
				<CardContent className="grid gap-4 sm:grid-cols-2">
					<TextField
						id="shipmentIdCustom"
						label="Identificador"
						placeholder="SHP-2026-0001"
						error={errors.shipmentIdCustom?.message}
						{...register('shipmentIdCustom')}
					/>
					<TextField
						id="transportCompany"
						label="Transportadora"
						error={errors.transportCompany?.message}
						{...register('transportCompany')}
					/>
					<TextField id="origin" label="Origem" error={errors.origin?.message} {...register('origin')} />
					<TextField
						id="destination"
						label="Destino"
						error={errors.destination?.message}
						{...register('destination')}
					/>
				</CardContent>
			</Card>

			<Card>
				<CardHeader>
					<CardTitle>Datas</CardTitle>
				</CardHeader>
				<CardContent className="grid gap-4 sm:grid-cols-3">
					<TextField
						id="dispatchedAt"
						type="datetime-local"
						label="Despacho"
						min={dateBounds.dispatchedAt.min}
						max={dateBounds.dispatchedAt.max}
						error={errors.dispatchedAt?.message}
						{...register('dispatchedAt')}
					/>
					<TextField
						id="expectedArrival"
						type="datetime-local"
						label="Chegada prevista"
						min={dateBounds.expectedArrival.min}
						max={dateBounds.expectedArrival.max}
						error={errors.expectedArrival?.message}
						{...register('expectedArrival')}
					/>
					<TextField
						id="expectedReturn"
						type="datetime-local"
						label="Retorno previsto"
						min={dateBounds.expectedReturn.min}
						max={dateBounds.expectedReturn.max}
						error={errors.expectedReturn?.message}
						{...register('expectedReturn')}
					/>
				</CardContent>
			</Card>

			<Card>
				<CardHeader>
					<CardTitle>Contêiner (opcional)</CardTitle>
					<CardDescription>
						Padrão ISO 6346: 4 letras, 6 números e o dígito verificador, por exemplo MSCU 123456-6.
					</CardDescription>
				</CardHeader>
				<CardContent className="grid gap-4 sm:grid-cols-2">
					<ContainerNumberField
						id="containerNumber"
						error={errors.containerNumber?.message}
						{...register('containerNumber')}
					/>
					<ContainerIsoCodeField id="containerIsoCode" />
					<TextField
						id="containerType"
						label="Tipo"
						error={errors.containerType?.message}
						{...register('containerType')}
					/>
					<TextField
						id="containerOwner"
						label="Proprietário"
						error={errors.containerOwner?.message}
						{...register('containerOwner')}
					/>
				</CardContent>
			</Card>

			<div className="flex justify-end gap-2">
				<Button asChild type="button" variant="outline">
					<Link to="/shipments">Cancelar</Link>
				</Button>
				<Button type="submit" disabled={isCreatingShipment}>
					{isCreatingShipment && <LoaderPinwheelIcon className="size-4 animate-spin" />}
					Registrar embarque
				</Button>
			</div>
		</form>
	)
}
