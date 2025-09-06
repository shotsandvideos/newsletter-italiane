import { z } from 'zod'

// Newsletter categories
export const NEWSLETTER_CATEGORIES = [
  'Business & Startup',
  'Marketing & Growth',
  'Tecnologia & AI',
  'Design & Creatività',
  'Lifestyle & Cultura',
  'Finanza & Investimenti',
  'Food & Travel',
  'Sport & Fitness',
  'Informazione & Attualità'
] as const

// Subscribers tiers
export const SUBSCRIBERS_TIERS = [
  '0 - 500',
  '500 - 1.000',
  '1.000 - 2.500',
  '2.500 - 5.000',
  '5.000 - 10.000',
  '10.000+'
] as const

// Sending frequency options
export const SENDING_FREQUENCIES = [
  'Quotidiana',
  'Settimanale', 
  'Bisettimanale',
  'Mensile',
  'Irregolare'
] as const

// Newsletter creation validation schema
export const createNewsletterSchema = z.object({
  nome_newsletter: z
    .string()
    .min(2, 'Il nome deve essere di almeno 2 caratteri')
    .max(80, 'Il nome non può superare 80 caratteri')
    .trim(),
    
  url_archivio: z
    .string()
    .url('Inserisci un URL valido')
    .refine((url) => url.startsWith('https://'), {
      message: 'L\'URL deve iniziare con https://'
    }),
    
  categoria: z.enum(NEWSLETTER_CATEGORIES, {
    errorMap: () => ({ message: 'Seleziona una categoria valida' })
  }),
  
  numero_iscritti: z
    .number()
    .min(1, 'Il numero di iscritti deve essere almeno 1')
    .int('Il numero di iscritti deve essere un numero intero'),
  
  open_rate: z
    .number()
    .min(0, 'L\'Open Rate deve essere almeno 0%')
    .max(100, 'L\'Open Rate non può superare 100%')
    .multipleOf(0.01, 'Massimo 2 decimali'),
    
  ctr: z
    .number()
    .min(0, 'Il CTR deve essere almeno 0%')
    .max(100, 'Il CTR non può superare 100%')
    .multipleOf(0.01, 'Massimo 2 decimali'),
    
  prezzo_sponsorizzazione: z
    .number()
    .min(10, 'Il prezzo minimo è €10')
    .int('Il prezzo deve essere un numero intero'),
    
  email_contatto: z
    .string()
    .email('Inserisci un\'email valida')
    .trim(),
    
  descrizione: z
    .string()
    .min(50, 'La descrizione deve essere di almeno 50 caratteri')
    .max(300, 'La descrizione non può superare 300 caratteri')
    .trim(),
    
  // Optional fields
  frequenza_invio: z.enum(SENDING_FREQUENCIES).optional(),
  
  linkedin_profile: z
    .string()
    .url('Inserisci un URL LinkedIn valido')
    .refine((url) => url.includes('linkedin.com'), {
      message: 'Deve essere un profilo LinkedIn valido'
    })
    .optional()
    .or(z.literal(''))
})

// Type inference
export type CreateNewsletterInput = z.infer<typeof createNewsletterSchema>

// API Response types
export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  errors?: Record<string, string>
}

export interface Newsletter {
  id: string
  user_id: string
  nome_newsletter: string
  url_archivio: string
  categoria: typeof NEWSLETTER_CATEGORIES[number]
  numero_iscritti: number
  open_rate: number
  ctr: number
  prezzo_sponsorizzazione: number
  email_contatto: string
  descrizione: string
  frequenza_invio?: typeof SENDING_FREQUENCIES[number]
  linkedin_profile?: string
  status: 'pending' | 'approved' | 'rejected'
  created_at: string
  updated_at: string
}