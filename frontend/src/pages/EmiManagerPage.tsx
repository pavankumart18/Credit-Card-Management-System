import React from 'react'
import PageLayout from '@/components/layout/PageLayout'
import EMIManager from '@/components/EMIManager'

const EmiManagerPage: React.FC = () => {
    return (
        <PageLayout>
            <h1 className="text-2xl font-bold mb-4">EMI Manager</h1>
            <EMIManager />
        </PageLayout>
    )
}

export default EmiManagerPage

