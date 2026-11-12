import { useEffect, useRef, useState } from 'react'
import type { FormEvent, MouseEvent, PointerEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { readErrorMessage } from '../api'
import BrandIcon from '../components/BrandIcon'
import './LoginPage.css'

const CORD_LENGTH = 84 // 스탠드 줄 기본 길이(px)
const PULL_MAX = 60 // 최대로 당길 수 있는 길이(px)
const PULL_TRIGGER = 28 // 이만큼 당기는 순간 딸깍 하고 불이 켜지고 꺼짐
const SOUND_VOLUME = 0.6 // 딸깍 소리 크기 (0 ~ 1)

// 스탠드 켜고 끌 때 나는 딸깍 소리 (public/sounds 폴더의 효과음 파일)
const lampOnSound = new Audio('/sounds/lamp-on.wav')
const lampOffSound = new Audio('/sounds/lamp-off.wav')
lampOnSound.volume = SOUND_VOLUME
lampOffSound.volume = SOUND_VOLUME

function LoginPage() {
    const [loginId, setLoginId] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    // ----- 스탠드 상태 -----
    const [lampOn, setLampOn] = useState(false) // 불 켜짐 여부 (켜져야 로그인 카드가 보임)
    const [pull, setPull] = useState(0) // 지금 줄이 아래로 당겨진 길이(px)
    const [dragging, setDragging] = useState(false) // 줄을 잡고 있는 중인지
    const dragStartY = useRef(0) // 줄을 잡은 순간의 마우스 y좌표
    const dragged = useRef(false) // 실제로 끌어당겼는지 (그냥 클릭과 구분)
    const pullToggled = useRef(false) // 이번에 당기는 동안 이미 켜고/껐는지
    const loginIdRef = useRef<HTMLInputElement>(null)

    // 불이 켜지면 카드가 나타난 뒤 아이디 칸에 커서를 둔다
    useEffect(() => {
        if (!lampOn) return
        const timer = setTimeout(() => loginIdRef.current?.focus(), 500)
        return () => clearTimeout(timer)
    }, [lampOn])

    // 불 켜기/끄기 + 딸깍 소리
    const toggleLamp = () => {
        const sound = lampOn ? lampOffSound : lampOnSound
        sound.currentTime = 0 // 빠르게 연달아 당겨도 처음부터 재생
        sound.play().catch(() => {}) // 브라우저가 소리를 막아도 켜고 끄기는 그대로 동작
        setLampOn(!lampOn)
    }

    // 줄을 잡았을 때
    const handleCordDown = (e: PointerEvent<HTMLButtonElement>) => {
        dragStartY.current = e.clientY
        dragged.current = false
        pullToggled.current = false
        setDragging(true)
        e.currentTarget.setPointerCapture(e.pointerId) // 마우스가 줄 밖으로 나가도 계속 따라오게
    }

    // 당기는 중: 아래로 움직인 만큼 줄이 늘어남 (0 ~ PULL_MAX)
    const handleCordMove = (e: PointerEvent<HTMLButtonElement>) => {
        if (!dragging) return
        const distance = Math.min(Math.max(e.clientY - dragStartY.current, 0), PULL_MAX)
        if (distance > 4) dragged.current = true
        setPull(distance)

        // 충분히 당기는 순간 딸깍 (진짜 스탠드처럼 놓기 전에 켜지고 꺼짐, 한 번 당길 때 한 번만)
        if (distance >= PULL_TRIGGER && !pullToggled.current) {
            pullToggled.current = true
            toggleLamp()
        }
    }

    // 놓았을 때(또는 터치가 취소됐을 때): 줄만 제자리로 돌아감
    const handleCordUp = () => {
        if (!dragging) return
        setDragging(false)
        setPull(0)
    }

    // 그냥 클릭하거나 키보드(Enter, Space)로 눌러도 한 번 당긴 것처럼 동작
    const handleCordClick = (e: MouseEvent<HTMLButtonElement>) => {
        const fromKeyboard = e.detail === 0
        if (!fromKeyboard && dragged.current) return // 드래그로 이미 처리함
        setPull(PULL_TRIGGER + 10)
        setTimeout(() => setPull(0), 150)
        toggleLamp()
    }

    const handleLogin = async (e: FormEvent) => {
        e.preventDefault()
        setError('')
        setLoading(true)

        try {
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ loginId, password }),
            })

            if (!res.ok) {
                setError(await readErrorMessage(res))
                return
            }

            const data = await res.json()
            localStorage.setItem('token', data.token)
            localStorage.setItem('role', data.role)
            navigate('/reports')
        } catch {
            setError('서버에 연결할 수 없습니다.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className={`login-page${lampOn ? ' is-on' : ''}`}>
            <div className="login-scene">
                {/* ----- 스탠드 ----- */}
                <div className="lamp">
                    <svg className="lamp-svg" viewBox="0 0 320 440" aria-hidden="true">
                        <defs>
                            <linearGradient id="lamp-beam" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0" stopColor="#ffd60a" stopOpacity="0.5" />
                                <stop offset="1" stopColor="#ffd60a" stopOpacity="0.04" />
                            </linearGradient>
                            <radialGradient id="lamp-floor">
                                <stop offset="0" stopColor="#ffd60a" stopOpacity="0.35" />
                                <stop offset="1" stopColor="#ffd60a" stopOpacity="0" />
                            </radialGradient>
                            <linearGradient id="lamp-shade" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0" stopColor="#3d3d42" />
                                <stop offset="1" stopColor="#1c1c1f" />
                            </linearGradient>
                            <filter id="lamp-blur" x="-50%" y="-50%" width="200%" height="200%">
                                <feGaussianBlur stdDeviation="8" />
                            </filter>
                            <filter id="lamp-soft">
                                <feGaussianBlur stdDeviation="2.5" />
                            </filter>
                        </defs>

                        {/* 불빛 (켜졌을 때만 보임) */}
                        <g className="lamp-light">
                            <polygon points="100,118 220,118 318,404 2,404" fill="url(#lamp-beam)" filter="url(#lamp-soft)" />
                            <ellipse cx="160" cy="404" rx="160" ry="30" fill="url(#lamp-floor)" />
                        </g>

                        {/* 받침, 기둥 */}
                        <ellipse cx="160" cy="405" rx="54" ry="10" fill="#1b1b1e" />
                        <ellipse cx="160" cy="401" rx="54" ry="9" fill="#2a2a2e" />
                        <rect x="157" y="112" width="6" height="290" fill="#26262a" />

                        {/* 갓 */}
                        <rect x="153" y="26" width="14" height="12" rx="3" fill="#2e2e33" />
                        <path d="M78 112 C78 62 116 36 160 36 C204 36 242 62 242 112 Z" fill="url(#lamp-shade)" />
                        <path
                            d="M98 90 C104 66 126 50 150 46"
                            fill="none"
                            stroke="#ffffff"
                            strokeOpacity="0.08"
                            strokeWidth="3"
                            strokeLinecap="round"
                        />
                        <rect x="74" y="108" width="172" height="7" rx="3.5" fill="#2e2e33" />

                        {/* 전구: 평소엔 어두운 색, 켜지면 밝은 빛이 위에 겹쳐짐 */}
                        <ellipse cx="160" cy="116" rx="34" ry="6" fill="#2a2a2e" />
                        <g className="lamp-glow">
                            <ellipse cx="160" cy="118" rx="64" ry="18" fill="#ffd60a" opacity="0.55" filter="url(#lamp-blur)" />
                            <ellipse cx="160" cy="116" rx="34" ry="6" fill="#fff4c4" />
                        </g>
                    </svg>

                    {/* 당기는 줄: 드래그로 당기거나, 클릭·키보드로 눌러도 됨 */}
                    <button
                        type="button"
                        className={`lamp-cord${dragging ? ' is-dragging' : ''}`}
                        aria-label={lampOn ? '조명 끄기' : '조명 켜기'}
                        aria-pressed={lampOn}
                        onPointerDown={handleCordDown}
                        onPointerMove={handleCordMove}
                        onPointerUp={handleCordUp}
                        onPointerCancel={handleCordUp}
                        onClick={handleCordClick}
                    >
                        <span className="cord-line" style={{ height: CORD_LENGTH + pull }} />
                        <span className="cord-bead">
                            <span className="lamp-hint" aria-hidden="true">줄을 당겨 불을 켜세요</span>
                        </span>
                    </button>
                </div>

                {/* ----- 로그인 카드: 불이 꺼져 있으면 숨김 (inert = 클릭·탭 이동도 막음) ----- */}
                <form className="login-card" onSubmit={handleLogin} inert={!lampOn}>
                    <div className="login-badge">
                        <BrandIcon />
                    </div>
                    <h1 className="login-title">캠퍼스 안전신고</h1>
                    <p className="login-subtitle">시설 고장·안전 신고 우선처리 시스템</p>

                    <label className="login-field">
                        <svg viewBox="0 0 24 24" aria-hidden="true">
                            <circle cx="12" cy="8" r="4" />
                            <path d="M4 21c0-4 4-6 8-6s8 2 8 6" />
                        </svg>
                        <input
                            ref={loginIdRef}
                            type="text"
                            placeholder="아이디"
                            value={loginId}
                            onChange={(e) => setLoginId(e.target.value)}
                            autoComplete="username"
                            required
                        />
                    </label>

                    <label className="login-field">
                        <svg viewBox="0 0 24 24" aria-hidden="true">
                            <rect x="5" y="11" width="14" height="10" rx="2" />
                            <path d="M8 11V7a4 4 0 0 1 8 0v4" />
                        </svg>
                        <input
                            type="password"
                            placeholder="비밀번호"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            autoComplete="current-password"
                            required
                        />
                    </label>

                    {error && <p className="login-error">{error}</p>}

                    <button className="login-button" type="submit" disabled={loading}>
                        {loading ? '로그인 중...' : '로그인'}
                    </button>
                </form>
            </div>
        </div>
    )
}

export default LoginPage
