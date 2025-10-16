"""
Seed database with dummy data for testing
"""
import mongoengine
from datetime import datetime, timedelta
from models.user import User
from models.card import Card
from models.transaction import Transaction
from models.bill import Bill
from models.emi import EMI
from models.cibil_score import CibilScore
from models.notification import Notification
import os
from dotenv import load_dotenv
from bson import ObjectId

load_dotenv()

# Connect to MongoDB
mongoengine.connect(
    host=os.environ.get('MONGODB_URI') or 'mongodb+srv://pavankumartm:starkismine@cluster0.ckdyrqx.mongodb.net/ccms_db?retryWrites=true&w=majority',
    db='ccms_db'
)

print("🔌 Connected to MongoDB")

# Get the user (use username 'resool' that was just created)
user = User.objects(username='resool').first()

if not user:
    print("❌ User 'resool' not found. Please sign up first!")
    exit(1)

print(f"✅ Found user: {user.username} (ID: {user.id})")

# Clear existing data for this user
print("\n🗑️  Clearing existing data...")
Card.objects(user_id=user.id).delete()
Transaction.objects(user_id=user.id).delete()
Bill.objects(user_id=user.id).delete()
EMI.objects(user_id=user.id).delete()
CibilScore.objects(user_id=user.id).delete()
Notification.objects(user_id=user.id).delete()
print("✅ Cleared existing data")

# Create Cards
print("\n💳 Creating cards...")
cards = []

card1 = Card.create_card(
    user_id=user.id,
    card_number='4111111111111111',
    card_holder_name=f'{user.first_name} {user.last_name}',
    expiry_month=12,
    expiry_year=2027,
    cvv='123',
    card_type='credit',
    card_brand='VISA',
    card_name='HDFC Millennia',
    credit_limit=150000,
    due_date=5
)
card1.outstanding_balance = 48500
card1.available_credit = 101500
card1.save()
cards.append(card1)
print(f"  ✅ Created: {card1.card_name}")

card2 = Card.create_card(
    user_id=user.id,
    card_number='5500000000000004',
    card_holder_name=f'{user.first_name} {user.last_name}',
    expiry_month=8,
    expiry_year=2026,
    cvv='456',
    card_type='credit',
    card_brand='MASTERCARD',
    card_name='SBI Elite',
    credit_limit=225000,
    due_date=10
)
card2.outstanding_balance = 12800
card2.available_credit = 212200
card2.save()
cards.append(card2)
print(f"  ✅ Created: {card2.card_name}")

card3 = Card.create_card(
    user_id=user.id,
    card_number='6011000000000004',
    card_holder_name=f'{user.first_name} {user.last_name}',
    expiry_month=3,
    expiry_year=2028,
    cvv='789',
    card_type='credit',
    card_brand='RUPAY',
    card_name='ICICI Platinum',
    credit_limit=100000,
    due_date=15
)
card3.outstanding_balance = 0
card3.available_credit = 100000
card3.save()
cards.append(card3)
print(f"  ✅ Created: {card3.card_name}")

# Create Transactions
print("\n💰 Creating transactions...")
merchants = [
    ('Amazon', 'online_shopping', 3499),
    ('Zomato', 'restaurants', 899),
    ('BigBasket', 'groceries', 2599),
    ('Netflix', 'subscriptions', 499),
    ('Flipkart', 'online_shopping', 1299),
    ('Swiggy', 'restaurants', 650),
    ('Uber', 'transportation', 350),
    ('BookMyShow', 'entertainment', 800),
    ('DMart', 'groceries', 1850),
    ('Starbucks', 'restaurants', 425),
]

for i, (merchant, category, amount) in enumerate(merchants):
    card = cards[i % len(cards)]
    tx_date = datetime.utcnow() - timedelta(days=i*2)
    
    tx = Transaction.create_transaction(
        user_id=user.id,
        card_id=card.id,
        transaction_id=f'TXN{100000 + i}',
        merchant_name=merchant,
        merchant_category=category,
        amount=amount,
        description=f'Purchase at {merchant}',
        transaction_type='debit',
        location='Bangalore, IN'
    )
    tx.transaction_date = tx_date
    tx.status = 'completed'
    tx.save()
    print(f"  ✅ {merchant}: ₹{amount}")

