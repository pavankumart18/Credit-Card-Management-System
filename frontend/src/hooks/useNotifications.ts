import { useState, useEffect } from 'react';
import { notificationsApi } from '@/services/api';

export interface NotificationData {
    _id?: string;
    id?: string | number;
    user_id?: string;
    title?: string;
    message?: string;
    body?: string;
    notification_type?: string;
    priority?: string;
    is_read?: boolean;
    read?: boolean;
    channels?: string[];
    related_entity_type?: string;
    related_entity_id?: string;
    action_url?: string;
    action_text?: string;
    requires_action?: boolean;
    metadata?: any;
    tags?: string[];
    expires_at?: string;
    sent_at?: string;
    read_at?: string;
    date?: string;
    created_at?: string;
}

export const useNotifications = (filters?: {
    page?: number;
    per_page?: number;
    type?: string;
    priority?: string;
    is_read?: boolean;
    unread_only?: boolean;
}) => {
    const [notifications, setNotifications] = useState<NotificationData[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [pagination, setPagination] = useState({
        total: 0,
        pages: 0,
        currentPage: 1,
        perPage: 10,
    });
    const [unreadCount, setUnreadCount] = useState(0);

    const fetchNotifications = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await notificationsApi.getNotifications(filters);

            // Transform backend data to frontend format
            const transformedNotifications = response.notifications.map((notif: any) => ({
                ...notif,
                id: notif._id || notif.id,
                body: notif.message,
                read: notif.is_read,
                date: notif.created_at,
            }));

            setNotifications(transformedNotifications);
            setPagination({
                total: response.total,
                pages: response.pages,
                currentPage: response.current_page,
                perPage: response.per_page,
            });

            // Calculate unread count
            const unread = transformedNotifications.filter((n: any) => !n.read).length;
            setUnreadCount(unread);
        } catch (err: any) {
            setError(err.response?.data?.error || 'Failed to fetch notifications');
            console.error('Error fetching notifications:', err);
        } finally {
            setLoading(false);
        }
    };

    const createNotification = async (notificationData: {
        title: string;
        message: string;
        notification_type: string;
        priority?: string;
        action_url?: string;
        action_text?: string;
        metadata?: any;
    }) => {
        try {
            setLoading(true);
            setError(null);
            const newNotification = await notificationsApi.createNotification(notificationData);
            await fetchNotifications(); // Refresh the list
            return newNotification;
        } catch (err: any) {
            setError(err.response?.data?.error || 'Failed to create notification');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const markAsRead = async (notificationId: string) => {
        try {
            await notificationsApi.markAsRead(notificationId);

            // Optimistically update the UI
            setNotifications(prev =>
                prev.map(n => n.id === notificationId ? { ...n, read: true, is_read: true } : n)
            );
            setUnreadCount(prev => Math.max(0, prev - 1));
        } catch (err: any) {
            setError(err.response?.data?.error || 'Failed to mark as read');
            await fetchNotifications(); // Revert on error
            throw err;
        }
    };

    const markAsUnread = async (notificationId: string) => {
        try {
            await notificationsApi.markAsUnread(notificationId);

            // Optimistically update the UI
            setNotifications(prev =>
                prev.map(n => n.id === notificationId ? { ...n, read: false, is_read: false } : n)
            );
            setUnreadCount(prev => prev + 1);
        } catch (err: any) {
            setError(err.response?.data?.error || 'Failed to mark as unread');
            await fetchNotifications(); // Revert on error
            throw err;
        }
    };

    const markAllAsRead = async () => {
        try {
            setLoading(true);
            setError(null);
            await notificationsApi.markAllAsRead();
            await fetchNotifications(); // Refresh the list
        } catch (err: any) {
            setError(err.response?.data?.error || 'Failed to mark all as read');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const deleteNotification = async (notificationId: string) => {
        try {
            await notificationsApi.deleteNotification(notificationId);

            // Optimistically update the UI
            setNotifications(prev => prev.filter(n => n.id !== notificationId));
            setPagination(prev => ({ ...prev, total: prev.total - 1 }));
        } catch (err: any) {
            setError(err.response?.data?.error || 'Failed to delete notification');
            await fetchNotifications(); // Revert on error
            throw err;
        }
    };

    const getNotificationsSummary = async () => {
        try {
            const summary = await notificationsApi.getNotificationsSummary();
            return summary;
        } catch (err: any) {
            console.error('Error fetching notifications summary:', err);
            throw err;
        }
    };

    useEffect(() => {
        fetchNotifications();
    }, [filters?.page, filters?.type, filters?.unread_only]);

    return {
        notifications,
        loading,
        error,
        pagination,
        unreadCount,
        refetch: fetchNotifications,
        createNotification,
        markAsRead,
        markAsUnread,
        markAllAsRead,
        deleteNotification,
        getNotificationsSummary,
    };
};
