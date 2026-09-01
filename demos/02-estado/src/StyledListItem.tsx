import ListItem from '@mui/material/ListItem'
import { styled } from '@mui/material/styles'

export const StyledListItem = styled(ListItem)(({ theme }) => ({
  padding: theme.spacing(1, 0),
  borderBottom: '1px solid',
  borderColor: theme.palette.divider,
}))
