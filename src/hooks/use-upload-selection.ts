import { useState } from 'react'

import type { ISelectedUploadFile, TUploadDocumentType } from '@/@types/document'
import { EUploadDocumentType } from '@/constants/document'
import { validateUploadFiles } from '@/utils/file'

export function useUploadSelection() {
	const [selectedFiles, setSelectedFiles] = useState<ISelectedUploadFile[]>([])

	const errors = selectedFiles.length > 0 ? validateUploadFiles(selectedFiles.map(({ file }) => file)) : []
	const canSubmit = selectedFiles.length > 0 && errors.length === 0

	function addFiles(files: File[]) {
		setSelectedFiles((current) => [
			...current,
			...files.map((file) => ({ id: crypto.randomUUID(), file, type: EUploadDocumentType.OUTRO })),
		])
	}

	function removeFile(id: string) {
		setSelectedFiles((current) => current.filter((selected) => selected.id !== id))
	}

	function setFileType(id: string, type: TUploadDocumentType) {
		setSelectedFiles((current) => current.map((selected) => (selected.id === id ? { ...selected, type } : selected)))
	}

	function clearFiles() {
		setSelectedFiles([])
	}

	return { selectedFiles, errors, canSubmit, addFiles, removeFile, setFileType, clearFiles }
}
