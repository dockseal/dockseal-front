import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'

import type { IAlert, TAlertStatus } from '@/@types/alert'
import { Button } from '@/components/ui/button'
import { Field, FieldError, FieldLabel } from '@/components/ui/field'
import { Textarea } from '@/components/ui/textarea'
import { ALERT_ACTIONS, ALERT_RESOLUTION_NOTE_MAX_LENGTH } from '@/constants/alert'
import { useUpdateAlert } from '@/mutations/alerts/update-alert'
import { alertResolutionSchema, type TAlertResolutionValues } from '@/schemas/alerts/alert-resolution.schema'

interface IAlertActionsFormProps {
	alert: IAlert
}

export function AlertActionsForm({ alert }: IAlertActionsFormProps) {
	const {
		register,
		handleSubmit,
		reset,
		formState: { errors },
	} = useForm<TAlertResolutionValues>({
		resolver: zodResolver(alertResolutionSchema),
		defaultValues: { resolutionNote: '' },
	})

	const { mutateAsync: updateAlertFn, isPending: isUpdatingAlert } = useUpdateAlert({
		onSuccess: () => reset(),
	})

	const actions = ALERT_ACTIONS.filter((action) => (alert.status === 'OPEN') === (action.status !== 'OPEN'))

	function handleAction(status: TAlertStatus) {
		return handleSubmit(async ({ resolutionNote }) => {
			const note = resolutionNote.trim()

			await updateAlertFn({
				alertId: alert.id,
				input: note ? { status, resolution_note: note } : { status },
			}).catch(() => undefined)
		})
	}

	return (
		<form noValidate className="flex flex-col gap-3" onSubmit={(event) => event.preventDefault()}>
			<Field data-invalid={Boolean(errors.resolutionNote)}>
				<FieldLabel htmlFor="resolution-note">Nota de resolução</FieldLabel>
				<Textarea
					id="resolution-note"
					rows={3}
					maxLength={ALERT_RESOLUTION_NOTE_MAX_LENGTH}
					disabled={isUpdatingAlert}
					aria-invalid={Boolean(errors.resolutionNote)}
					{...register('resolutionNote')}
				/>
				<FieldError>{errors.resolutionNote?.message}</FieldError>
			</Field>
			<div className="flex flex-wrap gap-2">
				{actions.map((action) => (
					<Button
						key={action.status}
						type="button"
						variant={action.status === 'RESOLVED' ? 'default' : 'outline'}
						disabled={isUpdatingAlert}
						onClick={handleAction(action.status)}
					>
						{action.label}
					</Button>
				))}
			</div>
		</form>
	)
}
