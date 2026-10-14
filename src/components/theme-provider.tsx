import { createContext, useContext, useEffect, useMemo, useState } from 'react'

type TRawTheme = 'dark' | 'light' | 'system'
type TTheme = 'dark' | 'light'

interface IThemeProviderProps {
	children: React.ReactNode
	defaultTheme?: TRawTheme
	storageKey?: string
}

interface IThemeProviderState {
	rawTheme: TRawTheme
	setTheme: (theme: TRawTheme) => void
	theme: TTheme
}

const initialState: IThemeProviderState = {
	rawTheme: 'system',
	setTheme: () => null,
	theme: 'dark',
}

const ThemeProviderContext = createContext<IThemeProviderState>(initialState)

export function ThemeProvider({
	children,
	defaultTheme = 'system',
	storageKey = 'vite-ui-theme',
	...props
}: IThemeProviderProps) {
	const [rawTheme, setRawTheme] = useState<TRawTheme>(
		() => (localStorage.getItem(storageKey) as TRawTheme) || defaultTheme,
	)

	useEffect(() => {
		const root = window.document.documentElement

		root.classList.remove('light', 'dark')

		if (rawTheme === 'system') {
			const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'

			root.classList.add(systemTheme)
			return
		}

		root.classList.add(rawTheme)
	}, [rawTheme])

	const value = useMemo(
		() => ({
			rawTheme,
			setTheme: (theme: TRawTheme) => {
				localStorage.setItem(storageKey, theme)
				setRawTheme(theme)
			},
			theme:
				rawTheme === 'system'
					? window.matchMedia('(prefers-color-scheme: dark)').matches
						? 'dark'
						: 'light'
					: rawTheme,
		}),
		[rawTheme, storageKey],
	)

	return (
		<ThemeProviderContext.Provider {...props} value={value}>
			{children}
		</ThemeProviderContext.Provider>
	)
}

export const useTheme = () => {
	const context = useContext(ThemeProviderContext)

	if (context === undefined) throw new Error('useTheme must be used within a ThemeProvider')

	return context
}
