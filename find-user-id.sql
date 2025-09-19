-- Script helper per trovare il tuo user ID
-- Esegui questo script in Supabase per ottenere il tuo user ID

-- Opzione 1: Se sei loggato, mostra il tuo ID
SELECT auth.uid() as your_user_id;

-- Opzione 2: Mostra tutti gli utenti (se sei admin)
SELECT id, email, created_at FROM auth.users ORDER BY created_at DESC LIMIT 5;

-- Opzione 3: Mostra profili esistenti
SELECT id, email, first_name, last_name FROM profiles LIMIT 5;

-- Una volta trovato il tuo user ID, copia-incollalo nel file create-admin-messaging-test-data.sql
-- sostituendo tutte le occorrenze di 'YOUR_USER_ID_HERE'