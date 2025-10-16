# 💳 CREDA - Credit Card Management System

**A comprehensive full-stack credit card management platform with real-time transaction tracking, bill payments, EMI management, and AI-powered financial insights.**

---

## 🌟 About the App

**CREDA** is a modern, feature-rich credit card management system designed to help users manage their credit cards, track transactions, pay bills, manage EMIs, and monitor their CIBIL score - all from one unified platform.

### ✨ Key Features

#### 💳 **Card Management**
- View all credit cards at a glance
- Add new cards with detailed information
- Block/unblock cards instantly
- Update PIN securely
- Track available credit and outstanding balances
- Support for VISA, Mastercard, and RuPay

#### 📊 **Transaction Tracking**
- Real-time transaction history
- Filter by date, merchant, category
- Search transactions
- Download statements (PDF/Excel)
- Transaction categorization (Shopping, Food, Groceries, Travel, etc.)
- Interactive spending charts and analytics

#### 💰 **Bill Payments**
- Manage utility bills (Electricity, Internet, Mobile, Water)
- Pay bills using any linked card
- Auto-pay setup for recurring bills
- Bill due date reminders
- Payment history tracking

#### 📈 **EMI Management**
- Active EMI tracking
- EMI calculator
- Payment schedule visualization
- Auto-pay EMI option
- EMI summary and progress tracking

#### 🎯 **CIBIL Score**
- Real-time CIBIL score monitoring (Current Score: **745**)
- Score trend analysis
- Credit utilization tracking
- Personalized improvement suggestions
- Detailed credit report breakdown

#### 🎁 **Rewards & Redeems**
- Browse reward catalog
- Redeem points for vouchers
- Track redemption history
- Filter rewards by category

#### 🔔 **Smart Notifications**
- Bill payment reminders
- Transaction alerts
- EMI due notifications
- Card expiry alerts
- Security notifications

#### 🤖 **AI Chatbot** (Optional - requires Gemini API key)
- Financial advice
- Transaction queries
- Budget planning assistance
- Credit score tips

---

## 🚀 How to Run the App

### Prerequisites
- **Python 3.11+** (Backend)
- **Node.js 18+** (Frontend)
- **MongoDB Atlas** (Database - already configured and connected)

---

### 🎯 Quick Start (Recommended)

The easiest way to run both frontend and backend together:

```bash
# Navigate to the project directory
cd /Users/pavankumar/Documents/app

# Run the startup script
./start-dev.sh
```

This will automatically:
- ✅ Start the Flask backend on `http://localhost:5001`
- ✅ Start the React frontend on `http://localhost:5173`
- ✅ Open both in separate terminal windows

---

### 🔧 Manual Setup (Alternative)

If you prefer to run servers separately:

#### **Step 1: Install Dependencies** (First time only)

**Backend:**
```bash
cd backend
pip install -r requirements.txt
```

**Frontend:**
```bash
cd frontend
npm install
```

#### **Step 2: Start Backend Server**

Open **Terminal 1** and run:
```bash
cd backend
python app.py
```

You should see:
```
🚀 Flask Backend Starting...
📍 URL: http://127.0.0.1:5001
📊 Health Check: http://127.0.0.1:5001/health
```

#### **Step 3: Start Frontend Server**

Open **Terminal 2** and run:
```bash
cd frontend
npm run dev
```

You should see:
```
VITE v5.x.x ready in xxx ms
➜ Local:   http://localhost:5173/
```

---

### 🌐 Access the Application

Once both servers are running:

1. Open your browser
2. Go to: **http://localhost:5173**
3. You'll see the CREDA login page

---

### 🔐 Login with Demo Account

Use these credentials to explore the app with pre-populated data:

```
Username: resool
Password: Pavan@123
```

---

### ✅ Verify Everything is Running

**Backend Health Check:**
```bash
curl http://localhost:5001/health
```

Expected response:
```json
{
  "status": "healthy",
  "database": "connected",
  "message": "Flask backend with MongoDB is running"
}
```

**Frontend:**
- Open `http://localhost:5173` in your browser
- You should see the CREDA home page

---

### 🛑 Stop the Application

**If using `start-dev.sh`:**
- Press `Ctrl+C` in each terminal window

**If running manually:**
- Press `Ctrl+C` in the backend terminal
- Press `Ctrl+C` in the frontend terminal

---

### 📊 What's Included in the Demo Account

The `resool` account comes pre-populated with:
- ✅ **3 Credit Cards** - HDFC Millennia, SBI Elite, ICICI Platinum
- ✅ **10 Sample Transactions** - Amazon, Zomato, Netflix, Flipkart, etc.
- ✅ **4 Pending Bills** - Electricity (₹4,500), Internet (₹999), Mobile (₹399), Water (₹850)
- ✅ **2 Active EMIs** - iPhone 15 Pro (₹2,137/mo), Sony Headphones (₹2,573/mo)
- ✅ **CIBIL Score** - 745 (Very Good)
- ✅ **5 Notifications** - Bill reminders, transaction alerts, offers

---

## 🛠️ Tech Stack

### **Frontend**
- **React 18** - UI Framework
- **TypeScript** - Type Safety
- **Vite** - Build Tool
- **TailwindCSS** - Styling
- **Framer Motion** - Animations
- **Recharts** - Data Visualization
- **Axios** - HTTP Client
- **React Router** - Navigation
- **React Query** - Data Fetching

### **Backend**
- **Flask** - Python Web Framework
- **MongoDB** - NoSQL Database
- **MongoEngine** - ODM
- **JWT** - Authentication
- **Flask-CORS** - Cross-Origin Support
- **Google Gemini API** - AI Chatbot (Optional)

