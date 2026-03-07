import { AdaptiveHub } from '@/components/layout/AdaptiveHub'
import { LoginForm } from './LoginForm'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Login',
  description: 'Access the SNAPPY dashboard and management tools.',
}

export default function LoginPage() {
  return (
    <AdaptiveHub type="auth">
      <LoginForm />
    </AdaptiveHub>
  )
}
