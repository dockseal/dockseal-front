import { zodResolver } from '@hookform/resolvers/zod'
import { LoaderPinwheelIcon } from 'lucide-react'
import { Controller, type UseFormReturn, useForm } from 'react-hook-form'

import type { IUser, TUserRole, TUserStatus } from '@/@types/auth'
import { TextField } from '@/components/form/text-field'
import { Button } from '@/components/ui/button'
import { Field, FieldError, FieldLabel } from '@/components/ui/field'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Sheet, SheetContent, SheetFooter, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { EUserRole, USER_ROLE_LABEL } from '@/constants/auth'
import { useCreateUser } from '@/mutations/users/create-user'
import { useUpdateUser } from '@/mutations/users/update-user'
import {
	createUserFormSchema,
	type TCreateUserFormValues,
	type TUpdateUserFormValues,
	updateUserFormSchema,
} from '@/schemas/users/user-form.schema'

interface IUserFormSheetProps {
	open: boolean
	user?: IUser
	onOpenChange: (open: boolean) => void
}

const ROLE_OPTIONS = [EUserRole.OPERADOR, EUserRole.GESTOR, EUserRole.ADMIN] as const

const STATUS_OPTIONS: { value: TUserStatus; label: string }[] = [
	{ value: 'ACTIVE', label: 'Ativo' },
	{ value: 'INACTIVE', label: 'Inativo' },
]

export function UserFormSheet({ open, user, onOpenChange }: IUserFormSheetProps) {
	function handleOpenChange(nextOpen: boolean) {
		onOpenChange(nextOpen)
	}

	return (
		<Sheet open={open} onOpenChange={handleOpenChange}>
			<SheetContent className="flex w-full flex-col gap-0 overflow-y-auto sm:max-w-md">
				<SheetHeader>
					<SheetTitle>{user ? 'Editar usuário' : 'Novo usuário'}</SheetTitle>
				</SheetHeader>
				{open && user && <EditUserForm key={user.id} user={user} onClose={() => onOpenChange(false)} />}
				{open && !user && <CreateUserForm key="create" onClose={() => onOpenChange(false)} />}
			</SheetContent>
		</Sheet>
	)
}

function CreateUserForm({ onClose }: { onClose: () => void }) {
	const form = useForm<TCreateUserFormValues>({
		resolver: zodResolver(createUserFormSchema),
		defaultValues: { name: '', email: '', role: 'OPERADOR', password: '' },
	})
	const { mutateAsync: createUserFn, isPending: isCreatingUser } = useCreateUser({
		onSuccess: () => onClose(),
	})

	async function handleCreateSubmit(data: TCreateUserFormValues) {
		await createUserFn(data).catch(() => undefined)
	}

	return (
		<UserFormFields
			form={form as UseFormReturn<IUserFormShape>}
			isEditing={false}
			isPending={isCreatingUser}
			onCancel={onClose}
			onSubmit={form.handleSubmit(handleCreateSubmit)}
		/>
	)
}

function EditUserForm({ user, onClose }: { user: IUser; onClose: () => void }) {
	const form = useForm<TUpdateUserFormValues>({
		resolver: zodResolver(updateUserFormSchema),
		defaultValues: {
			name: user.name,
			email: user.email,
			role: user.role.name,
			status: user.status,
			password: '',
		},
	})
	const { mutateAsync: updateUserFn, isPending: isUpdatingUser } = useUpdateUser({
		onSuccess: () => onClose(),
	})

	async function handleUpdateSubmit(data: TUpdateUserFormValues) {
		await updateUserFn({
			userId: user.id,
			input: {
				name: data.name,
				email: data.email,
				role: data.role,
				status: data.status,
				...(data.password ? { password: data.password } : {}),
			},
		}).catch(() => undefined)
	}

	return (
		<UserFormFields
			form={form as UseFormReturn<IUserFormShape>}
			isEditing
			isPending={isUpdatingUser}
			onCancel={onClose}
			onSubmit={form.handleSubmit(handleUpdateSubmit)}
		/>
	)
}

interface IUserFormShape {
	name: string
	email: string
	role: TUserRole
	password: string
	status?: TUserStatus
}

interface IUserFormFieldsProps {
	form: UseFormReturn<IUserFormShape>
	isEditing: boolean
	isPending: boolean
	onCancel: () => void
	onSubmit: () => void
}

function UserFormFields({ form, isEditing, isPending, onCancel, onSubmit }: IUserFormFieldsProps) {
	const {
		register,
		control,
		formState: { errors },
	} = form
	const statusError = errors.status?.message

	return (
		<form noValidate onSubmit={onSubmit} className="flex flex-1 flex-col">
			<div className="flex flex-col gap-4 px-4">
				<TextField id="user-name" label="Nome" error={errors.name?.message} {...register('name')} />
				<TextField id="user-email" type="email" label="E-mail" error={errors.email?.message} {...register('email')} />
				<Field data-invalid={Boolean(errors.role)}>
					<FieldLabel>Perfil</FieldLabel>
					<Controller
						control={control}
						name="role"
						render={({ field }) => (
							<Select value={field.value} onValueChange={(value) => field.onChange(value as TUserRole)}>
								<SelectTrigger className="w-full" aria-invalid={Boolean(errors.role)}>
									<SelectValue placeholder="Selecione o perfil." />
								</SelectTrigger>
								<SelectContent>
									{ROLE_OPTIONS.map((role) => (
										<SelectItem key={role} value={role}>
											{USER_ROLE_LABEL[role]}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						)}
					/>
					<FieldError>{errors.role?.message}</FieldError>
				</Field>
				{isEditing && (
					<Field data-invalid={Boolean(statusError)}>
						<FieldLabel>Status</FieldLabel>
						<Controller
							control={control}
							name="status"
							render={({ field }) => (
								<Select value={field.value} onValueChange={(value) => field.onChange(value as TUserStatus)}>
									<SelectTrigger className="w-full" aria-invalid={Boolean(statusError)}>
										<SelectValue />
									</SelectTrigger>
									<SelectContent>
										{STATUS_OPTIONS.map((status) => (
											<SelectItem key={status.value} value={status.value}>
												{status.label}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							)}
						/>
						<FieldError>{statusError}</FieldError>
					</Field>
				)}
				<div className="flex flex-col gap-1">
					<TextField
						id="user-password"
						type="password"
						label={isEditing ? 'Nova senha' : 'Senha'}
						autoComplete="new-password"
						error={errors.password?.message}
						{...register('password')}
					/>
					{isEditing && <p className="text-sm text-muted-foreground">Deixe em branco para manter a senha atual.</p>}
				</div>
			</div>
			<SheetFooter className="flex-row justify-end">
				<Button type="button" variant="outline" onClick={onCancel}>
					Cancelar
				</Button>
				<Button type="submit" disabled={isPending}>
					{isPending && <LoaderPinwheelIcon className="size-4 animate-spin" />}
					Salvar
				</Button>
			</SheetFooter>
		</form>
	)
}
