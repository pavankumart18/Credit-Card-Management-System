import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import Navbar2 from "../components/Navbar2";
import { useCards } from "@/hooks/useCards";
import { cardsApi } from "@/services/api";

interface Card {
  id: number | string;
  title: string;
  subtitle: string;
  number: string;
  holder: string;
  expiry: string;
  cvv: string;
  gradient: string;
  secret: boolean;
  limit?: string;
  outstanding?: string;
}

interface Transaction {
  id: number;
  merchant: string;
  amount: string;
  date: string;
}

const CardDetails: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [card, setCard] = useState<Card | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [secret, setSecret] = useState(true);

  useEffect(() => {
    const fetchCardDetails = async () => {
      if (!id) return;

      try {
        setLoading(true);

        // Fetch card details
        const cardData = await cardsApi.getCard(id);

        // Fetch card transactions
        const txData = await cardsApi.getCardTransactions(id, { per_page: 10 });

        // Transform card data
        setCard({
          id: cardData._id || cardData.id,
          title: cardData.card_name || 'Card',
          subtitle: `${cardData.card_type || ''} ${cardData.card_brand || ''}`.trim(),
          number: cardData.card_number || '**** **** **** ****',
          holder: cardData.card_holder_name || 'Card Holder',
          expiry: cardData.expiry_month && cardData.expiry_year
            ? `${String(cardData.expiry_month).padStart(2, '0')}/${String(cardData.expiry_year).slice(-2)}`
            : '--/--',
          cvv: '***',
          gradient: getGradientForCardType(cardData.card_type),
          secret: true,
          limit: `₹${cardData.credit_limit?.toLocaleString('en-IN') || '0'}`,
          outstanding: `₹${cardData.outstanding_balance?.toLocaleString('en-IN') || '0'}`,
        });

        // Transform transactions
        const transformedTxs = txData.transactions.map((t: any) => ({
          id: t._id || t.id,
          merchant: t.merchant_name || 'Unknown',
          amount: `₹${t.amount?.toLocaleString('en-IN') || '0'}`,
          date: t.transaction_date || new Date().toISOString().split('T')[0],
        }));
        setTransactions(transformedTxs);

      } catch (err) {
        console.error('Failed to fetch card details:', err);
        navigate('/cards');
      } finally {
        setLoading(false);
      }
    };

    fetchCardDetails();
  }, [id, navigate]);

  const toggleSecret = () => {
    setSecret(!secret);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-400"></div>
          <p className="mt-4 text-lg">Loading card details...</p>
        </div>
      </div>
    );
  }

  if (!card) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl">Card not found</p>
          <button onClick={() => navigate('/cards')} className="mt-4 px-4 py-2 bg-yellow-400 text-black rounded-lg">
            Go to My Cards
          </button>
        </div>
      </div>
    );
  }

  function getGradientForCardType(cardType: string): string {
    const gradients: { [key: string]: string } = {
      'platinum': 'from-gray-400 to-gray-600',
      'gold': 'from-yellow-400 to-yellow-600',
      'credit': 'from-indigo-500 to-blue-500',
      'debit': 'from-green-500 to-teal-600',
    };
    return gradients[cardType?.toLowerCase()] || 'from-indigo-500 to-blue-500';
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white">
      <Navbar2 />
      <div className="max-w-5xl mx-auto p-6 space-y-8">

        {/* Card View */}
        <div className="flex flex-col md:flex-row gap-8">
          {/* Left: Card Front & Back */}
          <div className="flex-1 space-y-6">
            <div className={`relative w-full h-64 rounded-3xl shadow-2xl p-6 bg-gradient-to-r ${card.gradient}`}>
              <div className="flex justify-between items-start">
                <div className="text-xs opacity-70">CARD</div>
                <button onClick={toggleSecret} className="text-gray-200 hover:text-white">
                  {card.secret ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              <div className="mt-8 text-2xl font-semibold tracking-widest">
                {secret ? "**** **** **** ****" : card.number}
              </div>
              <div className="flex justify-between mt-6 text-sm opacity-80">
                <div>{card.holder}</div>
                <div>{card.expiry}</div>
              </div>
            </div>

            <div className={`relative w-full h-40 rounded-3xl shadow-2xl p-6 bg-gradient-to-r ${card.gradient}`}>
              <div className="flex justify-between">
                <div className="text-sm opacity-70">BACK</div>
              </div>
              <div className="mt-20 text-right text-sm opacity-80">
                CVV: {card.secret ? "***" : card.cvv}
              </div>
            </div>
          </div>

          {/* Right: Card Info & Actions */}
          <div className="flex-1 flex flex-col gap-6">
            <div className="bg-gray-800/60 p-4 rounded-xl shadow-lg">
              <h2 className="text-lg font-semibold mb-2">Card Details</h2>
              <p><span className="opacity-70">Type:</span> {card.title}</p>
              <p><span className="opacity-70">Subtitle:</span> {card.subtitle}</p>
              <p><span className="opacity-70">Number:</span> {card.secret ? "**** **** **** ****" : card.number}</p>
              <p><span className="opacity-70">Holder:</span> {card.holder}</p>
              <p><span className="opacity-70">Expiry:</span> {card.expiry}</p>
              <p><span className="opacity-70">CVV:</span> {card.secret ? "***" : card.cvv}</p>
            </div>

            <div className="bg-gray-800/60 p-4 rounded-xl shadow-lg">
              <h2 className="text-lg font-semibold mb-2">AI Suggestions</h2>
              <ul className="list-disc list-inside text-sm opacity-80">
                <li>Pay your electricity bill using this card to earn 5% cashback.</li>
                <li>Use this card for online shopping to maximize reward points.</li>
                <li>Maintain a balance below ₹50,000 for optimal usage.</li>
              </ul>
            </div>

            <div className="bg-gray-800/60 p-4 rounded-xl shadow-lg">
              <h2 className="text-lg font-semibold mb-2">Transaction History</h2>
              <div className="space-y-2 text-sm opacity-80">
                {transactions.map(tx => (
                  <div key={tx.id} className="flex justify-between bg-gray-700/40 rounded-xl p-2 hover:bg-gray-700/60 transition">
                    <span>{tx.merchant}</span>
                    <span>{tx.amount}</span>
                    <span>{tx.date}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default CardDetails;
