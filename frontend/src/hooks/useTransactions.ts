import { useState, useEffect } from 'react';
import { transactionsApi } from '@/services/api';

export interface TransactionData {
    _id?: string;
    id?: string | number;
    user_id?: string;
    card_id?: string | number;
    cardId?: number;
    transaction_id?: string;
    merchant_name?: string;
    merchant?: string;
    merchant_category?: string;
    category?: string;
    amount?: number;
    description?: string;
    transaction_type?: string;
    transaction_date?: string;
    date?: string;
    status?: string;
    location?: string;
    payment_method?: string;
    reference_number?: string;
    is_recurring?: boolean;
    is_international?: boolean;
    created_at?: string;
}

export const useTransactions = (filters?: {
    page?: number;
    per_page?: number;
    card_id?: string;
    status?: string;
    type?: string;
    merchant?: string;
    start_date?: string;
    end_date?: string;
}) => {
    const [transactions, setTransactions] = useState<TransactionData[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [pagination, setPagination] = useState({
        total: 0,
        pages: 0,
        currentPage: 1,
        perPage: 10,
    });

    const fetchTransactions = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await transactionsApi.getTransactions(filters);

            // Transform backend data to frontend format
            const transformedTransactions = (response.transactions || []).map((txn: any) => ({
                ...txn,
                id: txn._id || txn.id,
                cardId: txn.card_id,
                merchant: txn.merchant_name,
                category: txn.merchant_category,
                date: txn.transaction_date,
            }));

            setTransactions(transformedTransactions);
            setPagination({
                total: response.total,
                pages: response.pages,
                currentPage: response.current_page,
                perPage: response.per_page,
            });
        } catch (err: any) {
            setError(err.response?.data?.error || 'Failed to fetch transactions');
            console.error('Error fetching transactions:', err);
            setTransactions([]); // Set empty array on error
            setPagination({ total: 0, pages: 0, currentPage: 1, perPage: 10 });
        } finally {
            setLoading(false);
        }
    };

    const createTransaction = async (transactionData: any) => {
        try {
            setLoading(true);
            setError(null);
            const newTransaction = await transactionsApi.createTransaction(transactionData);
            await fetchTransactions(); // Refresh the list
            return newTransaction;
        } catch (err: any) {
            setError(err.response?.data?.error || 'Failed to create transaction');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const refundTransaction = async (transactionId: string, amount?: number) => {
        try {
            setLoading(true);
            setError(null);
            const refund = await transactionsApi.refundTransaction(transactionId, amount);
            await fetchTransactions(); // Refresh the list
            return refund;
        } catch (err: any) {
            setError(err.response?.data?.error || 'Failed to refund transaction');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const getTransactionSummary = async (days?: number) => {
        try {
            const summary = await transactionsApi.getTransactionSummary(days);
            return summary;
        } catch (err: any) {
            console.error('Error fetching transaction summary:', err);
            throw err;
        }
    };

    useEffect(() => {
        fetchTransactions();
    }, [filters?.page, filters?.card_id, filters?.status]);

    return {
        transactions,
        loading,
        error,
        pagination,
        refetch: fetchTransactions,
        createTransaction,
        refundTransaction,
        getTransactionSummary,
    };
};

