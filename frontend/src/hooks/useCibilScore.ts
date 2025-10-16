import { useState, useEffect } from 'react';
import { cibilApi } from '@/services/api';

export interface CibilScoreData {
    _id?: string;
    id?: string;
    user_id?: string;
    score?: number;
    score_date?: string;
    score_type?: string;
    score_range?: string;
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
    credit_utilization_percentage?: number;
    oldest_account_age?: number;
    newest_account_age?: number;
    average_account_age?: number;
    late_payments?: number;
    missed_payments?: number;
    defaults?: number;
    bankruptcies?: number;
    collections?: number;
    is_current?: boolean;
    is_verified?: boolean;
    report_number?: string;
    bureau_reference?: string;
    notes?: string;
    created_at?: string;
}

export const useCibilScore = () => {
    const [currentScore, setCurrentScore] = useState<CibilScoreData | null>(null);
    const [scoreHistory, setScoreHistory] = useState<CibilScoreData[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchCurrentScore = async () => {
        try {
            setLoading(true);
            setError(null);
            const score = await cibilApi.getCurrentCibilScore();
            setCurrentScore(score);
        } catch (err: any) {
            // Don't set error for 404 - just means no score exists yet
            if (err.response?.status !== 404) {
                setError(err.response?.data?.error || 'Failed to fetch CIBIL score');
            }
            console.error('Error fetching current CIBIL score:', err);
            setCurrentScore(null);
        } finally {
            setLoading(false);
        }
    };

    const fetchScoreHistory = async (params?: { page?: number; per_page?: number; current_only?: boolean }) => {
        try {
            setLoading(true);
            setError(null);
            const response = await cibilApi.getCibilScores(params);
            setScoreHistory(response.cibil_scores || []);
        } catch (err: any) {
            setError(err.response?.data?.error || 'Failed to fetch score history');
            console.error('Error fetching CIBIL score history:', err);
        } finally {
            setLoading(false);
        }
    };

    const createScore = async (scoreData: {
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
        total_credit_limit?: number;
        total_outstanding?: number;
        late_payments?: number;
        missed_payments?: number;
        notes?: string;
    }) => {
        try {
            setLoading(true);
            setError(null);
            const newScore = await cibilApi.createCibilScore(scoreData);
            await fetchCurrentScore(); // Refresh current score
            return newScore;
        } catch (err: any) {
            setError(err.response?.data?.error || 'Failed to create CIBIL score');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const getScoreTrend = async (days?: number) => {
        try {
            const trend = await cibilApi.getCibilTrend(days);
            return trend;
        } catch (err: any) {
            console.error('Error fetching CIBIL trend:', err);
            throw err;
        }
    };

    const getScoreSummary = async () => {
        try {
            const summary = await cibilApi.getCibilSummary();
            return summary;
        } catch (err: any) {
            console.error('Error fetching CIBIL summary:', err);
            throw err;
        }
    };

    const verifyScore = async (scoreId: string, verification_date?: string) => {
        try {
            setLoading(true);
            setError(null);
            await cibilApi.verifyCibilScore(scoreId, verification_date);
            await fetchCurrentScore(); // Refresh
        } catch (err: any) {
            setError(err.response?.data?.error || 'Failed to verify score');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCurrentScore();
    }, []);

    return {
        currentScore,
        scoreHistory,
        loading,
        error,
        refetch: fetchCurrentScore,
        fetchScoreHistory,
        createScore,
        getScoreTrend,
        getScoreSummary,
        verifyScore,
    };
};

