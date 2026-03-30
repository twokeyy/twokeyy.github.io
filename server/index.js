/**
 * ============================================
 * Twocurrial Learning Opportunities
 * Backend Webhook Server
 * ============================================
 * 
 * Handles:
 * 1. Billgang webhook on order completion
 * 2. License key generation (UUID)
 * 3. Key storage in Supabase
 * 4. Email delivery with license key
 */

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');
const nodemailer = require('nodemailer');
const { v4: uuidv4 } = require('uuid');
const path = require('path');

// --- Initialize Express ---
const app = express();
app.use(cors());
app.use(express.json());

// Serve the frontend (static files from parent directory)
app.use(express.static(path.join(__dirname, '..')));

const PORT = process.env.PORT || 3000;

// --- Initialize Supabase ---
const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_KEY
);

// --- Initialize Email Transporter ---
const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT),
    secure: false, // true for 465, false for 587
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
});

// --- Tier Configuration ---
const TIER_CONFIG = {
    trial: {
        name: 'Trial',
        durationDays: 5,
        booksPerDay: 3,
        price: '$4.99 NZD',
    },
    pro: {
        name: 'Pro',
        durationDays: 30,
        booksPerDay: 5,
        price: '$14.99 NZD',
    },
    elite: {
        name: 'Elite',
        durationDays: 30,
        booksPerDay: 7,
        price: '$24.99 NZD',
    },
};

// --- Generate License Key (XXXX-XXXX-XXXX-XXXX format) ---
function generateLicenseKey() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    const segment = () => Array.from({ length: 4 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
    return `${segment()}-${segment()}-${segment()}-${segment()}`;
}

// --- Calculate Expiry Date ---
function getExpiryDate(durationDays) {
    const now = new Date();
    now.setDate(now.getDate() + durationDays);
    return now.toISOString();
}

// --- Build Email HTML ---
function buildEmailHTML(licenseKey, tier, tierConfig) {
    return `
<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: #0a0a1a; color: #f0f0ff; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 0 auto; padding: 40px 24px; }
        .header { text-align: center; margin-bottom: 32px; }
        .header h1 { font-size: 28px; margin: 0; background: linear-gradient(135deg, #8b5cf6, #3b82f6, #06b6d4); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
        .header p { color: #8888aa; margin-top: 8px; }
        .card { background: rgba(15, 15, 35, 0.9); border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 16px; padding: 32px; margin-bottom: 24px; }
        .badge { display: inline-block; padding: 6px 16px; border-radius: 999px; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 16px; }
        .badge-trial { background: rgba(139, 92, 246, 0.2); color: #8b5cf6; }
        .badge-pro { background: rgba(139, 92, 246, 0.2); color: #a78bfa; }
        .badge-elite { background: rgba(245, 158, 11, 0.2); color: #f59e0b; }
        .key-box { background: rgba(139, 92, 246, 0.1); border: 1px dashed rgba(139, 92, 246, 0.3); border-radius: 12px; padding: 20px; text-align: center; margin: 20px 0; }
        .key-label { font-size: 12px; color: #8888aa; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 8px; }
        .key-value { font-size: 22px; font-weight: 700; font-family: 'Courier New', monospace; letter-spacing: 0.05em; color: #f0f0ff; word-break: break-all; }
        .details { margin-top: 20px; }
        .detail-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid rgba(255, 255, 255, 0.04); font-size: 14px; }
        .detail-label { color: #8888aa; }
        .detail-value { color: #f0f0ff; font-weight: 600; }
        .instructions { background: rgba(16, 185, 129, 0.08); border: 1px solid rgba(16, 185, 129, 0.15); border-radius: 12px; padding: 24px; }
        .instructions h3 { color: #10b981; font-size: 16px; margin-bottom: 12px; }
        .instructions ol { color: #8888aa; padding-left: 20px; }
        .instructions li { margin-bottom: 8px; font-size: 14px; }
        .footer { text-align: center; margin-top: 32px; color: #555570; font-size: 12px; }
        .discord-link { display: inline-block; margin-top: 16px; padding: 10px 24px; background: linear-gradient(135deg, #5865F2, #7289da); color: white; text-decoration: none; border-radius: 999px; font-weight: 600; font-size: 14px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>📚 Twocurrial Learning Opportunities</h1>
            <p>Thank you for your purchase!</p>
        </div>
        <div class="card">
            <span class="badge badge-${tier}">${tierConfig.name} Plan</span>
            <p style="color: #8888aa; font-size: 14px;">Your license key has been generated and is ready to use.</p>
            
            <div class="key-box">
                <div class="key-label">Your License Key</div>
                <div class="key-value">${licenseKey}</div>
            </div>

            <div class="details">
                <div class="detail-row">
                    <span class="detail-label">Plan</span>
                    <span class="detail-value">${tierConfig.name}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Duration</span>
                    <span class="detail-value">${tierConfig.durationDays} days</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Books per Day</span>
                    <span class="detail-value">${tierConfig.booksPerDay}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Price</span>
                    <span class="detail-value">${tierConfig.price}</span>
                </div>
            </div>
        </div>

        <div class="instructions">
            <h3>🚀 Getting Started</h3>
            <ol>
                <li>Download the app files attached to your Billgang order</li>
                <li>Extract <code>run.py</code> and <code>launch_browser.bat</code></li>
                <li>Run <code>launch_browser.bat</code> to start the app</li>
                <li>Enter your license key when prompted</li>
                <li>Enjoy Twocurrial Learning!</li>
            </ol>
        </div>

        <div class="footer">
            <p>Need help? Join our Discord community!</p>
            <a href="https://discord.gg/gzGSMnKhnP" class="discord-link">Join Discord</a>
            <p style="margin-top: 20px;">© 2026 Twocurrial Learning Opportunities</p>
        </div>
    </div>
</body>
</html>
    `;
}

// ============================================
// ROUTES
// ============================================

// --- Health Check ---
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', service: 'Twocurrial Webhook Server', timestamp: new Date().toISOString() });
});

