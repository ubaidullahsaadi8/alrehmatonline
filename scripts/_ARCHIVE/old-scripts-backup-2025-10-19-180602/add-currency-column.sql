-- Add currency column to users table
DO $$
BEGIN
    -- Check if the column exists first
    IF NOT EXISTS (
        SELECT FROM information_schema.columns 
        WHERE table_name = 'users' AND column_name = 'currency'
    ) THEN
        -- Add currency field if it doesn't exist
        ALTER TABLE users ADD COLUMN currency VARCHAR(10) DEFAULT 'USD';
        RAISE NOTICE 'Currency column added successfully';
    ELSE
        RAISE NOTICE 'Currency column already exists';
    END IF;
END $$;