---

## 📂 Project Structure

```
app/
├── backend/                # Flask Backend
│   ├── models/            # Database Models
│   ├── routes/            # API Routes
│   ├── utils/             # Helper Functions
│   ├── app.py             # Main Application
│   ├── config.py          # Configuration
│   ├── requirements.txt   # Python Dependencies
│   └── seed_data.py       # Database Seeding Script
│
├── frontend/              # React Frontend
│   ├── src/
│   │   ├── components/   # Reusable Components
│   │   ├── pages/        # Page Components
│   │   ├── hooks/        # Custom React Hooks
│   │   ├── context/      # Context Providers
│   │   ├── services/     # API Services
│   │   └── utils/        # Utility Functions
│   ├── package.json      # Node Dependencies
│   └── vite.config.ts    # Vite Configuration
│
└── start-dev.sh          # Quick Start Script
```

---

## 🌐 API Endpoints

The backend exposes the following REST APIs:

| Category | Endpoint | Method | Description |
|----------|----------|--------|-------------|
| **Auth** | `/api/users/signup` | POST | User Registration |
| | `/api/users/login` | POST | User Login |
| | `/api/users/me` | GET | Get Current User |
| **Cards** | `/api/cards` | GET | List All Cards |
| | `/api/cards` | POST | Add New Card |
| | `/api/cards/:id/block` | POST | Block Card |
| | `/api/cards/:id/unblock` | POST | Unblock Card |
| **Transactions** | `/api/transactions` | GET | List Transactions |
| | `/api/transactions` | POST | Create Transaction |
| **Bills** | `/api/bills` | GET | List Bills |
| | `/api/bills/:id/pay` | POST | Pay Bill |
| **EMIs** | `/api/emis` | GET | List EMIs |
| | `/api/emis/summary` | GET | EMI Summary |
| **CIBIL** | `/api/cibil/current` | GET | Current Score |
| | `/api/cibil/trend` | GET | Score Trend |

---

## 💡 Features Implemented

### ✅ **Completed**
- [x] User Authentication (Signup/Login)
- [x] JWT Token Management
- [x] Protected Routes
- [x] Credit Card CRUD Operations
- [x] Transaction Management
- [x] Bill Payment System
- [x] EMI Calculator & Tracking
- [x] CIBIL Score Monitoring
- [x] Real-time Notifications
- [x] Reward Catalog
- [x] Interactive Charts & Analytics
- [x] Responsive Design
- [x] Dark Theme UI
- [x] Search & Filter Functionality
- [x] Data Export (PDF/Excel)

### 🔮 **Future Enhancements**
- [ ] Multi-currency Support
- [ ] Expense Budget Planning
- [ ] Investment Tracking
- [ ] Tax Calculation
- [ ] Mobile App (React Native)
- [ ] Voice Commands
- [ ] Biometric Authentication
- [ ] Bank Account Integration

---

## 🎨 Screenshots & Features

### **Dashboard**
- Overview of all cards, transactions, and bills
- CIBIL score at a glance
- Quick actions (Add Card, Pay Bill, View CIBIL)
- Spending tracker with charts
- Recent transactions and notifications

### **My Cards**
- Visual card display with brand colors
- Card details (number, expiry, CVV)
- Available credit vs. outstanding balance
- Quick actions (Block, Update PIN, View Details)

### **Transactions**
- Searchable transaction list
- Filter by date, merchant, category
- Transaction details modal
- Download statements
- Pagination support

### **Bill Payments**
- Upcoming bills dashboard
- One-click payment
- Auto-pay toggle
- Payment history

### **EMI Manager**
- Active EMI list
- EMI calculator
- Payment schedule
- Progress tracking

---

## 🔧 Configuration

### **Backend Configuration** (`backend/config.py`)
- MongoDB connection string (Already configured)
- JWT secret keys
- Session timeout settings
- API rate limiting

### **Frontend Configuration** (`frontend/.env`)
```env
VITE_API_BASE_URL=http://localhost:5001/api
VITE_APP_NAME=Creda
```

---

## 🐛 Troubleshooting

### **Port Conflicts**
If port 5001 is already in use:
```bash
# Find the process
lsof -i :5001

# Kill the process
kill -9 <PID>
```

### **Navigation Issues**
If clicking buttons doesn't navigate:
- Try **hard refresh**: `Ctrl+Shift+R` (Windows/Linux) or `Cmd+Shift+R` (Mac)

### **Charts Not Showing**
- Ensure you have transactions in the database
- Check browser console for errors
- Refresh the page

---

## 📝 Important Notes

1. **Security**: This is a demo application. In production:
   - Use environment variables for secrets
   - Enable HTTPS
   - Implement rate limiting
   - Add input validation
   - Use secure password hashing

2. **Database**: The MongoDB connection is already configured and populated with demo data

3. **API Keys**: The AI chatbot requires a Google Gemini API key. It's optional and doesn't affect other features.

4. **Browser**: For the best experience, use the latest version of Chrome, Firefox, or Edge

---

## 📜 License

This project is created for educational and demonstration purposes.

---

## 🤝 Support

For any issues or questions:
1. Check the browser console for errors
2. Check the backend terminal for API errors
3. Try refreshing the page with `Ctrl+Shift+R`
4. Restart both servers

---

## 🎉 Enjoy Managing Your Credit Cards with CREDA!

**Happy Banking! 💳✨**
# Credit-Card-Management-System
