import Alert from '@mui/material/Alert'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import { Component, type ErrorInfo, type ReactNode } from 'react'

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false }

  static getDerivedStateFromError(): State {
    return { hasError: true }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('ErrorBoundary:', error, info.componentStack)
  }

  render() {
    if (this.state.hasError) {
      return (
        <Box sx={{ p: 4, textAlign: 'center' }}>
          <Alert severity="error" sx={{ mb: 2 }}>
            Algo salió mal en esta sección de la app.
          </Alert>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Error boundaries capturan errores de render en componentes hijos.
          </Typography>
          <Button variant="contained" onClick={() => this.setState({ hasError: false })}>
            Reintentar
          </Button>
        </Box>
      )
    }

    return this.props.children
  }
}
