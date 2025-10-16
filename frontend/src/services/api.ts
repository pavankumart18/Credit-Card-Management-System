import apiClient from '@/config/api.config';
import { AxiosResponse } from 'axios';

// ==================== AUTH API ====================
export const authApi = {
    login: async (username: string, password: string) => {
        const response = await apiClient.post('/users/login', { username, password });
        return response.data;
    },

    signup: async (userData: {
        username: string;
        email: string;
        password: string;
        first_name: string;
        last_name: string;
        age?: number;
        gender?: string;
        nationality?: string;
        address?: string;
        phone_number?: string;
        pan?: string;
        aadhaar?: string;
        employment_type?: string;
        company?: string;
        years_of_experience?: number;
        annual_income?: number;
        bank_account_details?: string;
        estimated_existing_loan_amount?: number;
    }) => {
        const response = await apiClient.post('/users/signup', userData);
        return response.data;
    },

    getCurrentUser: async () => {
        const response = await apiClient.get('/users/me');
        return response.data;
    },

    updateProfile: async (userId: string, userData: any) => {
        const response = await apiClient.put(`/users/${userId}`, userData);
        return response.data;
    },
};

// ==================== CARDS API ====================
export const cardsApi = {
    getCards: async () => {
        const response = await apiClient.get('/cards');
        return response.data;
    },

    getCard: async (cardId: string) => {
        const response = await apiClient.get(`/cards/${cardId}`);
        return response.data;
    },

    createCard: async (cardData: {
        card_number: string;
        card_holder_name: string;
        expiry_month: number;
        expiry_year: number;
        cvv: string;
        card_type: string;
        card_brand: string;
        card_name: string;
        credit_limit: number;
        due_date?: number;
    }) => {
        const response = await apiClient.post('/cards', cardData);
        return response.data;
    },

    updateCard: async (cardId: string, cardData: { card_name?: string; due_date?: number }) => {
        const response = await apiClient.put(`/cards/${cardId}`, cardData);
        return response.data;
    },

    blockCard: async (cardId: string) => {
        const response = await apiClient.put(`/cards/${cardId}/block`);
        return response.data;
    },

    unblockCard: async (cardId: string) => {
        const response = await apiClient.put(`/cards/${cardId}/unblock`);
        return response.data;
    },

    updatePin: async (cardId: string, pin: string) => {
        const response = await apiClient.put(`/cards/${cardId}/pin`, { pin });
        return response.data;
    },

    getCardTransactions: async (cardId: string, params?: {
        page?: number;
        per_page?: number;
        status?: string;
        type?: string;
    }) => {
        const response = await apiClient.get(`/cards/${cardId}/transactions`, { params });
        return response.data;
    },

    deleteCard: async (cardId: string) => {
        const response = await apiClient.delete(`/cards/${cardId}`);
        return response.data;
    },
};

// ==================== TRANSACTIONS API ====================
export const transactionsApi = {
    getTransactions: async (params?: {
        page?: number;
        per_page?: number;
        card_id?: string;
        status?: string;
        type?: string;
        merchant?: string;
        start_date?: string;
        end_date?: string;
    }) => {
        const response = await apiClient.get('/transactions', { params });
        return response.data;
    },

    getTransaction: async (transactionId: string) => {
        const response = await apiClient.get(`/transactions/${transactionId}`);
        return response.data;
    },

    createTransaction: async (transactionData: {
        card_id: string;
        merchant_name: string;
        merchant_category: string;
        amount: number;
        description?: string;
        transaction_type?: string;
        location?: string;
        device_type?: string;
        payment_method?: string;
        reference_number?: string;
        is_recurring?: boolean;
        is_international?: boolean;
    }) => {
        const response = await apiClient.post('/transactions', transactionData);
        return response.data;
    },

    refundTransaction: async (transactionId: string, amount?: number) => {
        const response = await apiClient.post(`/transactions/${transactionId}/refund`, { amount });
        return response.data;
    },

    getTransactionCategories: async () => {
        const response = await apiClient.get('/transactions/categories');
        return response.data;
    },

    getTransactionSummary: async (days?: number) => {
        const response = await apiClient.get('/transactions/summary', { params: { days } });
        return response.data;
    },
};

