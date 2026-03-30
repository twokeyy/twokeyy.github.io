# 📚 Twocurrial Learning Opportunities

Premium reading & AI learning app — landing page with Billgang/Stripe checkout, Supabase license keys, and email delivery.

## 🗂️ Project Structure

```
twocurrial/
├── index.html          # Landing page
├── style.css           # Styles (dark theme, glassmorphism)
├── script.js           # Interactive effects
├── README.md           # This file
└── server/
    ├── package.json    # Backend dependencies
    ├── index.js        # Express webhook server
    ├── .env            # Your config (DO NOT COMMIT)
    ├── .env.example    # Config template
    └── supabase-schema.sql  # Database schema
```

## 🚀 Quick Setup

### 1. Set Up Supabase Database

1. Go to your [Supabase Dashboard](https://supabase.com/dashboard)
2. Navigate to **SQL Editor → New Query**
3. Paste the contents of `server/supabase-schema.sql`
4. Click **Run** — this creates the `license_keys` table

### 2. Set Up Billgang Products

1. Go to [Billgang Dashboard](https://billgang.com/dashboard)
2. Create 3 products with these slugs:
   - `trial` — Trial (5 days, $4.99 NZD)
   - `pro` — Pro (30 days, $14.99 NZD)
   - `elite` — Elite (30 days, $24.99 NZD)
3. Enable **Stripe** under Shop Settings → Payments
4. Set up a **Webhook** pointing to `https://your-server.com/webhook/billgang`
5. Update `index.html` — replace `YOUR_STORE.bgng.io` with your actual Billgang domain

### 3. Configure Email (Gmail SMTP)

1. Go to [Google App Passwords](https://myaccount.google.com/apppasswords)
2. Generate an app password for "Mail"
3. Update `server/.env`:
   ```
   SMTP_USER=your-email@gmail.com
   SMTP_PASS=your-16-char-app-password
   EMAIL_FROM_ADDRESS=your-email@gmail.com
   ```

### 4. Install & Run Server

```bash
cd server
npm install
npm start
```

The server will start on `http://localhost:3000` and also serve the frontend.

### 5. Deploy

**Frontend**: Deploy to Vercel, Netlify, or GitHub Pages (just the HTML/CSS/JS files).

**Backend**: Deploy to Railway, Render, or Fly.io:
- Set all `.env` variables as environment variables
- Point Billgang webhook URL to your deployed server

## 🔌 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Health check |
| POST | `/webhook/billgang` | Billgang order webhook |
| POST | `/api/verify-key` | Verify a license key |
| POST | `/api/admin/generate-key` | Manually generate a key |

### Verify Key Example
```bash
curl -X POST http://localhost:3000/api/verify-key \
  -H "Content-Type: application/json" \
  -d '{"key": "YOUR-LICENSE-KEY"}'
```

### Manual Key Generation
```bash
curl -X POST http://localhost:3000/api/admin/generate-key \
  -H "Content-Type: application/json" \
  -d '{"email": "user@example.com", "tier": "pro"}'
```

## 🎨 Customization

- **Colors**: Edit CSS variables in `style.css` under `:root`
- **Billgang Domain**: Replace `YOUR_STORE.bgng.io` in `index.html`
- **Pricing**: Update prices in both `index.html` and `server/index.js`

## 📝 License

© 2026 Twocurrial Learning Opportunities. All rights reserved.
