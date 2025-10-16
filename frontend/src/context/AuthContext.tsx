import React, { createContext, useContext, useState, useEffect } from 'react'
import { User } from '@/types'
import { authApi } from '@/services/api'
import { setAuthToken, removeAuthToken, setUserData, getUserData, removeUserData, clearAuthData } from '@/config/api.config'

type AuthContextValue = {
    user: User | null
    loading: boolean
    isAuthenticated: boolean
    login: (username: string, password: string) => Promise<void>
    signup: (userData: any) => Promise<void>
    logout: () => void
    updateUser: (userData: any) => Promise<void>
    refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null)
    const [loading, setLoading] = useState(true)

    // Initialize auth state from localStorage
    useEffect(() => {
        const initAuth = async () => {
            try {
                const savedUser = getUserData()
                if (savedUser) {
                    // Verify token is still valid by fetching current user
                    const response = await authApi.getCurrentUser()
                    const backendUser = response

                    // Transform backend user to frontend User type
                    const transformedUser: User = {
                        id: backendUser._id || backendUser.id,
                        name: `${backendUser.first_name} ${backendUser.last_name}`,
                        email: backendUser.email,
                        cibilScore: backendUser.cibil_score || 0,
                        username: backendUser.username,
                        firstName: backendUser.first_name,
                        lastName: backendUser.last_name,
                        phoneNumber: backendUser.phone_number,
                        address: backendUser.address,
                    }

                    setUser(transformedUser)
                    setUserData(transformedUser)
                }
            } catch (error) {
                console.error('Failed to initialize auth:', error)
                clearAuthData()
                setUser(null)
            } finally {
                setLoading(false)
            }
        }

        initAuth()
    }, [])

    const login = async (username: string, password: string) => {
        try {
            setLoading(true)
            const response = await authApi.login(username, password)

            // Store token
            setAuthToken(response.token)

            // Transform backend user to frontend User type
            const backendUser = response.user
            const transformedUser: User = {
                id: backendUser._id || backendUser.id,
                name: `${backendUser.first_name} ${backendUser.last_name}`,
                email: backendUser.email,
                cibilScore: backendUser.cibil_score || 0,
                username: backendUser.username,
                firstName: backendUser.first_name,
                lastName: backendUser.last_name,
                phoneNumber: backendUser.phone_number,
                address: backendUser.address,
            }

            setUser(transformedUser)
            setUserData(transformedUser)
        } catch (error: any) {
            console.error('Login failed:', error)
            throw new Error(error.response?.data?.error || 'Login failed')
        } finally {
            setLoading(false)
        }
    }

    const signup = async (userData: any) => {
        try {
            setLoading(true)
            const response = await authApi.signup(userData)

            // Store token
            setAuthToken(response.token)

            // Transform backend user to frontend User type
            const backendUser = response.user
            const transformedUser: User = {
                id: backendUser._id || backendUser.id,
                name: `${backendUser.first_name} ${backendUser.last_name}`,
                email: backendUser.email,
                cibilScore: backendUser.cibil_score || 0,
                username: backendUser.username,
                firstName: backendUser.first_name,
                lastName: backendUser.last_name,
                phoneNumber: backendUser.phone_number,
                address: backendUser.address,
            }

            setUser(transformedUser)
            setUserData(transformedUser)
        } catch (error: any) {
            console.error('Signup failed:', error)
            throw new Error(error.response?.data?.error || 'Signup failed')
        } finally {
            setLoading(false)
        }
    }

    const logout = () => {
        clearAuthData()
        setUser(null)
        window.location.href = '/auth'
    }

    const updateUser = async (userData: any) => {
        if (!user) return

        try {
            const response = await authApi.updateProfile(user.id.toString(), userData)
            const backendUser = response

            const transformedUser: User = {
                id: backendUser._id || backendUser.id,
                name: `${backendUser.first_name} ${backendUser.last_name}`,
                email: backendUser.email,
                cibilScore: backendUser.cibil_score || 0,
                username: backendUser.username,
                firstName: backendUser.first_name,
                lastName: backendUser.last_name,
                phoneNumber: backendUser.phone_number,
                address: backendUser.address,
            }

            setUser(transformedUser)
            setUserData(transformedUser)
        } catch (error: any) {
            console.error('Update user failed:', error)
            throw new Error(error.response?.data?.error || 'Update failed')
        }
    }

    const refreshUser = async () => {
        try {
            const response = await authApi.getCurrentUser()
            const backendUser = response

            const transformedUser: User = {
                id: backendUser._id || backendUser.id,
                name: `${backendUser.first_name} ${backendUser.last_name}`,
                email: backendUser.email,
                cibilScore: backendUser.cibil_score || 0,
                username: backendUser.username,
                firstName: backendUser.first_name,
                lastName: backendUser.last_name,
                phoneNumber: backendUser.phone_number,
                address: backendUser.address,
            }

            setUser(transformedUser)
            setUserData(transformedUser)
        } catch (error: any) {
            console.error('Refresh user failed:', error)
            throw new Error(error.response?.data?.error || 'Refresh failed')
        }
    }

    return (
        <AuthContext.Provider value={{
            user,
            loading,
            isAuthenticated: !!user,
            login,
            signup,
            logout,
            updateUser,
            refreshUser
        }}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    const ctx = useContext(AuthContext)
    if (!ctx) throw new Error('useAuth must be used within AuthProvider')
    return ctx
}

