import { TextField } from '@/components/form/text-field'
import { CONTAINER_ISO_CODE } from '@/constants/shipment'

interface IContainerIsoCodeFieldProps {
	id: string
}

export function ContainerIsoCodeField({ id }: IContainerIsoCodeFieldProps) {
	return <TextField id={id} label="Código ISO" value={CONTAINER_ISO_CODE} readOnly aria-readonly />
}