// --- Billgang Webhook Endpoint ---
app.post('/webhook/billgang', async (req, res) => {
    try {
        console.log('📬 Webhook received:', JSON.stringify(req.body, null, 2));

        const payload = req.body;

        // Billgang sends different event types - we care about order completion
        // Adjust field names based on actual Billgang webhook payload structure
        const customerEmail = payload.customer_email 
            || payload.email 
            || payload?.customer?.email
            || payload?.data?.customer_email
            || payload?.data?.email;

        const productId = payload.product_id 
            || payload.product_path 
            || payload?.data?.product_id
            || payload?.data?.product_path
            || '';

        const orderId = payload.order_id 
            || payload.id 
            || payload?.data?.order_id 
            || payload?.data?.id
            || uuidv4();

        if (!customerEmail) {
            console.error('❌ No customer email found in webhook payload');
            return res.status(400).json({ error: 'No customer email in payload' });
        }

        // Determine tier from product path/ID
        let tier = 'trial'; // default
        const productStr = productId.toString().toLowerCase();
        if (productStr.includes('elite')) {
            tier = 'elite';
        } else if (productStr.includes('pro')) {
            tier = 'pro';
        } else if (productStr.includes('trial')) {
            tier = 'trial';
        }

        const tierConfig = TIER_CONFIG[tier];

        // Generate license key
        const licenseKey = generateLicenseKey();
        const expiresAt = getExpiryDate(tierConfig.durationDays);

        console.log(`🔑 Generating ${tier} key for ${customerEmail}: ${licenseKey}`);

        // Store in Supabase
        const { data, error: dbError } = await supabase
            .from('keys')
            .insert({
                key: licenseKey,
                tier: tier,
                email: customerEmail,
                order_id: orderId.toString(),
                is_active: true,
                expires_at: expiresAt,
                books_read_today: 0,
                rp_username: payload.customer_name || 'Customer',
                metadata: {
                    books_per_day: tierConfig.booksPerDay,
                    price: tierConfig.price,
                    webhook_payload: payload,
                },
            })
            .select();

        if (dbError) {
            console.error('❌ Supabase error:', dbError);
            return res.status(500).json({ error: 'Failed to store license key', details: dbError.message });
        }

        console.log('✅ Key stored in Supabase:', data);

        // Send email
        try {
            const emailResult = await transporter.sendMail({
                from: `"${process.env.EMAIL_FROM_NAME}" <${process.env.EMAIL_FROM_ADDRESS}>`,
                to: customerEmail,
                subject: `🔑 Your Twocurrial ${tierConfig.name} License Key`,
                html: buildEmailHTML(licenseKey, tier, tierConfig),
            });

            console.log('📧 Email sent:', emailResult.messageId);
        } catch (emailErr) {
            console.error('⚠️ Email sending failed (key was still stored):', emailErr.message);
            // Don't fail the webhook — key is stored, email can be resent
        }

        res.status(200).json({
            success: true,
            message: 'License key generated and email sent',
            tier: tier,
            email: customerEmail,
        });

    } catch (err) {
        console.error('💥 Webhook error:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// --- Verify License Key (optional API for your app) ---
app.post('/api/verify-key', async (req, res) => {
    try {
        const { key } = req.body;

        if (!key) {
            return res.status(400).json({ valid: false, error: 'No key provided' });
        }

        const { data, error } = await supabase
            .from('keys')
            .select('*')
            .eq('key', key.toUpperCase())
            .eq('is_active', true)
            .single();

        if (error || !data) {
            return res.json({ valid: false, error: 'Invalid or inactive key' });
        }

        // Check expiry
        if (new Date(data.expires_at) < new Date()) {
            // Mark as inactive
            await supabase
                .from('keys')
                .update({ is_active: false })
                .eq('id', data.id);

            return res.json({ valid: false, error: 'Key has expired' });
        }

        return res.json({
            valid: true,
            tier: data.tier,
            expires_at: data.expires_at,
            books_per_day: data.metadata?.books_per_day || 3,
        });

    } catch (err) {
        console.error('Key verification error:', err);
        res.status(500).json({ valid: false, error: 'Server error' });
    }
});

// --- Manual Key Generation (admin endpoint — protect in production!) ---
app.post('/api/admin/generate-key', async (req, res) => {
    try {
        const { email, tier } = req.body;

        if (!email || !tier || !TIER_CONFIG[tier]) {
            return res.status(400).json({ error: 'Invalid email or tier' });
        }

        const tierConfig = TIER_CONFIG[tier];
        const licenseKey = generateLicenseKey();
        const expiresAt = getExpiryDate(tierConfig.durationDays);

        const { data, error } = await supabase
            .from('keys')
            .insert({
                key: licenseKey,
                tier,
                email,
                rp_username: req.body.rp_username || 'Manual Admin',
                order_id: `manual-${uuidv4().slice(0, 8)}`,
                is_active: true,
                expires_at: expiresAt,
                books_read_today: 0,
                metadata: {
                    books_per_day: tierConfig.booksPerDay,
                    price: tierConfig.price,
                    generated_manually: true,
                },
            })
            .select();

        if (error) {
            return res.status(500).json({ error: 'Failed to generate key', details: error.message });
        }

        // Send email
        try {
            await transporter.sendMail({
                from: `"${process.env.EMAIL_FROM_NAME}" <${process.env.EMAIL_FROM_ADDRESS}>`,
                to: email,
                subject: `🔑 Your Twocurrial ${tierConfig.name} License Key`,
                html: buildEmailHTML(licenseKey, tier, tierConfig),
            });
        } catch (emailErr) {
            console.error('Email failed:', emailErr.message);
        }

        res.json({ success: true, license_key: licenseKey, tier, expires_at: expiresAt });

    } catch (err) {
        console.error('Admin generate error:', err);
        res.status(500).json({ error: 'Server error' });
    }
});

// --- Start Server ---
app.listen(PORT, () => {
    console.log('');
    console.log('  ╔══════════════════════════════════════════════╗');
    console.log('  ║  📚 Twocurrial Learning Opportunities       ║');
    console.log('  ║  Webhook Server                              ║');
    console.log(`  ║  Running on http://localhost:${PORT}             ║`);
    console.log('  ╚══════════════════════════════════════════════╝');
    console.log('');
    console.log('  Endpoints:');
    console.log(`  → GET  http://localhost:${PORT}/api/health`);
    console.log(`  → POST http://localhost:${PORT}/webhook/billgang`);
    console.log(`  → POST http://localhost:${PORT}/api/verify-key`);
    console.log(`  → POST http://localhost:${PORT}/api/admin/generate-key`);
    console.log('');
});
