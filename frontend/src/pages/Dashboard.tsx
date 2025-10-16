// DashboardPolished.tsx
import React, { useMemo, useState, useEffect } from "react";
import Navbar2 from "../components/Navbar2";
import AIInsights from "../components/AiInsights";
import SpendingTracker from "../components/SpendingTracker";
import RedeemsPanel from "../components/RedeemsPanel";
import CardsGrid, { CardType } from "../components/CardsGrid";
import PendingBillsList from "../components/PendingBillsList";
import TransactionsQuickList from "../components/TransactionsQuickList";
import PaymentModal from "../components/PaymentModal";
import EMIModal from "../components/EMIModal";
import { useToast } from "@/hooks/useToast";
import { motion } from "framer-motion";
import { DollarSign, PieChart } from "lucide-react";
import HeaderSummaryGrid from "@/components/HeaderSummaryGrid";
import TopMetricsPanel from "@/components/TopMetricsPanel";
import QuickActionsBar from "@/components/QuickActionsBar";
import Chatbot from "@/components/Chatbot";
import { AnimatedBackground } from "./AnimatedBackground";
import { useNavigate } from "react-router-dom";
import { useCards } from "@/hooks/useCards";
import { useTransactions } from "@/hooks/useTransactions";
import { useBills } from "@/hooks/useBills";
import { useEMIs } from "@/hooks/useEMIs";
import { useCibilScore } from "@/hooks/useCibilScore";
import { useNotifications } from "@/hooks/useNotifications";
import { useAuth } from "@/context/AuthContext";
import Sidebar from "../components/layout/Sidebar";
import NoticeBanner from "../components/NoticeBanner";

type Card = {
  id: string | number;
  title: string;
  subtitle?: string;
  number: string;
  limit?: string;
  outstanding?: string;
  expiry?: string; // e.g. "08/27"
  cvv?: string; // e.g. "123"
  brand?: string;
  secret?: boolean; // true = masked
};
/**
 * DashboardPolished.tsx
 * - Single-level, vertical flow
 * - Cleaner spacing and balanced sections
 * - Uses existing components (Navbar2, AIInsights, SpendingTracker, RedeemsPanel...)
 *
 * Drop into your project and mount at /dashboard
 */


