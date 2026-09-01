import CssBaseline from '@mui/material/CssBaseline'
import { createTheme, ThemeProvider } from '@mui/material/styles'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { Layout } from './Layout'
import { PostsPage } from './pages/PostsPage'
import { UsersPage } from './pages/UsersPage'

const theme = createTheme()

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Navigate to="/users" replace />} />
            <Route path="/users" element={<UsersPage />} />
            <Route path="/posts" element={<PostsPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  )
}
