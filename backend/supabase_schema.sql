-- Uplokal Database Schema for Supabase
-- ======================================

-- 1. Users Table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255),
    full_name VARCHAR(255),
    phone VARCHAR(20),
    avatar_url VARCHAR(500),
    oauth_provider VARCHAR(50),
    oauth_id VARCHAR(255),
    role VARCHAR(20) DEFAULT 'user' NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    is_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP WITH TIME ZONE
);

-- 2. Subscription Plans
CREATE TABLE IF NOT EXISTS subscription_plans (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    tier VARCHAR(50) UNIQUE NOT NULL,
    description TEXT,
    price_monthly INTEGER DEFAULT 0,
    price_yearly INTEGER DEFAULT 0,
    currency VARCHAR(3) DEFAULT 'IDR',
    features JSONB DEFAULT '[]',
    max_documents INTEGER DEFAULT 5,
    max_rfq_per_month INTEGER DEFAULT 3,
    ai_diagnostic BOOLEAN DEFAULT FALSE,
    ai_assistant BOOLEAN DEFAULT FALSE,
    b2b_matchmaking BOOLEAN DEFAULT FALSE,
    priority_support BOOLEAN DEFAULT FALSE,
    white_label BOOLEAN DEFAULT FALSE,
    api_access BOOLEAN DEFAULT FALSE,
    is_popular BOOLEAN DEFAULT FALSE,
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. User Subscriptions
CREATE TABLE IF NOT EXISTS user_subscriptions (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE NOT NULL,
    plan_id INTEGER REFERENCES subscription_plans(id) NOT NULL,
    status VARCHAR(50) DEFAULT 'active',
    billing_cycle VARCHAR(20) DEFAULT 'monthly',
    start_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    end_date TIMESTAMP WITH TIME ZONE NOT NULL,
    auto_renew BOOLEAN DEFAULT TRUE,
    last_payment_id VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    cancelled_at TIMESTAMP WITH TIME ZONE
);

-- 4. Businesses Table
CREATE TABLE IF NOT EXISTS businesses (
    id SERIAL PRIMARY KEY,
    owner_id INTEGER REFERENCES users(id) ON DELETE CASCADE NOT NULL,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(100),
    description TEXT,
    address TEXT,
    city VARCHAR(100),
    province VARCHAR(100),
    postal_code VARCHAR(10),
    website VARCHAR(255),
    phone VARCHAR(20),
    email VARCHAR(255),
    logo_url VARCHAR(500),
    registration_number VARCHAR(100),
    tax_id VARCHAR(100),
    
    -- Diagnostic/Health Score
    diagnostic_score INTEGER DEFAULT 0,
    health_status VARCHAR(50) DEFAULT 'Not Evaluated',
    
    -- Export Readiness
    is_export_ready BOOLEAN DEFAULT FALSE,
    export_score INTEGER DEFAULT 0,
    
    is_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. Documents Table
CREATE TABLE IF NOT EXISTS documents (
    id SERIAL PRIMARY KEY,
    owner_id INTEGER REFERENCES users(id) ON DELETE CASCADE NOT NULL,
    business_id INTEGER REFERENCES businesses(id) ON DELETE CASCADE,
    filename VARCHAR(255) NOT NULL,
    original_name VARCHAR(255) NOT NULL,
    storage_path VARCHAR(500) NOT NULL,
    file_size INTEGER,
    mime_type VARCHAR(100),
    category VARCHAR(50) DEFAULT 'other',
    description TEXT,
    is_encrypted BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 6. RFQs Table
CREATE TABLE IF NOT EXISTS rfqs (
    id SERIAL PRIMARY KEY,
    owner_id INTEGER REFERENCES users(id) ON DELETE CASCADE NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    category VARCHAR(100),
    quantity INTEGER,
    unit VARCHAR(50),
    budget_range VARCHAR(100),
    deadline TIMESTAMP WITH TIME ZONE,
    status VARCHAR(50) DEFAULT 'open',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 7. Payment Transactions
CREATE TABLE IF NOT EXISTS payment_transactions (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE NOT NULL,
    subscription_id INTEGER REFERENCES user_subscriptions(id),
    order_id VARCHAR(255) UNIQUE NOT NULL,
    transaction_id VARCHAR(255),
    amount INTEGER NOT NULL,
    currency VARCHAR(3) DEFAULT 'IDR',
    status VARCHAR(50) DEFAULT 'pending',
    payment_type VARCHAR(50),
    bank VARCHAR(50),
    va_number VARCHAR(50),
    payment_metadata JSONB DEFAULT '{}',
    description VARCHAR(500),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    paid_at TIMESTAMP WITH TIME ZONE,
    expired_at TIMESTAMP WITH TIME ZONE
);

-- 8. Messages and Conversations
CREATE TABLE IF NOT EXISTS conversations (
    id SERIAL PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS messages (
    id SERIAL PRIMARY KEY,
    conversation_id INTEGER REFERENCES conversations(id) ON DELETE CASCADE NOT NULL,
    sender_id INTEGER REFERENCES users(id) ON DELETE CASCADE NOT NULL,
    content TEXT NOT NULL,
    subject VARCHAR(255),
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Initial Subscription Plans
INSERT INTO subscription_plans (
    name, 
    tier, 
    description, 
    price_monthly, 
    price_yearly, 
    features, 
    max_documents, 
    max_rfq_per_month,
    ai_diagnostic,
    ai_assistant,
    b2b_matchmaking,
    priority_support,
    white_label,
    api_access,
    is_popular,
    display_order
) VALUES
-- FREE Plan
('Gratis', 'free', 'Untuk usaha kecil yang baru mulai.', 
    0, 0, 
    '["Pencatatan Dasar", "1 Profil Bisnis", "5 Dokumen/Bulan"]'::jsonb,
    5,      -- max_documents
    3,      -- max_rfq_per_month
    false,  -- ai_diagnostic
    false,  -- ai_assistant
    false,  -- b2b_matchmaking
    false,  -- priority_support
    false,  -- white_label
    false,  -- api_access
    false,  -- is_popular
    1       -- display_order
),
-- STARTER Plan
('Starter', 'starter', 'Cocok untuk bisnis berkembang.', 
    50000, 500000, 
    '["Pencatatan Lengkap", "3 Profil Bisnis", "50 Dokumen/Bulan", "Export PDF"]'::jsonb,
    50,     -- max_documents
    10,     -- max_rfq_per_month
    true,   -- ai_diagnostic
    false,  -- ai_assistant
    false,  -- b2b_matchmaking
    false,  -- priority_support
    false,  -- white_label
    true,   -- api_access
    true,   -- is_popular (most popular plan)
    2       -- display_order
),
-- PRO Plan
('Pro', 'pro', 'Dibuat untuk profesional dan UMKM besar.', 
    150000, 1500000, 
    '["Semua Fitur Starter", "Bisnis Tak Terbatas", "Dokumen Tak Terbatas", "Priority Support", "AI Assistant", "B2B Matchmaking"]'::jsonb,
    10000,  -- max_documents (unlimited in practice)
    100,    -- max_rfq_per_month
    true,   -- ai_diagnostic
    true,   -- ai_assistant
    true,   -- b2b_matchmaking
    true,   -- priority_support
    false,  -- white_label
    true,   -- api_access
    false,  -- is_popular
    3       -- display_order
)
ON CONFLICT (tier) DO NOTHING;
