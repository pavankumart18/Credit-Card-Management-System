import { useState, useEffect } from 'react';
import { cardsApi } from '@/services/api';

export interface CardData {
    _id?: string;
    id?: string;
    user_id?: string;
    card_number?: string;
    card_holder_name?: string;
    card_name?: string;
    card_type?: string;
    card_brand?: string;
    credit_limit?: number;
    available_credit?: number;
    outstanding_balance?: number;
    due_date?: number;
    is_blocked?: boolean;
    is_active?: boolean;
    expiry_month?: number;
    expiry_year?: number;
    last_used?: string;
    created_at?: string;

    // Frontend display fields
    title?: string;
    subtitle?: string;
    number?: string;
    gradient?: string;
    limit?: string;
    outstanding?: string;
    secret?: boolean;
}

export const useCards = () => {
    const [cards, setCards] = useState<CardData[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchCards = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await cardsApi.getCards();

            // Transform backend data to frontend format
            const transformedCards = (response.cards || []).map((card: any) => ({
                ...card,
                id: card._id || card.id,
                title: card.card_name,
                subtitle: `${card.card_type} - ${card.card_brand}`,
                number: `**** **** **** ${card.card_number?.slice(-4)}`,
                gradient: getGradientForCardType(card.card_type),
                limit: `₹${card.credit_limit?.toLocaleString('en-IN')}`,
                outstanding: `₹${card.outstanding_balance?.toLocaleString('en-IN')}`,
                secret: true,
            }));

            setCards(transformedCards);
        } catch (err: any) {
            setError(err.response?.data?.error || 'Failed to fetch cards');
            console.error('Error fetching cards:', err);
            setCards([]); // Set empty array on error
        } finally {
            setLoading(false);
        }
    };

    const addCard = async (cardData: any) => {
        try {
            setLoading(true);
            setError(null);
            const newCard = await cardsApi.createCard(cardData);
            await fetchCards(); // Refresh the list
            return newCard;
        } catch (err: any) {
            setError(err.response?.data?.error || 'Failed to add card');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const blockCard = async (cardId: string) => {
        try {
            setLoading(true);
            setError(null);
            await cardsApi.blockCard(cardId);
            await fetchCards(); // Refresh the list
        } catch (err: any) {
            setError(err.response?.data?.error || 'Failed to block card');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const unblockCard = async (cardId: string) => {
        try {
            setLoading(true);
            setError(null);
            await cardsApi.unblockCard(cardId);
            await fetchCards(); // Refresh the list
        } catch (err: any) {
            setError(err.response?.data?.error || 'Failed to unblock card');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const updateCardPin = async (cardId: string, pin: string) => {
        try {
            setLoading(true);
            setError(null);
            await cardsApi.updatePin(cardId, pin);
        } catch (err: any) {
            setError(err.response?.data?.error || 'Failed to update PIN');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const deleteCard = async (cardId: string) => {
        try {
            setLoading(true);
            setError(null);
            await cardsApi.deleteCard(cardId);
            await fetchCards(); // Refresh the list
        } catch (err: any) {
            setError(err.response?.data?.error || 'Failed to delete card');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCards();
    }, []);

    return {
        cards,
        loading,
        error,
        refetch: fetchCards,
        addCard,
        blockCard,
        unblockCard,
        updateCardPin,
        deleteCard,
    };
};

// Helper function to assign gradient based on card type
function getGradientForCardType(cardType: string): string {
    const gradients: { [key: string]: string } = {
        'platinum': 'from-gray-400 to-gray-600',
        'gold': 'from-yellow-400 to-yellow-600',
        'titanium': 'from-gray-300 to-gray-500',
        'silver': 'from-gray-200 to-gray-400',
        'credit': 'from-blue-500 to-indigo-600',
        'debit': 'from-green-500 to-teal-600',
    };

    return gradients[cardType?.toLowerCase()] || 'from-indigo-500 to-blue-500';
}

