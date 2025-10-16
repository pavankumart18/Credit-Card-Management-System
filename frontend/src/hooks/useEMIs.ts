import { useState, useEffect } from 'react';
import { emisApi } from '@/services/api';

export interface EMIData {
    _id?: string;
    id?: string;
    user_id?: string;
    card_id?: string;
    cardId?: number;
    emi_id?: string;
    principal_amount?: number;
    originalAmount?: number;
    interest_rate?: number;
    tenure_months?: number;
    monthsLeft?: number;
    emi_amount?: number;
    monthly?: number;
    total_amount?: number;
    total_paid?: number;
    remaining_amount?: number;
    remaining?: number;
    interest_paid?: number;
    start_date?: string;
    end_date?: string;
    next_due_date?: string;
    status?: string;
    auto_pay_enabled?: boolean;
    description?: string;
    merchant_name?: string;
    product_name?: string;
    created_at?: string;
}

export const useEMIs = (filters?: {
    page?: number;
    per_page?: number;
    card_id?: string;
    status?: string;
}) => {
    const [emis, setEMIs] = useState<EMIData[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [pagination, setPagination] = useState({
        total: 0,
        pages: 0,
        currentPage: 1,
        perPage: 10,
    });

    const fetchEMIs = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await emisApi.getEMIs(filters);

            // Transform backend data to frontend format
            const transformedEMIs = response.emis.map((emi: any) => ({
                ...emi,
                id: emi._id || emi.id,
                cardId: emi.card_id,
                originalAmount: emi.principal_amount,
                monthly: emi.emi_amount,
                remaining: emi.remaining_amount,
                monthsLeft: emi.tenure_months - Math.floor(emi.total_paid / emi.emi_amount),
            }));

            setEMIs(transformedEMIs);
            setPagination({
                total: response.total,
                pages: response.pages,
                currentPage: response.current_page,
                perPage: response.per_page,
            });
        } catch (err: any) {
            setError(err.response?.data?.error || 'Failed to fetch EMIs');
            console.error('Error fetching EMIs:', err);
        } finally {
            setLoading(false);
        }
    };

    const createEMI = async (emiData: {
        card_id: string;
        principal_amount: number;
        interest_rate: number;
        tenure_months: number;
        start_date: string;
        description?: string;
        merchant_name?: string;
        product_name?: string;
    }) => {
        try {
            setLoading(true);
            setError(null);
            const newEMI = await emisApi.createEMI(emiData);
            await fetchEMIs(); // Refresh the list
            return newEMI;
        } catch (err: any) {
            setError(err.response?.data?.error || 'Failed to create EMI');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const payEMI = async (emiId: string, amount?: number, payment_date?: string) => {
        try {
            setLoading(true);
            setError(null);
            const payment = await emisApi.payEMI(emiId, amount, payment_date);
            await fetchEMIs(); // Refresh the list
            return payment;
        } catch (err: any) {
            setError(err.response?.data?.error || 'Failed to pay EMI');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const preCloseEMI = async (emiId: string, amount?: number) => {
        try {
            setLoading(true);
            setError(null);
            const result = await emisApi.preCloseEMI(emiId, amount);
            await fetchEMIs(); // Refresh the list
            return result;
        } catch (err: any) {
            setError(err.response?.data?.error || 'Failed to pre-close EMI');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const toggleAutoPay = async (emiId: string, enable: boolean, auto_pay_date?: number) => {
        try {
            setLoading(true);
            setError(null);
            await emisApi.toggleAutoPay(emiId, enable, auto_pay_date);
            await fetchEMIs(); // Refresh the list
        } catch (err: any) {
            setError(err.response?.data?.error || 'Failed to toggle auto-pay');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const cancelEMI = async (emiId: string) => {
        try {
            setLoading(true);
            setError(null);
            await emisApi.cancelEMI(emiId);
            await fetchEMIs(); // Refresh the list
        } catch (err: any) {
            setError(err.response?.data?.error || 'Failed to cancel EMI');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const calculateEMI = async (principal_amount: number, interest_rate: number, tenure_months: number) => {
        try {
            const calculation = await emisApi.calculateEMI(principal_amount, interest_rate, tenure_months);
            return calculation;
        } catch (err: any) {
            console.error('Error calculating EMI:', err);
            throw err;
        }
    };

    const getEMISummary = async () => {
        try {
            const summary = await emisApi.getEMISummary();
            return summary;
        } catch (err: any) {
            console.error('Error fetching EMI summary:', err);
            throw err;
        }
    };

    useEffect(() => {
        fetchEMIs();
    }, [filters?.page, filters?.card_id, filters?.status]);

    return {
        emis,
        loading,
        error,
        pagination,
        refetch: fetchEMIs,
        createEMI,
        payEMI,
        preCloseEMI,
        toggleAutoPay,
        cancelEMI,
        calculateEMI,
        getEMISummary,
    };
};

