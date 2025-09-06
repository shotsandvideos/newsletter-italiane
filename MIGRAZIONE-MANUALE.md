# Migrazione Database - Istruzioni Manuali

## 🎯 Obiettivo
Passare da `numero_iscritti_tier` (testo) a `numero_iscritti` (numero intero) per permettere valori esatti come 3755.

## 📋 Passi da seguire in Supabase

### Passo 1: Aggiungi la nuova colonna
Vai su **Supabase → SQL Editor** ed esegui:

```sql
-- Aggiungi colonna numero_iscritti (integer)
ALTER TABLE newsletters ADD COLUMN numero_iscritti INTEGER;
```

### Passo 2: Migra i dati esistenti
```sql
-- Migra i dati dal sistema tier al sistema numerico
UPDATE newsletters SET numero_iscritti = 
  CASE 
    WHEN numero_iscritti_tier = '0 - 500' THEN 250
    WHEN numero_iscritti_tier = '500 - 1.000' THEN 750
    WHEN numero_iscritti_tier = '1.000 - 2.500' THEN 1750
    WHEN numero_iscritti_tier = '2.500 - 5.000' THEN 3750
    WHEN numero_iscritti_tier = '5.000 - 10.000' THEN 7500
    WHEN numero_iscritti_tier = '10.000+' THEN 15000
    ELSE 1000
  END
WHERE numero_iscritti_tier IS NOT NULL;
```

### Passo 3: Aggiungi constraint
```sql
-- Aggiungi constraint per valori positivi
ALTER TABLE newsletters ADD CONSTRAINT numero_iscritti_check CHECK (numero_iscritti > 0);

-- Rendi la colonna NOT NULL
ALTER TABLE newsletters ALTER COLUMN numero_iscritti SET NOT NULL;
```

### Passo 4: Verifica la migrazione
```sql
-- Controlla che tutto sia andato bene
SELECT id, numero_iscritti_tier, numero_iscritti 
FROM newsletters 
LIMIT 5;
```

## 🎉 Risultato
Dopo aver eseguito questi comandi:
- Potrai salvare valori esatti come **3755** invece dei tier fissi
- I dati esistenti saranno preservati
- La colonna `numero_iscritti_tier` rimarrà per sicurezza (può essere rimossa in futuro)

## ⚠️ Note importanti
- **Backup**: Supabase fa backup automatici, ma considera di esportare i dati prima della migrazione
- **Rollback**: Se qualcosa va storto, puoi sempre rimuovere la colonna con `ALTER TABLE newsletters DROP COLUMN numero_iscritti;`