import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import AppLayout from './components/AppLayout'
import LoginPage from './pages/LoginPage'
import ReportListPage from './pages/ReportListPage'
import ReportCreatePage from './pages/ReportCreatePage'
import ReportDetailPage from './pages/ReportDetailPage'

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Navigate to="/login" />} />
                <Route path="/login" element={<LoginPage />} />
                {/* 로그인 이후 화면: 공통 헤더(AppLayout) 안에 표시 */}
                <Route element={<AppLayout />}>
                    <Route path="/reports" element={<ReportListPage />} />
                    <Route path="/reports/new" element={<ReportCreatePage />} />
                    <Route path="/reports/:id" element={<ReportDetailPage />} />
                </Route>
            </Routes>
        </BrowserRouter>
    )
}

export default App