function MyCards({
  cards,
  fadeUp,
  toggleSecret,
  onPayCard,
  onConvertEMI,
}: {
  cards: Card[];
  fadeUp?: any;
  toggleSecret: (id: string | number) => void;
  onPayCard: (c: Card) => void;
  onConvertEMI: (c: Card) => void;
}) {
  const gradients = [
    "linear-gradient(135deg, rgba(10,10,10,0.95) 0%, rgba(30,30,30,0.9) 60%), linear-gradient(135deg,#fbbf24 0%, rgba(255,255,255,0.06) 100%)",
    "linear-gradient(135deg, rgba(5,5,5,0.96) 0%, rgba(25,25,25,0.9) 60%), linear-gradient(135deg,#f59e0b 0%, rgba(255,255,255,0.04) 100%)",
    "linear-gradient(135deg, rgba(12,12,12,0.96) 0%, rgba(40,40,40,0.9) 60%), linear-gradient(135deg,#facc15 0%, rgba(255,255,255,0.03) 100%)",
    "linear-gradient(135deg, rgba(8,8,8,0.96) 0%, rgba(28,28,28,0.9) 60%), linear-gradient(135deg,#ffb703 0%, rgba(255,255,255,0.03) 100%)",
  ];
  const navigate = useNavigate();
  const stripePattern =
    "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='40' height='40' viewBox='0 0 40 40'><g fill='%23000000' fill-opacity='0.03'><rect width='40' height='40' /></g><path d='M-2 2 L2 -2 M6 14 L10 10 M18 22 L22 18 M30 30 L34 26' stroke='%23ffffff' stroke-opacity='0.02' stroke-width='2'/></svg>\")";

  return (
    <motion.section {...fadeUp}>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-bold text-white">My Cards</h2>
        <div className="text-sm text-gray-400">Stylish & swipeable</div>
      </div>

      <div className="rounded-2xl bg-black/70 border border-gray-800 p-5 overflow-x-auto scrollbar-thin scrollbar-thumb-gray-700">
        <div className="flex gap-8 pb-6">
          {cards.map((c, index) => {
            const gradient = gradients[index % gradients.length];
            return (
              <motion.div
                key={c.id}
                whileHover={{ scale: 1.04, y: -8 }}
                transition={{ type: "spring", stiffness: 240 }}
                className="relative w-[440px] h-[240px] flex-shrink-0 rounded-2xl p-6 shadow-2xl text-white overflow-hidden"
                style={{
                  background: gradient,
                  backgroundImage: `${gradient}, ${stripePattern}`,
                  backgroundBlendMode: "overlay,normal",
                }}
              >
                {/* subtle glowing accent */}
                <div
                  className="absolute -left-8 -top-12 w-56 h-56 rounded-full opacity-10"
                  style={{
                    background:
                      "radial-gradient(ellipse at center, rgba(250,204,21,0.15), transparent 50%)",
                  }}
                  onClick={() => navigate(`/card/${c.id}`)}
                />

                {/* Header Row */}
                <div className="flex items-start justify-between">
                  <div>
                    <div className="text-xs tracking-widest text-gray-300/80">
                      CREDIT CARD
                    </div>
                    <div className="text-lg font-semibold mt-1">{c.title}</div>
                    <div className="text-sm text-gray-300/90 mt-1">
                      {c.subtitle}
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleSecret(c.id);
                      }}
                      className="p-1 rounded-md bg-black/30 hover:bg-black/20"
                    >
                      {c.secret ? (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 text-yellow-400"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.5"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M13.875 18.825A10.05 10.05 0 0 1 12 19.5C7.305 19.5 3.373 16.36 1.5 12c.85-2.124 2.17-3.98 3.86-5.34M9.88 9.88A3 3 0 1 0 14.12 14.12"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M3 3l18 18"
                          />
                        </svg>
                      ) : (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 text-yellow-400"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.5"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"
                          />
                        </svg>
                      )}
                    </button>

                    <div className="text-xs text-gray-200/70 font-medium">
                      {c.brand ?? ""}
                    </div>
                  </div>
                </div>

                {/* Middle Row: number + exp/cvv */}
                <div className="mt-8 flex items-end justify-between">
                  <div className="font-mono text-2xl tracking-widest">
                    {c.secret ? "**** **** **** ****" : c.number}
                  </div>

                  <div className="text-right text-sm">
                    <div className="text-xs text-gray-400">EXP / CVV</div>
                    <div className="font-semibold mt-1 tracking-wider">
                      {c.expiry ?? "--/--"}{" "}
                      <span className="ml-3 text-gray-400">
                        {c.secret ? "***" : c.cvv ?? ""}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Bottom Row */}
                <div className="absolute bottom-5 left-6 right-6 flex items-center justify-between text-sm">
                  <div>
                    <div className="text-xs text-gray-400">Limit</div>
                    <div className="font-semibold">{c.limit}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-gray-400">Outstanding</div>
                    <div className="font-semibold text-yellow-300">
                      {c.outstanding}
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </motion.section>
  );
}

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { show } = useToast();

  console.log('🎯 Dashboard component mounted/rendered');

  // Real API data hooks - MUST be called before any conditional returns
  const { cards: apiCards, loading: cardsLoading } = useCards();
  const { transactions: apiTransactions, loading: transactionsLoading } = useTransactions({ per_page: 5 });
  const { bills: apiBills, loading: billsLoading } = useBills({ per_page: 5, status: 'pending' });
  const { emis: apiEmis, getEMISummary } = useEMIs();
  const { currentScore } = useCibilScore();
  const { notifications: apiNotifications } = useNotifications({ per_page: 5, unread_only: true });

  // All useState hooks MUST be here before any returns
  const [cards, setCards] = useState<Card[]>([]);
  const [emiSummary, setEmiSummary] = useState({ active: 0, remaining: 0 });
  const [openPayment, setOpenPayment] = useState(false);
  const [openEMI, setOpenEMI] = useState(false);
  const [selectedCard, setSelectedCard] = useState<Card | null>(null);

  useEffect(() => {
    if (apiCards && apiCards.length > 0) {
      const transformedCards = apiCards.map((card: any) => ({
        id: card.id || card._id,
        title: card.title || card.card_name || 'Credit Card',
        subtitle: card.subtitle || `${card.card_type || ''} ${card.card_brand || ''}`.trim() || 'Card',
        number: card.number || `**** **** **** ${card.card_number?.slice(-4) || '****'}`,
        limit: card.limit || `₹${card.credit_limit?.toLocaleString('en-IN') || '0'}`,
        outstanding: card.outstanding || `₹${card.outstanding_balance?.toLocaleString('en-IN') || '0'}`,
        expiry: card.expiry_month && card.expiry_year ? `${String(card.expiry_month).padStart(2, '0')}/${String(card.expiry_year).slice(-2)}` : '--/--',
        cvv: '***',
        brand: card.card_brand || '',
        secret: true,
      }));
      setCards(transformedCards);
    }
  }, [apiCards]);

  // Get EMI summary
  useEffect(() => {
    if (apiEmis && apiEmis.length > 0) {
      const activeEmis = apiEmis.filter((e: any) => e.status === 'active').length;
      const totalRemaining = apiEmis.reduce((sum: number, e: any) => sum + (e.remaining_amount || 0), 0);
      setEmiSummary({ active: activeEmis, remaining: totalRemaining });
    } else {
      // Fallback to API call if hook doesn't have data
      getEMISummary?.().then((summary: any) => {
        setEmiSummary({
          active: summary.active_emis || 0,
          remaining: summary.total_remaining || 0,
        });
      }).catch(() => { });
    }
  }, [apiEmis, getEMISummary]);

  const bills = apiBills.map((b: any) => ({
    id: b.id || b._id,
    title: b.title || b.biller_name || 'Bill',
    amount: typeof b.amount === 'string' ? b.amount : `₹${b.amount?.toLocaleString('en-IN') || '0'}`,
    dueDate: b.dueDate || b.due_date || new Date().toISOString().split('T')[0],
  }));

  const notifications = apiNotifications.map((n: any) => ({
    id: n.id || n._id,
    title: n.title || '',
    body: n.body || n.message || '',
    date: n.date || n.created_at || new Date().toISOString(),
    read: n.read || n.is_read || false,
  }));

  // Category mapping from API to SpendingTracker format
  const categoryMap: Record<string, string> = {
    'online_shopping': 'Shopping',
    'restaurants': 'Food',
    'groceries': 'Groceries',
    'subscriptions': 'Entertainment',
    'travel': 'Travel',
    'fuel': 'Travel',
    'utilities': 'Bills',
    'healthcare': 'Healthcare',
    'education': 'Education',
  };

  const transactions = apiTransactions.map((t: any, index: number) => ({
    id: parseInt(t.id?.toString() || index.toString(), 10),
    cardId: parseInt(t.card_id?.toString() || '0', 10),
    merchant: t.merchant_name || t.merchant || 'Unknown',
    category: categoryMap[t.merchant_category || t.category] || 'Other',
    amount: parseFloat(t.amount?.toString() || '0'),
    date: (t.transaction_date || t.date || new Date().toISOString()).split('T')[0],
  }));

  const totalOutstanding = cards.reduce((acc, c) => acc + (parseInt((c.outstanding || "0").replace(/[^0-9]/g, "")) || 0), 0);

  // Helpers - defined after all hooks
  const toggleSecret = (id: string | number) => setCards((prev) => prev.map((c) => (c.id === id ? { ...c, secret: !c.secret } : c)));
  const onPayCard = (card: Card) => {
    setSelectedCard(card);
    setOpenPayment(true);
  };
  const onConvertEMI = (card: Card) => {
    setSelectedCard(card);
    setOpenEMI(true);
  };

  // subtle banner motion
  const fadeUp = { initial: { y: 8, opacity: 0 }, animate: { y: 0, opacity: 1 }, transition: { duration: 0.36 } };

  // Show loading state AFTER all hooks are declared
  if (cardsLoading || transactionsLoading || billsLoading) {
    return (
      <div className="min-h-screen bg-[linear-gradient(180deg,#061018_0%,#071018_60%)] text-white flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-400"></div>
          <p className="mt-4 text-lg">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#061018_0%,#071018_60%)] text-white">
      <NoticeBanner />
      <Navbar2 notifications={notifications} user={user || undefined} />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 max-w-6xl mx-auto px-6 py-8 space-y-8">
          <motion.section {...fadeUp}>
            <HeaderSummaryGrid
              totalOutstanding={totalOutstanding}
              cibilScore={currentScore?.score || 0}
              onDownloadStatements={() => {
                console.log('📥 Navigating to /statements');
                navigate('/statements');
              }}
              onQuickPay={() => {
                console.log('📥 Navigating to /bill-payments');
                navigate('/bill-payments');
              }}
            />
            <div className="mt-4 flex items-center justify-between">
              <TopMetricsPanel
                activeEmis={emiSummary.active}
                utilizationPercent={Math.round((totalOutstanding / (cards.reduce((sum, c) => sum + (parseInt((c.limit || "0").replace(/[^0-9]/g, "")) || 0), 0) || 1)) * 100)}
                rewardPoints={12500}
              />
              <QuickActionsBar
                onViewCibil={() => {
                  console.log('📥 Navigating to /cibil-score');
                  navigate("/cibil-score");
                }}
                onAddCard={() => {
                  console.log('📥 Navigating to /add-card');
                  navigate("/add-card");
                }}
                onRedeem={() => {
                  console.log('📥 Navigating to /redeems');
                  navigate("/redeems");
                }}
                onBlockCard={() => {
                  console.log('📥 Navigating to /card-block');
                  navigate("/card-block");
                }}
              />
            </div>
          </motion.section>

          {/* CAROUSEL — full width, consistent card sizing and spacing */}
          {/* <motion.section {...fadeUp}>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-bold">My Cards</h2>
            <div className="text-sm text-gray-400">Single-level, swipeable cards</div>
          </div>

          <div className="rounded-2xl bg-gray-900/40 border border-gray-800 p-4 overflow-x-auto scrollbar-thin scrollbar-thumb-gray-700">
            <div className="flex gap-6" style={{ paddingBottom: 8 }}>
              {cards.map((c) => (
                <motion.div
                  key={c.id}
                  whileHover={{ scale: 1.03, y: -6 }}
                  transition={{ type: "spring", stiffness: 240 }}
                  className="min-w-[300px] max-w-[300px] rounded-xl p-5 shadow-xl bg-gradient-to-br text-white"
                  style={{ background: `linear-gradient(135deg, rgba(255,255,255,0.02), rgba(0,0,0,0.04))` }}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="text-xs text-gray-300">CREDIT CARD</div>
                      <div className="text-lg font-semibold mt-1">{c.title}</div>
                      <div className="text-sm text-gray-300 mt-1">{c.subtitle}</div>
                    </div>

                    <div className="flex flex-col items-end gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleSecret(c.id);
                        }}
                        className="px-2 py-1 rounded bg-black/20 text-sm"
                      >
                        {c.secret ? "Show" : "Hide"}
                      </button>
                    </div>
                  </div>

                  <div className="mt-6 font-mono text-lg tracking-wider">{c.secret ? "**** **** **** ****" : c.number}</div>

                  <div className="mt-3 flex items-center justify-between text-sm text-gray-300">
                    <div>Limit: {c.limit}</div>
                    <div className="font-semibold text-white">Outstanding: {c.outstanding}</div>
                  </div>

                  <div className="mt-4 flex gap-2">
                    <button onClick={() => onPayCard(c)} className="flex-1 px-3 py-2 rounded-lg bg-yellow-400 text-black font-medium">Pay</button>
                    <button onClick={() => onConvertEMI(c)} className="px-3 py-2 rounded-lg border border-gray-700">EMI</button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section> */}
          <MyCards
            cards={cards}
            fadeUp={fadeUp}
            toggleSecret={toggleSecret}
            onPayCard={onPayCard}
            onConvertEMI={onConvertEMI}
          />


          {/* AI INSIGHTS — full width panel */}
          <motion.section {...fadeUp}>
            <AIInsights
              cards={cards.map((c) => ({ id: c.id, title: c.title, outstanding: c.outstanding }))}
              bills={bills}
              transactions={transactions}
              onApply={(id) => show(`Applied ${id} (demo)`, 'success')}
            />
          </motion.section>
          <div className="lg:col-span-2">
            <SpendingTracker transactions={transactions} />
          </div>
          {/* Spending + Redeems row — visually separated but single-level flow */}
          <motion.section {...fadeUp} className="flex flex-col lg:flex-row gap-6">
            <div className="flex-1 min-w-0">
              <RedeemsPanel initialPoints={12500} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="rounded-2xl bg-gray-900/60 border border-gray-800 p-4 h-full flex flex-col">
                <div className="text-sm text-gray-400">Quick Bills</div>
                <div className="mt-3 flex flex-col gap-3 flex-1">
                  {bills.map((b) => (
                    <div key={b.id} className="flex items-center justify-between bg-gray-800/40 p-3 rounded">
                      <div>
                        <div className="font-semibold">{b.title}</div>
                        <div className="text-xs text-gray-400">Due {b.dueDate}</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="font-semibold text-yellow-300">{b.amount}</div>
                        <button onClick={() => setOpenPayment(true)} className="px-3 py-1 rounded bg-yellow-400 text-black">Pay</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.section>

          {/* Transactions and small EMI box — lightweight and balanced */}
          <motion.section {...fadeUp} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <TransactionsQuickList
                transactions={transactions.map((t) => ({ ...t, cardTitle: (cards.find((c) => c.id === t.cardId) || {}).title }))}
                onDispute={(t) => show(`Dispute ${t.merchant} (demo)`, 'info')}
                onViewAll={() => (window.location.href = "/transactions")}
              />
            </div>

            <div className="space-y-6">
              <div className="rounded-2xl bg-gray-900/60 border border-gray-800 p-6">
                <div className="text-sm text-gray-400">EMI Summary</div>
                <div className="text-lg font-bold mt-2">
                  {emiSummary.active} active · ₹{emiSummary.remaining.toLocaleString('en-IN')} remaining
                </div>
                <div className="mt-4 flex gap-2">
                  <button onClick={() => navigate("/emi")} className="px-3 py-2 rounded-lg bg-yellow-400 text-black">Manage</button>
                  <button onClick={() => navigate("/apply-emi")} className="px-3 py-2 rounded-lg border border-gray-700">Apply</button>
                </div>
              </div>

              <div className="rounded-2xl bg-gray-900/60 border border-gray-800 p-6">
                <div className="text-sm text-gray-400">Support</div>
                <div className="text-lg font-bold mt-2">Need help?</div>
                <div className="mt-3 text-sm text-gray-300">Chat with support or raise a ticket — we’ll help with disputes, freezes and queries.</div>
                <div className="mt-4">
                  <button onClick={() => navigate("/support")} className="px-3 py-2 rounded-lg bg-yellow-400 text-black">Contact Support</button>
                </div>
              </div>
            </div>
          </motion.section>
        </main>

        {/* Floating Chatbot */}
        <Chatbot />

        {/* Payment Modal */}
        {openPayment && (
          <PaymentModal
            amountLabel={selectedCard ? `Pay ${selectedCard.title}` : "Pay"}
            amountValue={selectedCard ? selectedCard.outstanding || "₹0" : "₹0"}
            onClose={() => {
              setOpenPayment(false);
              setSelectedCard(null);
            }}
            onSuccess={() => {
              setOpenPayment(false);
              setSelectedCard(null);
              show("Payment success (demo)", 'success');
            }}
          />
        )}

        {/* EMI Modal */}
        {openEMI && selectedCard && (
          <EMIModal
            card={{ id: selectedCard.id, title: selectedCard.title, outstanding: selectedCard.outstanding }}
            onClose={() => setOpenEMI(false)}
            onApply={(plan) => {
              setOpenEMI(false);
              show(`EMI applied: ${plan.months} mo @ ₹${plan.monthly} (demo)`, 'success');
            }}
          />
        )}
      </div>
    </div>
  );
};

export default Dashboard;
