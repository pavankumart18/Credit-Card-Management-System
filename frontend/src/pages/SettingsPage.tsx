import React from 'react'
import PageLayout from '@/components/layout/PageLayout'
import { useTheme } from '@/context/ThemeContext'

const SettingsPage: React.FC = () => {
    const { theme, toggle } = useTheme()
    return (
        <PageLayout>
            <h1 className="text-2xl font-bold mb-4">Settings</h1>
            <div className="rounded-2xl bg-gray-900/60 border border-gray-800 p-4">
                <div className="flex items-center justify-between">
                    <div>
                        <div className="font-semibold">Theme</div>
                        <div className="text-sm text-gray-400">Current: {theme}</div>
                    </div>
                    <button onClick={toggle} className="px-3 py-2 rounded-lg bg-yellow-400 text-black">Toggle</button>
                </div>
            </div>
        </PageLayout>
    )
}

export default SettingsPage