// ==================== BILLS API ====================
export const billsApi = {
    getBills: async (params?: {
        page?: number;
        per_page?: number;
        card_id?: string;
        status?: string;
        type?: string;
        due_soon?: boolean;
    }) => {
        const response = await apiClient.get('/bills', { params });
        return response.data;
    },

    getBill: async (billId: string) => {
        const response = await apiClient.get(`/bills/${billId}`);
        return response.data;
    },

    createBill: async (billData: {
        card_id: string;
        biller_name: string;
        biller_category: string;
        bill_type: string;
        amount: number;
        due_date: string;
        bill_number?: string;
        consumer_number?: string;
        description?: string;
        is_recurring?: boolean;
        recurring_frequency?: string;
        bill_period_start?: string;
        bill_period_end?: string;
    }) => {
        const response = await apiClient.post('/bills', billData);
        return response.data;
    },

    payBill: async (billId: string, amount?: number) => {
        const response = await apiClient.post(`/bills/${billId}/pay`, { amount });
        return response.data;
    },

    toggleAutoPay: async (billId: string, enable: boolean) => {
        const response = await apiClient.put(`/bills/${billId}/auto-pay`, { enable });
        return response.data;
    },

    updateBill: async (billId: string, billData: any) => {
        const response = await apiClient.put(`/bills/${billId}`, billData);
        return response.data;
    },

    deleteBill: async (billId: string) => {
        const response = await apiClient.delete(`/bills/${billId}`);
        return response.data;
    },

    getBillTypes: async () => {
        const response = await apiClient.get('/bills/types');
        return response.data;
    },

    getBillsSummary: async () => {
        const response = await apiClient.get('/bills/summary');
        return response.data;
    },
};

// ==================== EMIS API ====================
export const emisApi = {
    getEMIs: async (params?: {
        page?: number;
        per_page?: number;
        card_id?: string;
        status?: string;
    }) => {
        const response = await apiClient.get('/emis', { params });
        return response.data;
    },

    getEMI: async (emiId: string) => {
        const response = await apiClient.get(`/emis/${emiId}`);
        return response.data;
    },

    createEMI: async (emiData: {
        card_id: string;
        principal_amount: number;
        interest_rate: number;
        tenure_months: number;
        start_date: string;
        description?: string;
        merchant_name?: string;
        product_name?: string;
    }) => {
        const response = await apiClient.post('/emis', emiData);
        return response.data;
    },

    payEMI: async (emiId: string, amount?: number, payment_date?: string) => {
        const response = await apiClient.post(`/emis/${emiId}/pay`, { amount, payment_date });
        return response.data;
    },

    toggleAutoPay: async (emiId: string, enable: boolean, auto_pay_date?: number) => {
        const response = await apiClient.put(`/emis/${emiId}/auto-pay`, { enable, auto_pay_date });
        return response.data;
    },

    preCloseEMI: async (emiId: string, amount?: number) => {
        const response = await apiClient.post(`/emis/${emiId}/pre-close`, { amount });
        return response.data;
    },

    updateEMI: async (emiId: string, emiData: any) => {
        const response = await apiClient.put(`/emis/${emiId}`, emiData);
        return response.data;
    },

    cancelEMI: async (emiId: string) => {
        const response = await apiClient.delete(`/emis/${emiId}`);
        return response.data;
    },

    calculateEMI: async (principal_amount: number, interest_rate: number, tenure_months: number) => {
        const response = await apiClient.post('/emis/calculator', {
            principal_amount,
            interest_rate,
            tenure_months,
        });
        return response.data;
    },

    getEMISummary: async () => {
        const response = await apiClient.get('/emis/summary');
        return response.data;
    },
};

