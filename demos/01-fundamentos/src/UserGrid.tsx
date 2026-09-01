import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import type { User } from './types'
import { UserCard } from './UserCard'

interface UserGridProps {
  users: User[]
}

export function UserGrid({ users }: UserGridProps) {
  return (
    <Stack spacing={2}>
      <Typography variant="h5">Equipo ({users.length})</Typography>
      <Stack direction="row" flexWrap="wrap" gap={2}>
        {users.map((user) => (
          <UserCard key={user.id} user={user} />
        ))}
      </Stack>
    </Stack>
  )
}
