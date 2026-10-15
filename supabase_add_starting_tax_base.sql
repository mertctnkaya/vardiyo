-- =========================================================================
-- VARDİYO V1.8.0 - Kümülatif Vergi Matrahı Devri Alanı Ekleme
-- Supabase Dashboard -> SQL Editor alanında çalıştırılabilir.
-- =========================================================================

-- 1. user_settings tablosuna starting_tax_base sütununu ekle (yoksa)
ALTER TABLE public.user_settings 
ADD COLUMN IF NOT EXISTS starting_tax_base numeric DEFAULT 0;

-- 2. Opsiyonel: starting_tax_base_month sütununu ekle (hangi aydan itibaren devrettiği için)
ALTER TABLE public.user_settings 
ADD COLUMN IF NOT EXISTS starting_tax_base_month integer DEFAULT 1;

-- 3. Negatif matrah girişini engelleyen CHECK constraint (güvenlik)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'check_starting_tax_base_positive'
  ) THEN
    ALTER TABLE public.user_settings 
    ADD CONSTRAINT check_starting_tax_base_positive 
    CHECK (starting_tax_base >= 0);
  END IF;
END $$;

COMMENT ON COLUMN public.user_settings.starting_tax_base IS 'Yıl içinde iş değiştiren veya uygulamaya yıl ortasında katılan personelin önceki işyerinden devreden kümülatif gelir vergisi matrahı.';
