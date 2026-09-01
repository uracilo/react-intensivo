import Avatar from '@mui/material/Avatar'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import type { User } from './types'

interface UserCardProps {
  user: User
}

export function UserCard({ user }: UserCardProps) {
  const isAdmin = user.role === 'admin'

  return (
    <Card sx={{ minWidth: 240 }}>
      <CardContent>
        <Stack direction="row" spacing={2} alignItems="center">
          <Avatar src={user.avatarUrl} alt={user.name} />
          <Stack spacing={0.5}>
            <Typography
              variant="h6"
              fontWeight={isAdmin ? 'bold' : 'normal'}
            >
              {user.name}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {user.role}
            </Typography>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  )
}
