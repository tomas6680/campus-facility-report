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

    // 상단 요약 숫자
    const pendingCount = reports.filter((report) => report.status !== 'DONE').length
    const urgentCount = reports.filter(
        (report) => report.status !== 'DONE' && report.riskLevel === 'HIGH',
    ).length
    const doneCount = reports.length - pendingCount

    return (
        <>
            <div className="page-head">
                <div>
                    <h1 className="page-title">신고 목록</h1>
                    <p className="page-desc">처리 우선순위 순: 미완료 → 위험도 높은 순 → 먼저 접수된 순</p>
                </div>
                <button type="button" className="btn btn-primary" onClick={() => navigate('/reports/new')}>
                    <svg viewBox="0 0 24 24" aria-hidden="true">
                        <path d="M12 5v14M5 12h14" />
                    </svg>
                    신고 등록
                </button>
            </div>

            <div className="summary">
                <div className="summary-item is-accent">
                    <span className="summary-label">미완료</span>
                    <span className="summary-value">{pendingCount}<small>건</small></span>
                </div>
                <div className="summary-item is-danger">
                    <span className="summary-label">미완료 중 위험도 높음</span>
                    <span className="summary-value">{urgentCount}<small>건</small></span>
                </div>
                <div className="summary-item">
                    <span className="summary-label">완료</span>
                    <span className="summary-value">{doneCount}<small>건</small></span>
                </div>
            </div>

            <div className="panel table-wrap">
                <table className="table">
                    <thead>
                    <tr>
                        <th className="num">순위</th>
                        <th className="num">번호</th>
                        <th>제목</th>
                        <th>시설</th>
                        <th>위험도</th>
                        <th>상태</th>
                        <th>등록일</th>
                    </tr>
                    </thead>
                    <tbody>
                    {reports.map((report, index) => {
                        const isDone = report.status === 'DONE'
                        const isUrgent = !isDone && report.riskLevel === 'HIGH'

                        return (
                            <tr
                                key={report.id}
                                className={`report-row${isDone ? ' is-done' : ''}${isUrgent ? ' is-urgent' : ''}`}
                                onClick={() => navigate(`/reports/${report.id}`)}
                            >
                                <td className="num">
                                    {/* 미완료 상위 3건은 노란색으로 강조 */}
                                    <span className={`rank${!isDone && index < 3 ? ' is-top' : ''}`}>{index + 1}</span>
                                </td>
                                <td className="num muted">{report.id}</td>
                                <td className="title-cell">{report.title}</td>
                                <td>{report.facilityName}</td>
                                <td>
                                    <span className={`badge risk-${report.riskLevel.toLowerCase()}`}>
                                        {RISK_LEVEL_LABEL[report.riskLevel]}
                                    </span>
                                </td>
                                <td>
                                    <span className={`badge status-${report.status.toLowerCase()}`}>
                                        {STATUS_LABEL[report.status]}
                                    </span>
                                </td>
                                <td className="date-cell">{report.createdAt.replace('T', ' ').slice(0, 16)}</td>
                            </tr>
                        )
                    })}
                    </tbody>
                </table>
            </div>
        </>
    )
}

export default ReportListPage
