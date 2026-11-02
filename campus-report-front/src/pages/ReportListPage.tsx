import { useEffect } from 'react'

function ReportListPage() {
    useEffect(() => {
        const fetchReports = async () => {
            const token = localStorage.getItem('token')
            const res = await fetch('/api/reports', {
                headers: { Authorization: `Bearer ${token}` },
            })

            if (!res.ok) {
                console.log('조회 실패', res.status)
                return
            }

            const data = await res.json()
            console.log('신고 목록', data)
        }
        fetchReports()
    }, [])

    return <h2>신고 목록</h2>
}

export default ReportListPage