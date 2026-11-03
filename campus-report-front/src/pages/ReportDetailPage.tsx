import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

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

const FACILITY_TYPE_LABEL: Record<string, string> = {
    LIGHTING: '조명',
    HEATING: '냉난방',
    LEAK: '누수',
    ELEVATOR: '엘리베이터',
    SANITATION: '위생',
    SAFETY: '안전',
    ETC: '기타',
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

function ReportDetailPage() {
    const { id } = useParams()
    const navigate = useNavigate()
    const [report, setReport] = useState<Report | null>(null)

    useEffect(() => {
        const fetchReport = async () => {
            const token = localStorage.getItem('token')
            const res = await fetch(`/api/reports/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            })

            if (!res.ok) {
                if (res.status === 401 || res.status === 403) {
                    navigate('/login')
                    return
                }
                const err = await res.json()
                alert(err.message)
                navigate('/reports')
                return
            }

            const data = await res.json()
            setReport(data)
        }
        fetchReport()
    }, [id])

    if (!report) {
        return <p>불러오는 중...</p>
    }

    return (
        <div>
            <h2>{report.title}</h2>
            <table>
                <tbody>
                <tr><th>번호</th><td>{report.id}</td></tr>
                <tr><th>위치</th><td>{report.facilityName} {report.detailLocation}</td></tr>
                <tr><th>고장 유형</th><td>{FACILITY_TYPE_LABEL[report.facilityType]}</td></tr>
                <tr><th>위험도</th><td>{RISK_LEVEL_LABEL[report.riskLevel]}</td></tr>
                <tr><th>상태</th><td>{STATUS_LABEL[report.status]}</td></tr>
                <tr><th>등록일</th><td>{report.createdAt.replace('T', ' ').slice(0, 16)}</td></tr>
                <tr><th>수정일</th><td>{report.updatedAt.replace('T', ' ').slice(0, 16)}</td></tr>
                </tbody>
            </table>
            <h3>내용</h3>
            <p>{report.content}</p>
            <button onClick={() => navigate('/reports')}>목록으로</button>
        </div>
    )
}

export default ReportDetailPage