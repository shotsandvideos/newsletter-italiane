import Link from 'next/link'
import Image from 'next/image'

export default function Footer() {
  return (
    <footer className="py-16 relative overflow-hidden" style={{ backgroundColor: '#f7f7f5' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          <div>
            <h3 className="font-semibold text-foreground mb-4">Prodotto</h3>
            <ul className="space-y-2">
              <li><Link href="/features" className="text-muted-foreground hover:text-foreground">Funzionalità</Link></li>
              <li><Link href="/pricing" className="text-muted-foreground hover:text-foreground">Prezzi</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-foreground mb-4">Risorse</h3>
            <ul className="space-y-2">
              <li><Link href="/dashboard/help" className="text-muted-foreground hover:text-foreground">Centro assistenza</Link></li>
              <li><Link href="/blog" className="text-muted-foreground hover:text-foreground">Blog</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-foreground mb-4">Azienda</h3>
            <ul className="space-y-2">
              <li><Link href="/about" className="text-muted-foreground hover:text-foreground">Chi siamo</Link></li>
              <li><Link href="/contatti" className="text-muted-foreground hover:text-foreground">Contatti</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-foreground mb-4">Legale</h3>
            <ul className="space-y-2">
              <li><Link href="/privacy" className="text-muted-foreground hover:text-foreground">Privacy</Link></li>
              <li><Link href="/terms" className="text-muted-foreground hover:text-foreground">Termini</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-border">
          <div className="flex items-center gap-4 mb-4 md:mb-0">
            <Image
              src="/images/frameslogo.svg?v=20250912-2"
              alt="Frames"
              width={180}
              height={40}
              className="h-9 w-auto"
            />
            <div className="text-muted-foreground">© 2025 Tutti i diritti riservati</div>
          </div>
          <div className="flex items-center gap-6">
            <Link href="/status" className="flex items-center gap-2 text-muted-foreground hover:text-foreground">
              <div className="w-2 h-2 bg-chart-5 rounded-full"></div>
              Tutti i servizi operativi
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}