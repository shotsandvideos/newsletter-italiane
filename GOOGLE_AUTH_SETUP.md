# 🔐 Setup Google Authentication con Supabase

## 📋 **Panoramica**
Questo progetto ora supporta l'autenticazione Google tramite Supabase OAuth. Gli utenti possono registrarsi e accedere usando il loro account Google.

## 🚀 **Configurazione Supabase Dashboard**

### **1. Configurare Google OAuth Provider**

1. **Vai su Supabase Dashboard**
   - Accedi a [supabase.com/dashboard](https://supabase.com/dashboard)
   - Seleziona il tuo progetto

2. **Naviga alle Impostazioni Auth**
   - Sidebar → **Authentication** → **Providers**
   - Trova "Google" nella lista

3. **Configura Google Provider**
   - Clicca su Google per espandere le opzioni
   - Abilita il toggle **"Enable sign in with Google"**

### **2. Configurare Google Cloud Console**

1. **Accedi a Google Cloud Console**
   - Vai su [console.cloud.google.com](https://console.cloud.google.com)
   - Crea un nuovo progetto o seleziona uno esistente

2. **Abilita Google+ API** (se non già fatto)
   - Cerca "Google+ API" nella libreria API
   - Clicca **"Abilita"**

3. **Crea Credenziali OAuth 2.0**
   - Vai su **"Credenziali"** → **"Crea credenziali"** → **"ID client OAuth 2.0"**
   - Tipo applicazione: **"Applicazione web"**
   - Nome: `Newsletter Italiane`

4. **Configura Domini Autorizzati**
   - **JavaScript origins autorizzati:**
     ```
     http://localhost:3000
     https://tuo-dominio.com
     ```
   
   - **URI di reindirizzamento autorizzati:**
     ```
     https://uaixwbiyttghmtesjdsx.supabase.co/auth/v1/callback
     http://localhost:3000/auth/callback
     ```

5. **Copia Client ID e Client Secret**
   - Salva il `Client ID` e `Client Secret` generati

### **3. Configurare Supabase con le Credenziali Google**

1. **Torna su Supabase Dashboard**
   - Authentication → Providers → Google

2. **Inserisci le Credenziali**
   - **Client ID (Google):** Incolla il Client ID
   - **Client Secret (Google):** Incolla il Client Secret
   - **Redirect URL:** `https://uaixwbiyttghmtesjdsx.supabase.co/auth/v1/callback`

3. **Salva Configurazione**
   - Clicca **"Save"**

## ✅ **Funzionalità Implementate**

### **Pagine con Google Auth:**
- ✅ **Homepage** (`/`) - Bottone "Continua con Google"
- ✅ **Sign In** (`/auth/sign-in`) - Bottone Google + form email
- ✅ **Sign Up** (`/auth/sign-up`) - Bottone Google + form registrazione
- ✅ **Auth Callback** (`/auth/callback`) - Gestisce ritorno da Google

### **Flow di Autenticazione:**
1. Utente clicca "Continua con Google"
2. Viene reindirizzato a Google per l'autorizzazione
3. Google reindirizza a `/auth/callback`
4. L'app gestisce la sessione e reindirizza a `/dashboard`

## 🧪 **Come Testare**

1. **Esegui la configurazione Supabase** (sopra)
2. **Avvia il dev server:** `npm run dev`
3. **Vai su** `http://localhost:3000`
4. **Clicca** "Continua con Google"
5. **Autorizza l'app** su Google
6. **Verifica** il redirect alla dashboard

## 🔧 **Troubleshooting**

### **Errori Comuni:**

**"OAuth client not found"**
- Verifica che il Client ID sia corretto in Supabase
- Controlla che il progetto Google Cloud sia attivo

**"Redirect URI mismatch"**
- Assicurati che gli URI in Google Cloud Console includano:
  - `https://uaixwbiyttghmtesjdsx.supabase.co/auth/v1/callback`
  - `http://localhost:3000/auth/callback` (per sviluppo)

**"Access blocked"**
- Verifica che i domini siano autorizzati in Google Cloud Console
- Controlla che Google+ API sia abilitato

## 📱 **Prossimi Passi**

Dopo aver configurato Google Auth:
1. **Test completo** dell'autenticazione
2. **Aggiungere altri provider** (GitHub, Facebook, etc.)
3. **Personalizzare UX** del flow OAuth
4. **Setup produzione** con domini finali

---

🎉 **Google Authentication è ora completamente integrato con Supabase!**