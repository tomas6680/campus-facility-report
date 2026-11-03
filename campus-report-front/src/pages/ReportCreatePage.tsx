import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

type Facility = {
    id: number
    name: string
}

function ReportCreatePage() {
    const navigate = useNavigate()
    const [facilities, setFacilities] = useState<Facility[]>([])

    const [facilityId, setFacilityId] = useState('')
    const [detailLocation, setDetailLocation] = useState('')
    const [facilityType, setFacilityType] = useState('LEAK')
    const [riskLevel, setRiskLevel] = useState('MEDIUM')
    const [title, setTitle] = useState('')
    const [content, setContent] = useState('')

    useEffect(() => {
        const fetchFacilities = async () => {
            const token = localStorage.getItem('token')
            const res = await fetch('/api/facilities', {
                headers: { Authorization: `Bearer ${token}` },
            })

            if (!res.ok) {
                if (res.status === 401 || res.status === 403) {
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
            if (res.status === 401 || res.status === 403) {
                navigate('/login')
                return
            }
            const err = await res.json()
            if (err.errors) {
                alert(Object.values(err.errors).join('\n'))
            } else {
                alert(err.message)
            }
            return
        }

        navigate('/reports')
    }

    return (
        <div>
            <h2>신고 등록</h2>

            <div>
                <label>시설 </label>
                <select value={facilityId} onChange={(e) => setFacilityId(e.target.value)}>
                    <option value="">선택하세요</option>
                    {facilities.map((facility) => (
                        <option key={facility.id} value={facility.id}>
                            {facility.name}
                        </option>
                    ))}
                </select>
            </div>

            <div>
                <label>상세 위치 </label>
                <input
                    value={detailLocation}
                    onChange={(e) => setDetailLocation(e.target.value)}
                    placeholder="예: 3층 남자화장실"
                />
            </div>

            <div>
                <label>고장 유형 </label>
                <select value={facilityType} onChange={(e) => setFacilityType(e.target.value)}>
                    <option value="LIGHTING">조명</option>
                    <option value="HEATING">냉난방</option>
                    <option value="LEAK">누수</option>
                    <option value="ELEVATOR">엘리베이터</option>
                    <option value="SANITATION">위생</option>
                    <option value="SAFETY">안전</option>
                    <option value="ETC">기타</option>
                </select>
            </div>

            <div>
                <label>위험도 </label>
                <select value={riskLevel} onChange={(e) => setRiskLevel(e.target.value)}>
                    <option value="HIGH">높음</option>
                    <option value="MEDIUM">보통</option>
                    <option value="LOW">낮음</option>
                </select>
            </div>

            <div>
                <label>제목 </label>
                <input value={title} onChange={(e) => setTitle(e.target.value)} />
            </div>

            <div>
                <label>내용 </label>
                <textarea value={content} onChange={(e) => setContent(e.target.value)} />
            </div>

            <button onClick={handleSubmit}>등록</button>
            <button onClick={() => navigate('/reports')}>취소</button>
        </div>
    )
}

export default ReportCreatePage