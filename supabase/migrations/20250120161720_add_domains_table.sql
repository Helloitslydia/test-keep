-- Create domains table
CREATE TABLE IF NOT EXISTS domains (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    domain_name TEXT,
    image_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Enable Row Level Security
ALTER TABLE domains ENABLE ROW LEVEL SECURITY;

-- Create policy to allow authenticated users to view domains
CREATE POLICY "Allow authenticated users to view domains"
ON domains FOR SELECT
TO authenticated
USING (true);

-- Create policy to allow authenticated users to insert/update domains
CREATE POLICY "Allow authenticated users to insert/update domains"
ON domains FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- Create index on domain_name for faster lookups
CREATE INDEX IF NOT EXISTS idx_domains_domain_name ON domains(domain_name);
