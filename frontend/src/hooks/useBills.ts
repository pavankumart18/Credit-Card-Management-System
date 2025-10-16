import { useState, useEffect } from 'react';
import { billsApi } from '@/services/api';

export interface BillData {
    _id?: string;
    id?: string | number;
    user_id?: string;
    card_id?: string;
    bill_id?: string;
    biller_name?: string;
    title?: string;
    biller_category?: string;
    bill_type?: string;
    amount?: number;
    due_date?: string;
    dueDate?: string;
    payment_status?: string;
    bill_number?: string;
    consumer_number?: string;
    description?: string;
    is_recurring?: boolean;
    auto_pay_enabled?: boolean;
    paid_amount?: number;
    payment_date?: string;
    created_at?: string;
}

export const useBills = (filters?: {
    page?: number;
    per_page?: number;
    card_id?: string;
    status?: string;
    type?: string;
    due_soon?: boolean;
}) => {
    const [bills, setBills] = useState<BillData[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [pagination, setPagination] = useState({
        total: 0,
        pages: 0,
        currentPage: 1,
        perPage: 10,
    });

    const fetchBills = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await billsApi.getBills(filters);

            // Transform backend data to frontend format
            const transformedBills = (response.bills || []).map((bill: any) => ({
                ...bill,
                id: bill._id || bill.id,
                title: bill.biller_name,
                amount: `₹${bill.amount?.toLocaleString('en-IN')}`,
                dueDate: bill.due_date,
            }));

            setBills(transformedBills);
            setPagination({
                total: response.total || 0,
                pages: response.pages || 0,
                currentPage: response.current_page || 1,
                perPage: response.per_page || 10,
            });
        } catch (err: any) {
            setError(err.response?.data?.error || 'Failed to fetch bills');
            console.error('Error fetching bills:', err);
            setBills([]); // Set empty array on error
        } finally {
            setLoading(false);
        }
    };

    const createBill = async (billData: any) => {
        try {
            setLoading(true);
            setError(null);
            const newBill = await billsApi.createBill(billData);
            await fetchBills(); // Refresh the list
            return newBill;
        } catch (err: any) {
            setError(err.response?.data?.error || 'Failed to create bill');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const payBill = async (billId: string, amount?: number) => {
        try {
            setLoading(true);
            setError(null);
            const payment = await billsApi.payBill(billId, amount);
            await fetchBills(); // Refresh the list
            return payment;
        } catch (err: any) {
            setError(err.response?.data?.error || 'Failed to pay bill');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const toggleAutoPay = async (billId: string, enable: boolean) => {
        try {
            setLoading(true);
            setError(null);
            await billsApi.toggleAutoPay(billId, enable);
            await fetchBills(); // Refresh the list
        } catch (err: any) {
            setError(err.response?.data?.error || 'Failed to toggle auto-pay');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const deleteBill = async (billId: string) => {
        try {
            setLoading(true);
            setError(null);
            await billsApi.deleteBill(billId);
            await fetchBills(); // Refresh the list
        } catch (err: any) {
            setError(err.response?.data?.error || 'Failed to delete bill');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const getBillsSummary = async () => {
        try {
            const summary = await billsApi.getBillsSummary();
            return summary;
        } catch (err: any) {
            console.error('Error fetching bills summary:', err);
            throw err;
        }
    };

    useEffect(() => {
        fetchBills();
    }, [filters?.page, filters?.status, filters?.type]);

    return {
        bills,
        loading,
        error,
        pagination,
        refetch: fetchBills,
        createBill,
        payBill,
        toggleAutoPay,
        deleteBill,
        getBillsSummary,
    };
};

