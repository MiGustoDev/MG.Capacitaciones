import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { CourseProvider } from './context/CourseContext'
import { Landing } from './pages/Landing'
import { Course } from './pages/Course'

export default function App() {
  return (
    <BrowserRouter>
      <CourseProvider>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/curso" element={<Course />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </CourseProvider>
    </BrowserRouter>
  )
}
