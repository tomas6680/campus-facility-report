import { useEffect, useState } from 'react'

type Report = {
    id: number
    title: string
    content: string
    facilityName: string
    detailLocation: string
    facilityType: string
    riskLevel: string
    status: string
    createdAt: string
    updatedAt: string
}

function ReportListPage() {
    const [reports, setReports] = useState<Report[]>([])

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
            setReports(data)
        }
        fetchReports()
    }, [])

    return (
        <div>
            <h2>신고 목록</h2>
            <table>
                <thead>
                <tr>
                    <th>번호</th>
                    <th>제목</th>
                    <th>시설</th>
                    <th>위험도</th>
                    <th>상태</th>
                    <th>등록일</th>
                </tr>
                </thead>
                <tbody>
                {reports.map((report) => (
                    <tr key={report.id}>
                        <td>{report.id}</td>
                        <td>{report.title}</td>
                        <td>{report.facilityName}</td>
                        <td>{report.riskLevel}</td>
                        <td>{report.status}</td>
                        <td>{report.createdAt.slice(0, 10)}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    )
}

export default ReportListPage