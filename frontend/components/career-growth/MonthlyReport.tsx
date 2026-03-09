import React from 'react'

const MonthlyReport = () => {
    return (
        <div className="p-4 border rounded-lg bg-card">
            <h3 className="text-lg font-semibold">Monthly Career Growth Report</h3>
            <p className="text-muted-foreground">Detailed analysis of your progress this month.</p>
        </div>
    )
}

export const CareerReportList = () => {
    return (
        <div className="space-y-4">
            <p className="text-sm text-muted-foreground">No reports generated yet.</p>
        </div>
    )
}

export default MonthlyReport
