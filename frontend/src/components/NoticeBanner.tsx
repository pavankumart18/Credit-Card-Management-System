import React, { useState } from 'react'
import { X, RefreshCw } from 'lucide-react'

const NoticeBanner: React.FC = () => {
    const [visible, setVisible] = useState(true)

    if (!visible) return null

    return (
        <div className="bg-gradient-to-r from-yellow-400/10 to-orange-400/10 border-b border-yellow-400/20 px-4 py-2">
            <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
                <div className="flex items-center gap-2 text-sm">
                    <RefreshCw size={16} className="text-yellow-400" />
                    <span className="text-gray-300">
                        <strong className="text-yellow-400">Tip:</strong> If any button or page doesn't work properly, try refreshing the page (
                        <kbd className="px-1.5 py-0.5 bg-gray-800 rounded text-xs">Ctrl+Shift+R</kbd> or{' '}
                        <kbd className="px-1.5 py-0.5 bg-gray-800 rounded text-xs">Cmd+Shift+R</kbd>)
                    </span>
                </div>
                <button
                    onClick={() => setVisible(false)}
                    className="p-1 hover:bg-gray-800 rounded"
                    aria-label="Dismiss"
                >
                    <X size={16} className="text-gray-400" />
                </button>
            </div>
        </div>
    )
}

export default NoticeBanner

