import { Outlet, useNavigate } from 'react-router-dom'
import BrandIcon from './BrandIcon'

const ROLE_LABEL: Record<string, string> = {
    REPORTER: '신고자',
    STAFF: '담당자',
    ADMIN: '관리자',
}

// 로그인 이후 모든 화면에 공통으로 들어가는 상단 헤더
// 각 페이지 내용은 <Outlet /> 자리에 들어간다 (App.tsx의 라우트 설정 참고)
function AppLayout() {
    const navigate = useNavigate()
    const role = localStorage.getItem('role')

    const handleLogout = () => {
        localStorage.removeItem('token')
        localStorage.removeItem('role')
        navigate('/login')
    }

    return (
        <>
            <header className="app-header">
                <div className="app-header-inner">
                    <button type="button" className="brand" onClick={() => navigate('/reports')}>
                        <span className="brand-badge">
                            <BrandIcon />
                        </span>
                        캠퍼스 안전신고
                    </button>
                    <div className="header-right">
                        {role && <span className="role-chip">{ROLE_LABEL[role] ?? role}</span>}
                        <button type="button" className="btn btn-ghost btn-sm" onClick={handleLogout}>
                            로그아웃
                        </button>
                    </div>
                </div>
            </header>
            <main className="page">
                <Outlet />
            </main>
        </>
    )
}

export default AppLayout