# Create Bills
print("\n📄 Creating bills...")
bills_data = [
    ('Electricity', 'utilities', 'utility', 4500, 5),
    ('Internet - Airtel', 'utilities', 'internet', 999, 3),
    ('Mobile - Jio', 'utilities', 'mobile', 399, 7),
    ('Water Bill', 'utilities', 'utility', 850, 10),
]

for biller, category, bill_type, amount, due_days in bills_data:
    bill = Bill.create_bill(
        user_id=user.id,
        card_id=cards[0].id,
        bill_id=f'BILL{datetime.now().microsecond}',
        biller_name=biller,
        biller_category=category,
        bill_type=bill_type,
        amount=amount,
        due_date=datetime.utcnow() + timedelta(days=due_days),
        bill_number=f'BN{100000 + due_days}',
        is_recurring=True,
        recurring_frequency='monthly'
    )
    bill.save()
    print(f"  ✅ {biller}: ₹{amount} (Due in {due_days} days)")

# Create EMIs
print("\n🏦 Creating EMIs...")
emi1 = EMI.create_emi(
    user_id=user.id,
    card_id=cards[0].id,
    emi_id='EMI10001',
    principal_amount=24000,
    interest_rate=12.5,
    tenure_months=12,
    start_date=datetime.utcnow() - timedelta(days=180),
    description='iPhone 15 Pro',
    merchant_name='Apple Store',
    product_name='iPhone 15 Pro 256GB'
)
emi1.total_paid = 12000
emi1.remaining_amount = 12000
emi1.save()
print(f"  ✅ iPhone EMI: ₹{emi1.emi_amount}/month for {emi1.tenure_months} months")

emi2 = EMI.create_emi(
    user_id=user.id,
    card_id=cards[1].id,
    emi_id='EMI10002',
    principal_amount=15000,
    interest_rate=10.0,
    tenure_months=6,
    start_date=datetime.utcnow() - timedelta(days=90),
    description='Sony Headphones WH-1000XM5',
    merchant_name='Croma',
    product_name='Sony WH-1000XM5'
)
emi2.total_paid = 7500
emi2.remaining_amount = 7500
emi2.save()
print(f"  ✅ Headphones EMI: ₹{emi2.emi_amount}/month for {emi2.tenure_months} months")

# Create CIBIL Score
print("\n📊 Creating CIBIL score...")
cibil = CibilScore.create_cibil_score(
    user_id=user.id,
    score=745,
    score_date=datetime.utcnow(),
    score_type='cibil',
    payment_history_score=85,
    credit_utilization_score=75,
    credit_age_score=70,
    credit_mix_score=80,
    new_credit_score=65
)
cibil.total_accounts = 5
cibil.active_accounts = 3
cibil.closed_accounts = 2
cibil.total_credit_limit = 475000
cibil.total_outstanding = 61300
cibil.late_payments = 0
cibil.missed_payments = 0
cibil.is_current = True
cibil.save()
print(f"  ✅ CIBIL Score: {cibil.score}")

# Create Notifications
print("\n🔔 Creating notifications...")
notifications_data = [
    ('Bill Due Soon', 'Your electricity bill of ₹4,500 is due in 5 days', 'bill', 'high', False),
    ('Payment Successful', 'Payment of ₹899 to Zomato was successful', 'transaction', 'medium', True),
    ('New Offer', '10% cashback on groceries this weekend!', 'promotional', 'low', False),
    ('EMI Due', 'Your iPhone EMI of ₹2,150 is due on 20th Oct', 'emi', 'high', False),
    ('CIBIL Score Updated', 'Your CIBIL score has been updated to 745', 'system', 'medium', True),
]

for i, (title, message, notif_type, priority, is_read) in enumerate(notifications_data):
    notif = Notification.create_notification(
        user_id=user.id,
        title=title,
        message=message,
        notification_type=notif_type,
        priority=priority,
        channels=['in_app']
    )
    if is_read:
        notif.mark_as_read()
    notif.save()
    print(f"  ✅ {title}")

print("\n" + "="*60)
print("🎉 DATABASE SEEDED SUCCESSFULLY!")
print("="*60)
print(f"""
Summary:
  👤 User: {user.username}
  💳 Cards: {len(cards)}
  💰 Transactions: {len(merchants)}
  📄 Bills: {len(bills_data)}
  🏦 EMIs: 2
  📊 CIBIL Score: {cibil.score}
  🔔 Notifications: {len(notifications_data)}

Now login with:
  Username: {user.username}
  Password: (your password)

Dashboard URL: http://localhost:5173/dashboard
""")
print("="*60)

