import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_auth/password-recovery')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_auth/password-recovery"!</div>
}
