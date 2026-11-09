import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

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

const RISK_LEVEL_LABEL: Record<string, string> = {
    HIGH: '높음',
    MEDIUM: '보통',
    LOW: '낮음',
}

const STATUS_LABEL: Record<string, string> = {
    RECEIVED: '접수',
    CONFIRMED: '확인',
    IN_PROGRESS: '처리중',
    DONE: '완료',
}

function ReportListPage() {
    const [reports, setReports] = useState<Report[]>([])
    const navigate = useNavigate()

    useEffect(() => {
        const fetchReports = async () => {
            const token = localStorage.getItem('token')
            const res = await fetch('/api/reports', {
                headers: { Authorization: `Bearer ${token}` },
            })

            if (!res.ok) {
                console.log('조회 실패', res.status)
                if (res.status === 401) {
                    navigate('/login')
                }
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
            <p>처리 우선순위 순: 미완료 → 위험도 높은 순 → 먼저 접수된 순</p>
            <button onClick={() => navigate('/reports/new')}>신고 등록</button>
            <table>
                <thead>
                <tr>
                    <th>순위</th>
                    <th>번호</th>
                    <th>제목</th>
                    <th>시설</th>
                    <th>위험도</th>
                    <th>상태</th>
                    <th>등록일</th>
                </tr>
                </thead>
                <tbody>
                {reports.map((report, index) => (
                    <tr
                        key={report.id}
                        onClick={() => navigate(`/reports/${report.id}`)}
                        style={{ cursor: 'pointer', opacity: report.status === 'DONE' ? 0.5 : 1 }}
                    >
                        <td>{index + 1}</td>
                        <td>{report.id}</td>
                        <td>{report.title}</td>
                        <td>{report.facilityName}</td>
                        <td style={report.riskLevel === 'HIGH' ? { color: '#d32f2f', fontWeight: 'bold' } : undefined}>
                            {RISK_LEVEL_LABEL[report.riskLevel]}
                        </td>
                        <td>{STATUS_LABEL[report.status]}</td>
                        <td>{report.createdAt.replace('T', ' ').slice(0, 16)}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    )
}

export default ReportListPage