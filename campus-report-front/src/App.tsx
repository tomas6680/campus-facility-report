import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import LoginPage from './pages/LoginPage'
import ReportListPage from './pages/ReportListPage'
import ReportCreatePage from './pages/ReportCreatePage'

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Navigate to="/login" />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/reports" element={<ReportListPage />} />
                <Route path="/reports/new" element={<ReportCreatePage />} />
            </Routes>
        </BrowserRouter>
    )
}

export default App