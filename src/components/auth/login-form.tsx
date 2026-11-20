import { zodResolver } from '@hookform/resolvers/zod'
import { Link, useNavigate } from '@tanstack/react-router'
import { EyeIcon, EyeOffIcon, LoaderPinwheelIcon } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'

import { AuthCard } from '@/components/auth/auth-card'
import { Button } from '@/components/ui/button'
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from '@/components/ui/input-group'
import { useLogin } from '@/mutations/auth/login'
import { loginFormSchema, type TLoginFormValues } from '@/schemas/auth/login-form.schema'
import { getLandingPath } from '@/utils/navigation'

export function LoginForm() {
	const navigate = useNavigate()
	const [showPassword, setShowPassword] = useState(false)

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<TLoginFormValues>({
		resolver: zodResolver(loginFormSchema),
		defaultValues: { email: '', password: '' },
	})

	const { mutateAsync: loginFn, isPending: isLoggingIn } = useLogin({
		onSuccess: (data) => {
			navigate({ to: getLandingPath(data.user.role) })
		},
	})

	function handleToggleShowPassword() {
		setShowPassword((current) => !current)
	}

	async function handleLoginSubmit(data: TLoginFormValues) {
		await loginFn({ username: data.email, password: data.password }).catch(() => undefined)
	}

	return (
		<AuthCard title="Entrar" description="Informe suas credenciais para acessar a plataforma.">
			<form noValidate onSubmit={handleSubmit(handleLoginSubmit)}>
				<FieldGroup>
					<Field data-invalid={Boolean(errors.email)}>
						<FieldLabel htmlFor="email">E-mail</FieldLabel>
						<Input
							id="email"
							type="email"
							autoComplete="email"
							placeholder="nome@empresa.com"
							maxLength={254}
							disabled={isLoggingIn}
							aria-invalid={Boolean(errors.email)}
							{...register('email')}
						/>
						<FieldError>{errors.email?.message}</FieldError>
					</Field>

					<Field data-invalid={Boolean(errors.password)}>
						<div className="flex items-center justify-between">
							<FieldLabel htmlFor="password">Senha</FieldLabel>
							<Button asChild variant="link" className="h-auto p-0">
								<Link to="/forgot-password">Esqueceu a senha?</Link>
							</Button>
						</div>
						<InputGroup>
							<InputGroupInput
								id="password"
								type={showPassword ? 'text' : 'password'}
								autoComplete="current-password"
								placeholder="••••••••"
								maxLength={128}
								disabled={isLoggingIn}
								aria-invalid={Boolean(errors.password)}
								{...register('password')}
							/>
							<InputGroupAddon align="inline-end">
								<InputGroupButton
									onClick={handleToggleShowPassword}
									aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
								>
									{showPassword ? <EyeIcon /> : <EyeOffIcon />}
								</InputGroupButton>
							</InputGroupAddon>
						</InputGroup>
						<FieldError>{errors.password?.message}</FieldError>
					</Field>

					<Field>
						<Button type="submit" className="w-full" disabled={isLoggingIn}>
							{isLoggingIn && <LoaderPinwheelIcon className="size-4 animate-spin" />}
							Entrar
						</Button>
						<Button asChild variant="outline" className="w-full">
							<Link to="/request-access">Solicitar acesso</Link>
						</Button>
					</Field>
				</FieldGroup>
			</form>
		</AuthCard>
	)
}
