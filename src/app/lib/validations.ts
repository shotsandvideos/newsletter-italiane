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
  title: z
    .string()
    .min(2, 'Il nome deve essere di almeno 2 caratteri')
    .max(80, 'Il nome non può superare 80 caratteri')
    .trim(),
    
  description: z
    .string()
    .min(50, 'La descrizione deve essere di almeno 50 caratteri')
    .max(300, 'La descrizione non può superare 300 caratteri')
    .trim(),
    
  category: z.enum(NEWSLETTER_CATEGORIES, {
    errorMap: () => ({ message: 'Seleziona una categoria valida' })
  }),
  
  language: z
    .string()
    .default('it'),
    
  
  signup_url: z
    .string()
    .url('Inserisci un URL di iscrizione valido')
    .refine((url) => url.startsWith('https://'), {
      message: 'L\'URL deve iniziare con https://'
    }),
    
  cadence: z.enum(SENDING_FREQUENCIES).optional(),
  
  audience_size: z
    .number()
    .min(0, 'Il numero di iscritti deve essere almeno 0')
    .int('Il numero di iscritti deve essere un numero intero'),
  
  monetization: z
    .string()
    .optional(),
    
  contact_email: z
    .string()
    .email('Inserisci un\'email valida')
    .trim(),

  linkedin_profile: z
    .string()
    .url('Inserisci un URL LinkedIn valido')
    .refine((url) => url.includes('linkedin.com'), {
      message: 'L\'URL deve essere un profilo LinkedIn'
    })
    .optional()
    .or(z.literal('')),

  open_rate: z
    .number()
    .min(0, 'L\'open rate deve essere almeno 0%')
    .max(100, 'L\'open rate non può superare 100%'),

  ctr_rate: z
    .number()
    .min(0, 'Il CTR deve essere almeno 0%')
    .max(100, 'Il CTR non può superare 100%'),

  sponsorship_price: z
    .number()
    .min(0, 'Il prezzo deve essere almeno 0€')
    .int('Il prezzo deve essere un numero intero'),

  author_first_name: z
    .string()
    .min(2, 'Il nome deve essere di almeno 2 caratteri')
    .max(50, 'Il nome non può superare 50 caratteri')
    .trim(),

  author_last_name: z
    .string()
    .min(2, 'Il cognome deve essere di almeno 2 caratteri')
    .max(50, 'Il cognome non può superare 50 caratteri')
    .trim(),

  author_email: z
    .string()
    .email('Inserisci un\'email valida per l\'autore')
    .trim()
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
  title: string
  description: string
  category: typeof NEWSLETTER_CATEGORIES[number]
  language: string
  signup_url: string
  cadence?: typeof SENDING_FREQUENCIES[number]
  audience_size: number
  monetization?: string
  contact_email: string
  linkedin_profile?: string
  open_rate: number
  ctr_rate: number
  sponsorship_price: number
  author_first_name: string
  author_last_name: string
  author_email: string
  review_status: 'in_review' | 'approved' | 'rejected'
  created_at: string
  updated_at: string
}