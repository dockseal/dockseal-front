import { LoaderPinwheelIcon } from 'lucide-react'

import type { IUser } from '@/@types/auth'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { useDeleteUser } from '@/mutations/users/delete-user'

interface IDeleteUserSheetProps {
	user?: IUser
	onOpenChange: (open: boolean) => void
}

export function DeleteUserSheet({ user, onOpenChange }: IDeleteUserSheetProps) {
	const { mutateAsync: deleteUserFn, isPending: isDeletingUser } = useDeleteUser({
		onSuccess: () => onOpenChange(false),
	})

	function handleOpenChange(open: boolean) {
		onOpenChange(open)
	}

	async function handleDelete() {
		if (!user) return

		await deleteUserFn(user.id).catch(() => undefined)
	}

	return (
		<Sheet open={Boolean(user)} onOpenChange={handleOpenChange}>
			<SheetContent className="flex w-full flex-col gap-0 sm:max-w-md">
				<SheetHeader>
					<SheetTitle>Excluir usuário</SheetTitle>
					<SheetDescription>Esta ação não pode ser desfeita.</SheetDescription>
				</SheetHeader>
				{user && (
					<div className="flex flex-col gap-1 px-4 text-sm">
						<p className="font-medium">{user.name}</p>
						<p className="text-muted-foreground">{user.email}</p>
					</div>
				)}
				<SheetFooter className="flex-row justify-end">
					<Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
						Cancelar
					</Button>
					<Button type="button" variant="destructive" disabled={isDeletingUser} onClick={handleDelete}>
						{isDeletingUser && <LoaderPinwheelIcon className="size-4 animate-spin" />}
						Excluir
					</Button>
				</SheetFooter>
			</SheetContent>
		</Sheet>
	)
}
