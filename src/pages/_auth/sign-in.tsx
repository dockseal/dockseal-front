import { zodResolver } from '@hookform/resolvers/zod'
import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { EyeIcon, EyeOffIcon, LoaderPinwheelIcon } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'

import { useTheme } from '@/components/theme-provider'
import { AnimatedThemeToggler } from '@/components/ui/animated-theme-toggler'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { DotPattern } from '@/components/ui/dot-pattern'
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from '@/components/ui/input-group'
import { ShineBorder } from '@/components/ui/shine-border'
import { cn } from '@/lib/utils'
import { useSignIn } from '@/mutations/auth/sign-in'
import { signInFormSchema, type TSignInFormValues } from '@/schemas/auth/sign-in-form.schema'

export const Route = createFileRoute('/_auth/sign-in')({
	component: RouteComponent,
})

function RouteComponent() {
	const navigate = useNavigate()
	const { theme, setTheme } = useTheme()

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<TSignInFormValues>({
		resolver: zodResolver(signInFormSchema),
		defaultValues: {
			email: '',
			password: '',
		},
	})

	const { mutateAsync: signIn, isPending: isSigningIn } = useSignIn({
		onSuccess: () => {
			navigate({ to: '/dashboard' })
		},
	})

	const [showPassword, setShowPassword] = useState(false)

	function handleToggleShowPassword() {
		setShowPassword((oldShowPassword) => !oldShowPassword)
	}

	async function authenticate(data: TSignInFormValues) {
		await signIn({ email: data.email, password: data.password })
	}

	return (
		<div className="w-screen h-screen flex">
			<div
				className={cn('hidden md:block flex-1 relative p-10 border-r bg-linear-to-tl via-background to-background', {
					'from-secondary': theme === 'light',
					'from-primary': theme === 'dark',
				})}
			>
				<Link to="/">
					<span className="relative z-10 font-display text-3xl">dockseal</span>
				</Link>
				<DotPattern
					width={20}
					height={20}
					cx={1}
					cy={1}
					cr={1}
					className={cn('mask-[linear-gradient(to_bottom_right,white,transparent,transparent)]')}
				/>
			</div>
			<div className="flex-1 flex flex-col p-10">
				<div className="flex justify-end">
					<AnimatedThemeToggler theme={theme} onThemeChange={setTheme} duration={500} />
				</div>
				<div className="flex-1 flex items-center justify-center">
					<Card className="relative w-full max-w-sm overflow-hidden">
						<ShineBorder shineColor={['#1257a1', '#234b63']} />
						<CardHeader>
							<CardTitle>Sign In</CardTitle>
							<CardDescription>Enter your credentials to access your account</CardDescription>
						</CardHeader>
						<CardContent>
							<form onSubmit={handleSubmit(authenticate)}>
								<FieldGroup>
									<Field>
										<FieldLabel htmlFor="email">Email</FieldLabel>
										<Input
											id="email"
											type="email"
											placeholder="email@example.com"
											minLength={1}
											maxLength={254}
											disabled={isSigningIn}
											{...register('email')}
										/>
										<FieldError>{errors.email?.message}</FieldError>
									</Field>

									<Field>
										<div className="flex items-center justify-between">
											<FieldLabel htmlFor="password">Password</FieldLabel>
											<Button asChild variant="link" disabled={isSigningIn}>
												<Link to="/password-recovery">Forgot password?</Link>
											</Button>
										</div>
										<InputGroup>
											<InputGroupInput
												id="password"
												type={showPassword ? 'text' : 'password'}
												placeholder="••••••••"
												minLength={8}
												maxLength={128}
												disabled={isSigningIn}
												{...register('password')}
											/>
											<InputGroupAddon align="inline-end">
												<InputGroupButton onClick={handleToggleShowPassword} disabled={isSigningIn}>
													{showPassword ? <EyeIcon /> : <EyeOffIcon />}
												</InputGroupButton>
											</InputGroupAddon>
										</InputGroup>
										<FieldError>{errors.password?.message}</FieldError>
									</Field>
									<Field>
										<Button type="submit" className="w-full" disabled={isSigningIn}>
											{isSigningIn && <LoaderPinwheelIcon className="size-4 animate-spin" />}
											Sign In
										</Button>
									</Field>
								</FieldGroup>
							</form>
							<div className="mt-4">
								<p className="text-sm text-muted-foreground text-center">
									If you don't have an account, talk to your administrator to get access.
								</p>
							</div>
						</CardContent>
					</Card>
				</div>
			</div>
		</div>
	)
}
