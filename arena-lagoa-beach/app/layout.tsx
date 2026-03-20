import Link from 'next/link'
import Navbar from '../components/ui'
import Navigation from '@/components/ui/Navigation'

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <body>
        <nav>
           <Navigation />
        </nav>
        {children}
      </body>
    </html>
  )
}