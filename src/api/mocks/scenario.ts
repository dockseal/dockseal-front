export const MOCK_SCENARIO_STORAGE_KEY = '@dockseal:mock-scenario'

export type TMockScenario =
	| 'shipments-empty'
	| 'alerts-empty'
	| 'events-empty'
	| 'metrics-null'
	| 'me-expired-once'
	| 'me-network-error'
	| 'refresh-invalid'
	| 'shipment-create-duplicate'
	| 'shipment-create-past-arrival'
	| 'container-in-transit'
	| 'upload-413'
	| 'upload-415'
	| 'upload-422-empty-text'
	| 'validate-422-no-documents'
	| 'validate-502'
	| 'validate-slow'
	| 'analysis-conforme'
	| 'analysis-inconclusivo'
	| 'analysis-415'
	| 'analysis-502'
	| 'alert-patch-404'
	| 'network-error'

export function hasScenario(scenario: TMockScenario) {
	try {
		const raw = localStorage.getItem(MOCK_SCENARIO_STORAGE_KEY)
		const scenarios: unknown = raw ? JSON.parse(raw) : []

		return Array.isArray(scenarios) && scenarios.includes(scenario)
	} catch {
		return false
	}
}
