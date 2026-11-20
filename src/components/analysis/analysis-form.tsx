import { Sparkles } from 'lucide-react'

import { AnalysisPending } from '@/components/analysis/analysis-pending'
import { AnalysisResultView } from '@/components/analysis/analysis-result-view'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { FileDropzone } from '@/components/uploads/file-dropzone'
import { useUploadSelection } from '@/hooks/use-upload-selection'
import { useAnalyzeDocuments } from '@/mutations/analysis/analyze-documents'

export function AnalysisForm() {
	const { selectedFiles, errors, canSubmit, addFiles, removeFile } = useUploadSelection()
	const {
		mutateAsync: analyzeDocumentsFn,
		data: analysisResult,
		isPending: isAnalyzing,
		reset: resetAnalysis,
	} = useAnalyzeDocuments()

	async function handleAnalyze() {
		resetAnalysis()
		await analyzeDocumentsFn(selectedFiles.map(({ file }) => file)).catch(() => undefined)
	}

	return (
		<div className="flex flex-col gap-6">
			<Card>
				<CardContent className="flex flex-col gap-4">
					<FileDropzone
						selectedFiles={selectedFiles}
						errors={errors}
						disabled={isAnalyzing}
						onAddFiles={addFiles}
						onRemoveFile={removeFile}
					/>
					<div className="flex justify-end">
						<Button type="button" onClick={handleAnalyze} disabled={!canSubmit || isAnalyzing}>
							<Sparkles />
							Analisar documentos
						</Button>
					</div>
				</CardContent>
			</Card>
			{isAnalyzing && <AnalysisPending />}
			{analysisResult && (
				<Card>
					<CardHeader>
						<CardTitle>Resultado da análise</CardTitle>
					</CardHeader>
					<CardContent>
						<AnalysisResultView result={analysisResult} />
					</CardContent>
				</Card>
			)}
		</div>
	)
}
