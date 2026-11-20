import { Upload } from 'lucide-react'
import { type ChangeEvent, type DragEvent, useId, useState } from 'react'

import type { ISelectedUploadFile, TUploadDocumentType } from '@/@types/document'
import { Progress } from '@/components/ui/progress'
import { SelectedFileItem } from '@/components/uploads/selected-file-item'
import { ACCEPTED_UPLOAD_ATTRIBUTE, MAX_FILES_PER_UPLOAD, MAX_UPLOAD_SIZE_MB } from '@/constants/upload'
import { cn } from '@/lib/utils'

interface IFileDropzoneProps {
	selectedFiles: ISelectedUploadFile[]
	errors: string[]
	withTypes?: boolean
	disabled?: boolean
	progress?: number | null
	onAddFiles: (files: File[]) => void
	onRemoveFile: (id: string) => void
	onTypeChange?: (id: string, type: TUploadDocumentType) => void
}

export function FileDropzone({
	selectedFiles,
	errors,
	withTypes = false,
	disabled = false,
	progress = null,
	onAddFiles,
	onRemoveFile,
	onTypeChange,
}: IFileDropzoneProps) {
	const inputId = useId()
	const [isDragging, setIsDragging] = useState(false)

	function handleInputChange(event: ChangeEvent<HTMLInputElement>) {
		onAddFiles(Array.from(event.target.files ?? []))
		event.target.value = ''
	}

	function handleDragOver(event: DragEvent<HTMLLabelElement>) {
		event.preventDefault()
		setIsDragging(true)
	}

	function handleDragLeave() {
		setIsDragging(false)
	}

	function handleDrop(event: DragEvent<HTMLLabelElement>) {
		event.preventDefault()
		setIsDragging(false)

		if (!disabled) onAddFiles(Array.from(event.dataTransfer.files))
	}

	function handleTypeChange(id: string, type: TUploadDocumentType) {
		onTypeChange?.(id, type)
	}

	return (
		<div className="flex flex-col gap-3">
			<label
				htmlFor={inputId}
				onDragOver={handleDragOver}
				onDragLeave={handleDragLeave}
				onDrop={handleDrop}
				className={cn(
					'flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border border-dashed p-8 text-center transition-colors hover:bg-muted/50',
					{ 'border-primary bg-primary/5': isDragging, 'pointer-events-none opacity-50': disabled },
				)}
			>
				<Upload className="size-6 text-muted-foreground" aria-hidden="true" />
				<span className="text-sm font-medium">Selecione ou arraste arquivos</span>
				<span className="text-xs text-muted-foreground">
					PDF, DOCX, TXT, CSV, MD, XML, JSON, PNG, JPG ou WEBP. Até {MAX_FILES_PER_UPLOAD} arquivos de{' '}
					{MAX_UPLOAD_SIZE_MB} MB.
				</span>
				<input
					id={inputId}
					type="file"
					multiple
					accept={ACCEPTED_UPLOAD_ATTRIBUTE}
					disabled={disabled}
					onChange={handleInputChange}
					className="sr-only"
				/>
			</label>

			{errors.length > 0 && (
				<ul role="alert" className="flex flex-col gap-1 text-sm text-destructive">
					{errors.map((error) => (
						<li key={error}>{error}</li>
					))}
				</ul>
			)}

			{selectedFiles.length > 0 && (
				<ul aria-label="Arquivos selecionados" className="flex flex-col divide-y">
					{selectedFiles.map((selected) => (
						<SelectedFileItem
							key={selected.id}
							selected={selected}
							withType={withTypes}
							disabled={disabled}
							onRemove={onRemoveFile}
							onTypeChange={handleTypeChange}
						/>
					))}
				</ul>
			)}

			{progress !== null && (
				<div className="flex flex-col gap-1">
					<Progress value={progress} aria-label="Progresso do envio" />
					<span className="text-xs text-muted-foreground">Enviando… {progress}%</span>
				</div>
			)}
		</div>
	)
}
