import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { readErrorMessage } from '../api'

type Facility = {
    id: number
    name: string
}

const RISK_OPTIONS = [
    { value: 'HIGH', label: '높음' },
    { value: 'MEDIUM', label: '보통' },
    { value: 'LOW', label: '낮음' },
]

function ReportCreatePage() {
    const navigate = useNavigate()
    const [facilities, setFacilities] = useState<Facility[]>([])

    const [facilityId, setFacilityId] = useState('')
    const [detailLocation, setDetailLocation] = useState('')
    const [facilityType, setFacilityType] = useState('LEAK')
    const [riskLevel, setRiskLevel] = useState('MEDIUM')
    const [title, setTitle] = useState('')
    const [content, setContent] = useState('')

    const [error, setError] = useState('')
    const [submitting, setSubmitting] = useState(false)

    useEffect(() => {
        const fetchFacilities = async () => {
            const token = localStorage.getItem('token')
            const res = await fetch('/api/facilities', {
                headers: { Authorization: `Bearer ${token}` },
            })

            if (!res.ok) {
                if (res.status === 401) {
                    navigate('/login')
                }
                return
            }

            const data = await res.json()
            setFacilities(data)
        }
        fetchFacilities()
    }, [])

    const handleSubmit = async () => {
        setError('')
        setSubmitting(true) // 등록 중에는 버튼을 막아서 중복 등록 방지

        try {
            const token = localStorage.getItem('token')
            const res = await fetch('/api/reports', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    facilityId: facilityId ? Number(facilityId) : null,
                    detailLocation,
                    facilityType,
                    riskLevel,
                    title,
                    content,
                }),
            })

            if (!res.ok) {
                if (res.status === 401) {
                    navigate('/login')
                    return
                }
                setError(await readErrorMessage(res))
                return
            }

            navigate('/reports')
        } catch {
            setError('서버에 연결할 수 없습니다.')
        } finally {
            setSubmitting(false)
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
                    <h1 className="page-title">신고 등록</h1>
                    <p className="page-desc">고장이나 위험 요소를 알려주세요. 위험도가 높을수록 먼저 처리됩니다.</p>
                </div>
            </div>

            <div className="panel form-panel">
                <div className="form-grid">
                    <div className="field">
                        <label className="field-label" htmlFor="report-facility">시설</label>
                        <select
                            id="report-facility"
                            className="select"
                            value={facilityId}
                            onChange={(e) => setFacilityId(e.target.value)}
                        >
                            <option value="">선택하세요</option>
                            {facilities.map((facility) => (
                                <option key={facility.id} value={facility.id}>
                                    {facility.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="field">
                        <label className="field-label" htmlFor="report-location">상세 위치</label>
                        <input
                            id="report-location"
                            className="input"
                            value={detailLocation}
                            onChange={(e) => setDetailLocation(e.target.value)}
                            placeholder="예: 3층 남자화장실"
                        />
                    </div>

                    <div className="field">
                        <label className="field-label" htmlFor="report-type">고장 유형</label>
                        <select
                            id="report-type"
                            className="select"
                            value={facilityType}
                            onChange={(e) => setFacilityType(e.target.value)}
                        >
                            <option value="LIGHTING">조명</option>
                            <option value="HEATING">냉난방</option>
                            <option value="LEAK">누수</option>
                            <option value="ELEVATOR">엘리베이터</option>
                            <option value="SANITATION">위생</option>
                            <option value="SAFETY">안전</option>
                            <option value="ETC">기타</option>
                        </select>
                    </div>

                    <div className="field">
                        <span className="field-label">위험도</span>
                        {/* select 대신 버튼 3개로 선택 (선택된 값에 따라 색이 바뀜) */}
                        <div className="segmented">
                            {RISK_OPTIONS.map((option) => (
                                <button
                                    key={option.value}
                                    type="button"
                                    aria-pressed={riskLevel === option.value}
                                    className={`seg-btn risk-${option.value.toLowerCase()}${riskLevel === option.value ? ' active' : ''}`}
                                    onClick={() => setRiskLevel(option.value)}
                                >
                                    {option.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="field is-full">
                        <label className="field-label" htmlFor="report-title">제목</label>
                        <input
                            id="report-title"
                            className="input"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="예: 3층 화장실 천장 누수"
                        />
                    </div>

                    <div className="field is-full">
                        <label className="field-label" htmlFor="report-content">내용</label>
                        <textarea
                            id="report-content"
                            className="textarea"
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            placeholder="언제부터, 어떤 상태인지 적어 주세요."
                        />
                    </div>
                </div>

                {error && <p className="form-error">{error}</p>}

                <div className="form-actions">
                    <button type="button" className="btn btn-ghost" onClick={() => navigate('/reports')}>
                        취소
                    </button>
                    <button type="button" className="btn btn-primary" onClick={handleSubmit} disabled={submitting}>
                        {submitting ? '등록 중...' : '신고 등록'}
                    </button>
                </div>
            </div>
        </>
    )
}

export default ReportCreatePage
