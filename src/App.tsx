import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import Lunch from './pages/Lunch'
import Privacy from './pages/Privacy'
import Qr from './pages/Qr'
import Terms from './pages/Terms'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/terms" element={<Terms />} />
      <Route path="/privacy" element={<Privacy />} />
      <Route path="/qr" element={<Qr />} />
      <Route path="/lunch" element={<Lunch />} />
      {/* 알 수 없는 경로는 홈으로 — 빈 화면 대신 */}
      <Route path="*" element={<Home />} />
    </Routes>
  )
}
