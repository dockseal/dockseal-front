import { FileText, X } from 'lucide-react'

import type { ISelectedUploadFile, TUploadDocumentType } from '@/@types/document'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { UPLOAD_DOCUMENT_TYPE_LABEL } from '@/constants/document'
import { formatFileSize } from '@/utils/file'

interface ISelectedFileItemProps {
	selected: ISelectedUploadFile
	withType: boolean
	disabled: boolean
	onRemove: (id: string) => void
	onTypeChange: (id: string, type: TUploadDocumentType) => void
}

const UPLOAD_TYPE_OPTIONS = Object.entries(UPLOAD_DOCUMENT_TYPE_LABEL) as [TUploadDocumentType, string][]

export function SelectedFileItem({ selected, withType, disabled, onRemove, onTypeChange }: ISelectedFileItemProps) {
	const { id, file, type } = selected

	function handleRemove() {
		onRemove(id)
	}

	function handleTypeChange(value: string) {
		onTypeChange(id, value as TUploadDocumentType)
	}

	return (
		<li className="flex flex-wrap items-center gap-3 py-2">
			<FileText className="size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
			<div className="flex min-w-0 flex-1 flex-col">
				<span className="truncate text-sm font-medium">{file.name}</span>
				<span className="text-xs text-muted-foreground">{formatFileSize(file.size)}</span>
			</div>
			{withType && (
				<Select value={type} onValueChange={handleTypeChange} disabled={disabled}>
					<SelectTrigger className="w-48" aria-label={`Tipo de ${file.name}`}>
						<SelectValue />
					</SelectTrigger>
					<SelectContent>
						{UPLOAD_TYPE_OPTIONS.map(([value, label]) => (
							<SelectItem key={value} value={value}>
								{label}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
			)}
			<Button
				type="button"
				variant="ghost"
				size="icon"
				onClick={handleRemove}
				disabled={disabled}
				aria-label={`Remover ${file.name}`}
			>
				<X />
			</Button>
		</li>
	)
}
