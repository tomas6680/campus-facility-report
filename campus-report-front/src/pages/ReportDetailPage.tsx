import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { readErrorMessage } from '../api'

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
    const [note, setNote] = useState('')
    const [actionError, setActionError] = useState('')
    const [changing, setChanging] = useState(false)

    const role = localStorage.getItem('role')
    const canChangeStatus = role === 'STAFF' || role === 'ADMIN'

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

    useEffect(() => {
        const fetchReport = async () => {
            const token = localStorage.getItem('token')
            const res = await fetch(`/api/reports/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            })

            if (!res.ok) {
                if (res.status === 401) {
                    navigate('/login')
                    return
                }
                alert(await readErrorMessage(res))
                navigate('/reports')
                return
            }

            const data = await res.json()
            setReport(data)
        }

        fetchReport()
        fetchHistories()
    }, [id])

    if (!report) {
        return <p className="page-loading">불러오는 중...</p>
    }

    const currentStep = STEPS.indexOf(report.status)
    const nextStatus = STEPS[currentStep + 1]

    const handleChangeStatus = async () => {
        setActionError('')
        setChanging(true)

        try {
            const token = localStorage.getItem('token')
            const res = await fetch(`/api/reports/${id}/status`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ status: nextStatus, note: note || null }),
            })

            if (!res.ok) {
                if (res.status === 401) {
                    alert('로그인이 만료됐습니다. 다시 로그인해 주세요.')
                    navigate('/login')
                    return
                }
                setActionError(await readErrorMessage(res))
                return
            }

            const data = await res.json()
            setReport(data)
            setNote('')
            fetchHistories()
        } catch {
            setActionError('서버에 연결할 수 없습니다.')
        } finally {
            setChanging(false)
        }
    }

    return (
        <>
            <button type="button" className="back-link" onClick={() => navigate('/reports')}>
                <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M15 6l-6 6 6 6" />
                </svg>
                목록으로
            </button>

            <div className="page-head">
                <div>
                    <div className="detail-meta">
                        <span className="detail-id">#{report.id}</span>
                        <span className={`badge risk-${report.riskLevel.toLowerCase()}`}>
                            위험도 {RISK_LEVEL_LABEL[report.riskLevel]}
                        </span>
                        <span className={`badge status-${report.status.toLowerCase()}`}>
                            {STATUS_LABEL[report.status]}
                        </span>
                    </div>
                    <h1 className="page-title">{report.title}</h1>
                </div>
            </div>

            <div className="detail-grid">
                <section className="panel">
                    {/* 처리 단계: 지난 단계는 체크, 현재 단계는 강조 */}
                    <div className="panel-section">
                        <ol className="stepper">
                            {STEPS.map((step, index) => {
                                const done = index < currentStep || report.status === 'DONE'
                                const current = !done && index === currentStep

                                return (
                                    <li
                                        key={step}
                                        className={`step${done ? ' is-done' : ''}${current ? ' is-current' : ''}`}
                                    >
                                        <span className="step-dot">
                                            {done ? (
                                                <svg viewBox="0 0 24 24" aria-hidden="true">
                                                    <path d="M5 12.5l4.5 4.5L19 7.5" />
                                                </svg>
                                            ) : (
                                                index + 1
                                            )}
                                        </span>
                                        <span className="step-label">{STATUS_LABEL[step]}</span>
                                    </li>
                                )
                            })}
                        </ol>
                    </div>

                    <div className="panel-section">
                        <dl className="info-grid">
                            <div>
                                <dt>위치</dt>
                                <dd>{report.facilityName} {report.detailLocation}</dd>
                            </div>
                            <div>
                                <dt>고장 유형</dt>
                                <dd>{FACILITY_TYPE_LABEL[report.facilityType]}</dd>
                            </div>
                            <div>
                                <dt>등록일</dt>
                                <dd>{report.createdAt.replace('T', ' ').slice(0, 16)}</dd>
                            </div>
                            <div>
                                <dt>수정일</dt>
                                <dd>{report.updatedAt.replace('T', ' ').slice(0, 16)}</dd>
                            </div>
                        </dl>
                    </div>

                    <div className="panel-section">
                        <h2 className="panel-title">신고 내용</h2>
                        <p className="content-text">{report.content}</p>
                    </div>
                </section>

                <aside className="detail-side">
                    {canChangeStatus && nextStatus && (
                        <section className="panel panel-section action-panel">
                            <h2 className="panel-title">상태 변경</h2>
                            <p className="action-current">
                                현재 <b>{STATUS_LABEL[report.status]}</b> 단계
                            </p>
                            <div className="action-form">
                                <input
                                    className="input"
                                    type="text"
                                    placeholder="처리 메모 (선택)"
                                    value={note}
                                    onChange={(e) => setNote(e.target.value)}
                                />
                                {actionError && <p className="form-error">{actionError}</p>}
                                <button
                                    type="button"
                                    className="btn btn-primary btn-block"
                                    onClick={handleChangeStatus}
                                    disabled={changing}
                                >
                                    {STATUS_LABEL[nextStatus]} 단계로 변경
                                </button>
                            </div>
                        </section>
                    )}

                    <section className="panel panel-section">
                        <h2 className="panel-title">처리 이력</h2>
                        {histories.length === 0 ? (
                            <p className="empty">아직 처리 이력이 없습니다.</p>
                        ) : (
                            <ol className="timeline">
                                {histories.map((history) => (
                                    <li key={history.id} className="timeline-item">
                                        <div className="timeline-head">
                                            <span className="timeline-status">
                                                {history.fromStatus ? `${STATUS_LABEL[history.fromStatus]} → ` : ''}
                                                {STATUS_LABEL[history.toStatus]}
                                            </span>
                                            <span className="timeline-role">{ROLE_LABEL[history.changedByRole]}</span>
                                        </div>
                                        <div className="timeline-time">
                                            {history.changedAt.replace('T', ' ').slice(0, 16)}
                                        </div>
                                        {history.note && <p className="timeline-note">{history.note}</p>}
                                    </li>
                                ))}
                            </ol>
                        )}
                    </section>
                </aside>
            </div>
        </>
    )
}

export default ReportDetailPage
