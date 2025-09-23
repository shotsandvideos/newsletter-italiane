import Link from 'next/link'
import Navigation from '@/components/Navigation'
import { Calendar, Clock, User, ArrowRight, Tag } from 'lucide-react'

const articles = [
  {
    id: 1,
    title: 'Come Monetizzare la Tua Newsletter: Guida Completa 2025',
    excerpt: 'Scopri le strategie più efficaci per trasformare la tua newsletter in una fonte di reddito sostenibile. Dalle sponsorizzazioni ai prodotti digitali.',
    content: `La monetizzazione di una newsletter non è mai stata così accessibile come oggi. Con l'esplosione del newsletter marketing e la crescente attenzione dei brand verso l'advertising diretto, i creator hanno a disposizione numerose opportunità per generare reddito.

**Strategie di Monetizzazione Principali:**

1. **Sponsorizzazioni Dirette**: La forma più tradizionale e spesso più redditizia. I brand pagano per inserire contenuti promozionali nella tua newsletter.

2. **Affiliate Marketing**: Promuovi prodotti di terze parti e guadagna una commissione per ogni vendita generata.

3. **Prodotti Digitali**: Crea e vendi corsi online, ebook, template o consulenze.

4. **Membership Premium**: Offri contenuti esclusivi ai subscriber che pagano una quota mensile.

**Fattori Chiave per il Successo:**

- **Audience Engagement**: Un alto tasso di apertura e click è fondamentale
- **Nicchia Definita**: Newsletter verticali su argomenti specifici performano meglio
- **Consistency**: Pubblicazione regolare per mantenere l'audience attiva
- **Valore Reale**: Ogni newsletter deve apportare valore tangibile ai lettori

La chiave è iniziare con una strategia e testare diverse approcci per vedere cosa funziona meglio con la tua audience specifica.`,
    author: 'Marco Rossi',
    date: '2025-01-15',
    readTime: '8 min',
    category: 'Monetizzazione',
    image: '/images/blog-monetization.jpg'
  },
  {
    id: 2,
    title: 'Newsletter Advertising vs Social Media Ads: ROI a Confronto',
    excerpt: 'Analisi dettagliata delle performance pubblicitarie: perché le newsletter stanno superando i social media in termini di conversioni e engagement.',
    content: `Il panorama pubblicitario digitale sta vivendo una trasformazione significativa. Mentre i social media continuano a dominare in termini di reach, le newsletter si stanno affermando come il canale con il ROI più alto per molte aziende.

**Dati a Confronto (Media Italia 2024):**

- **Newsletter Advertising**: CTR medio 3.2%, Conversion Rate 8.1%
- **Facebook Ads**: CTR medio 1.1%, Conversion Rate 2.3%
- **Instagram Ads**: CTR medio 0.9%, Conversion Rate 1.8%
- **Google Ads**: CTR medio 2.1%, Conversion Rate 4.2%

**Vantaggi del Newsletter Advertising:**

1. **Audience Qualificata**: I subscriber hanno già mostrato interesse per il topic
2. **Ambiente Privato**: Meno distrazioni rispetto ai social feed
3. **Trust Factor**: Rapporto di fiducia consolidato tra creator e audience
4. **Costi Inferiori**: CPM generalmente più bassi rispetto alle piattaforme social

**Quando Scegliere Newsletter vs Social:**

- **Newsletter**: Ideali per prodotti/servizi B2B, nicchie specifiche, obiettivi di conversione
- **Social Media**: Migliori per awareness, targeting demografico ampio, contenuti virali

**Case Study Reale:**
Un'azienda SaaS ha spostato il 40% del budget pubblicitario dalle Google Ads alle newsletter di settore, ottenendo:
- 250% di aumento nel lead quality score
- 180% di riduzione del CAC (Customer Acquisition Cost)
- 320% di aumento nel LTV (Life Time Value)

Il futuro dell'advertising digitale sembra andare verso una maggiore personalizzazione e fiducia, elementi in cui le newsletter eccellono naturalmente.`,
    author: 'Sofia Bianchi',
    date: '2025-01-10',
    readTime: '12 min',
    category: 'Marketing',
    image: '/images/blog-roi-comparison.jpg'
  }
]

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navigation />

      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-emerald-50 to-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
            Blog Frames
          </h1>
          <p className="text-xl text-slate-600 mb-8">
            Guide, insights e strategie per creator e brand nel mondo del newsletter advertising italiano
          </p>
        </div>
      </section>

      {/* Articles */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-12">
            {articles.map((article) => (
              <article key={article.id} className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow">
                {/* Article Header */}
                <div className="p-8">
                  <div className="flex items-center gap-4 text-sm text-slate-500 mb-4">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      <span>{new Date(article.date).toLocaleDateString('it-IT', { 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      <span>{article.readTime} di lettura</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4" />
                      <span>{article.author}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Tag className="w-4 h-4" />
                      <span className="px-2 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-medium">
                        {article.category}
                      </span>
                    </div>
                  </div>
                  
                  <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-4">
                    {article.title}
                  </h2>
                  
                  <p className="text-lg text-slate-600 mb-6 leading-relaxed">
                    {article.excerpt}
                  </p>
                  
                  {/* Article Content Preview */}
                  <div className="prose max-w-none">
                    <div className="text-slate-700 leading-relaxed whitespace-pre-line">
                      {article.content.substring(0, 500)}...
                    </div>
                  </div>
                  
                  <div className="mt-6">
                    <Link
                      href={`/blog/${article.id}`}
                      className="inline-flex items-center text-emerald-600 hover:text-emerald-700 font-semibold"
                    >
                      Continua a leggere
                      <ArrowRight className="ml-2 w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
          
          {/* Load More */}
          <div className="text-center mt-12">
            <button className="px-8 py-3 bg-slate-100 text-slate-700 rounded-xl hover:bg-slate-200 transition-colors font-medium">
              Carica Altri Articoli
            </button>
          </div>
        </div>
      </section>

      {/* Newsletter Subscription */}
      <section className="py-20 bg-emerald-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-slate-900 mb-4">
            Non Perdere i Nostri Aggiornamenti
          </h2>
          <p className="text-lg text-slate-600 mb-8">
            Ricevi le ultime notizie, guide e insights direttamente nella tua inbox
          </p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="La tua email"
              className="flex-1 px-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            />
            <button className="px-6 py-3 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-colors font-semibold">
              Iscriviti
            </button>
          </div>
          <p className="text-sm text-slate-500 mt-4">
            Niente spam, solo contenuti di valore. Puoi cancellarti in qualsiasi momento.
          </p>
        </div>
      </section>

      {/* Categories */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-8 text-center">
            Esplora per Categoria
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {['Monetizzazione', 'Marketing', 'Creator Tips', 'Brand Strategy'].map((category) => (
              <Link
                key={category}
                href={`/blog/category/${category.toLowerCase()}`}
                className="p-4 bg-slate-50 rounded-xl text-center hover:bg-emerald-50 hover:text-emerald-700 transition-colors"
              >
                <span className="font-medium">{category}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
            <div>
              <h3 className="font-semibold text-white mb-4">Prodotto</h3>
              <ul className="space-y-2">
                <li><Link href="/features" className="text-slate-400 hover:text-white">Funzionalità</Link></li>
                <li><Link href="/pricing" className="text-slate-400 hover:text-white">Prezzi</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-white mb-4">Risorse</h3>
              <ul className="space-y-2">
                <li><Link href="/dashboard/help" className="text-slate-400 hover:text-white">Centro assistenza</Link></li>
                <li><Link href="/blog" className="text-slate-400 hover:text-white">Blog</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-white mb-4">Azienda</h3>
              <ul className="space-y-2">
                <li><Link href="/about" className="text-slate-400 hover:text-white">Chi siamo</Link></li>
                <li><Link href="/contatti" className="text-slate-400 hover:text-white">Contatti</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-white mb-4">Legale</h3>
              <ul className="space-y-2">
                <li><Link href="/privacy" className="text-slate-400 hover:text-white">Privacy</Link></li>
                <li><Link href="/terms" className="text-slate-400 hover:text-white">Termini</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-slate-800">
            <div className="flex items-center gap-4 mb-4 md:mb-0">
              <div className="text-2xl font-bold text-emerald-400">Frames</div>
              <div className="text-slate-400">© 2025 Tutti i diritti riservati</div>
            </div>
            <div className="flex items-center gap-6">
              <Link href="/status" className="flex items-center gap-2 text-slate-400 hover:text-white">
                <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
                Tutti i servizi operativi
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