// ==================== CIBIL SCORES API ====================
export const cibilApi = {
    getCibilScores: async (params?: {
        page?: number;
        per_page?: number;
        current_only?: boolean;
    }) => {
        const response = await apiClient.get('/cibil', { params });
        return response.data;
    },

    getCurrentCibilScore: async () => {
        const response = await apiClient.get('/cibil/current');
        return response.data;
    },

    getCibilScore: async (scoreId: string) => {
        const response = await apiClient.get(`/cibil/${scoreId}`);
        return response.data;
    },

    createCibilScore: async (scoreData: {
        score: number;
        score_date: string;
        score_type?: string;
        payment_history_score?: number;
        credit_utilization_score?: number;
        credit_age_score?: number;
        credit_mix_score?: number;
        new_credit_score?: number;
        total_accounts?: number;
        active_accounts?: number;
        closed_accounts?: number;
        credit_inquiries?: number;
        hard_inquiries?: number;
        soft_inquiries?: number;
        total_credit_limit?: number;
        total_outstanding?: number;
        oldest_account_age?: number;
        newest_account_age?: number;
        late_payments?: number;
        missed_payments?: number;
        defaults?: number;
        bankruptcies?: number;
        collections?: number;
        report_number?: string;
        bureau_reference?: string;
        notes?: string;
    }) => {
        const response = await apiClient.post('/cibil', scoreData);
        return response.data;
    },

    verifyCibilScore: async (scoreId: string, verification_date?: string) => {
        const response = await apiClient.put(`/cibil/${scoreId}/verify`, { verification_date });
        return response.data;
    },

    updateCibilScore: async (scoreId: string, scoreData: any) => {
        const response = await apiClient.put(`/cibil/${scoreId}`, scoreData);
        return response.data;
    },

    deleteCibilScore: async (scoreId: string) => {
        const response = await apiClient.delete(`/cibil/${scoreId}`);
        return response.data;
    },

    getCibilTrend: async (days?: number) => {
        const response = await apiClient.get('/cibil/trend', { params: { days } });
        return response.data;
    },

    getCibilSummary: async () => {
        const response = await apiClient.get('/cibil/summary');
        return response.data;
    },
};

// ==================== NOTIFICATIONS API ====================
export const notificationsApi = {
    getNotifications: async (params?: {
        page?: number;
        per_page?: number;
        type?: string;
        priority?: string;
        is_read?: boolean;
        unread_only?: boolean;
    }) => {
        const response = await apiClient.get('/notifications', { params });
        return response.data;
    },

    getNotification: async (notificationId: string) => {
        const response = await apiClient.get(`/notifications/${notificationId}`);
        return response.data;
    },

    createNotification: async (notificationData: {
        title: string;
        message: string;
        notification_type: string;
        priority?: string;
        channels?: string[];
        related_entity_type?: string;
        related_entity_id?: string;
        action_url?: string;
        action_text?: string;
        requires_action?: boolean;
        metadata?: any;
        tags?: string[];
        expires_at?: string;
    }) => {
        const response = await apiClient.post('/notifications', notificationData);
        return response.data;
    },

    markAsRead: async (notificationId: string) => {
        const response = await apiClient.put(`/notifications/${notificationId}/read`);
        return response.data;
    },

    markAsUnread: async (notificationId: string) => {
        const response = await apiClient.put(`/notifications/${notificationId}/unread`);
        return response.data;
    },

    markAllAsRead: async () => {
        const response = await apiClient.put('/notifications/mark-all-read');
        return response.data;
    },

    updateNotification: async (notificationId: string, notificationData: any) => {
        const response = await apiClient.put(`/notifications/${notificationId}`, notificationData);
        return response.data;
    },

    deleteNotification: async (notificationId: string) => {
        const response = await apiClient.delete(`/notifications/${notificationId}`);
        return response.data;
    },

    getNotificationTypes: async () => {
        const response = await apiClient.get('/notifications/types');
        return response.data;
    },

    getNotificationsSummary: async () => {
        const response = await apiClient.get('/notifications/summary');
        return response.data;
    },
};

// ==================== CHAT API ====================
export const chatApi = {
    createSession: async (title?: string, model?: string) => {
        const response = await apiClient.post('/chat/sessions', { title, model });
        return response.data;
    },

    getSessions: async (params?: { page?: number; per_page?: number }) => {
        const response = await apiClient.get('/chat/sessions', { params });
        return response.data;
    },

    getSession: async (sessionId: string) => {
        const response = await apiClient.get(`/chat/sessions/${sessionId}`);
        return response.data;
    },

    sendMessage: async (sessionId: string, message: string, model?: string) => {
        const response = await apiClient.post(`/chat/sessions/${sessionId}/send`, { message, model });
        return response.data;
    },

    streamMessage: async (sessionId: string, message: string, model?: string) => {
        const response = await apiClient.post(`/chat/sessions/${sessionId}/stream`, { message, model }, {
            responseType: 'stream',
        });
        return response.data;
    },
};

// Export all APIs
export default {
    auth: authApi,
    cards: cardsApi,
    transactions: transactionsApi,
    bills: billsApi,
    emis: emisApi,
    cibil: cibilApi,
    notifications: notificationsApi,
    chat: chatApi,
};

