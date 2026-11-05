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

type History = {
    id: number
    fromStatus: string | null
    toStatus: string
    changedByRole: string
    changedAt: string
    note: string | null
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

const STEPS = ['RECEIVED', 'CONFIRMED', 'IN_PROGRESS', 'DONE']

const ROLE_LABEL: Record<string, string> = {
    REPORTER: '신고자',
    STAFF: '담당자',
    ADMIN: '관리자',
}

function ReportDetailPage() {
    const { id } = useParams()
    const navigate = useNavigate()
    const [report, setReport] = useState<Report | null>(null)
    const [histories, setHistories] = useState<History[]>([])

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

        const fetchHistories = async () => {
            const token = localStorage.getItem('token')
            const res = await fetch(`/api/reports/${id}/history`, {
                headers: { Authorization: `Bearer ${token}` },
            })

            if (!res.ok) {
                console.log('이력 조회 실패', res.status)
                return
            }

            const data = await res.json()
            setHistories(data)
        }

        fetchReport()
        fetchHistories()
    }, [id])

    if (!report) {
        return <p>불러오는 중...</p>
    }

    const currentStep = STEPS.indexOf(report.status)

    return (
        <div>
            <h2>{report.title}</h2>
            <p>
                {STEPS.map((step, index) => (
                    <span key={step}>
                        {index > 0 && ' → '}
                        <span
                            style={{
                                fontWeight: index === currentStep ? 'bold' : 'normal',
                                opacity: index > currentStep ? 0.4 : 1,
                            }}
                        >
                            {STATUS_LABEL[step]}
                        </span>
                    </span>
                ))}
            </p>
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
            <h3>처리 이력</h3>
            <table>
                <thead>
                <tr>
                    <th>일시</th>
                    <th>상태 변경</th>
                    <th>처리자</th>
                    <th>메모</th>
                </tr>
                </thead>
                <tbody>
                {histories.map((history) => (
                    <tr key={history.id}>
                        <td>{history.changedAt.replace('T', ' ').slice(0, 16)}</td>
                        <td>
                            {history.fromStatus ? `${STATUS_LABEL[history.fromStatus]} → ` : ''}
                            {STATUS_LABEL[history.toStatus]}
                        </td>
                        <td>{ROLE_LABEL[history.changedByRole]}</td>
                        <td>{history.note}</td>
                    </tr>
                ))}
                </tbody>
            </table>
            <button onClick={() => navigate('/reports')}>목록으로</button>
        </div>
    )
}

export default ReportDetailPage