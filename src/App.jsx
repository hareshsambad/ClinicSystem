import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import api from './services/api'
import ProtectedRoute from './components/ProtectedRoutes'
import Layout from './components/Layout'

// Pages
import Login from './pages/login'
import Dashboard from './pages/Dashboard'
import AdminClinicInfo from './pages/admin/AdminClinicInfo'
import AdminUsers from './pages/admin/AdminUsers'
import PatientAppointments from './pages/patient/PatientAppointments'
import BookAppointment from './pages/patient/BookAppointment'
import AppointmentDetail from './pages/patient/AppointmentDetail'
import PatientPrescriptions from './pages/patient/PatientPrescriptions'
import PatientReports from './pages/patient/PatientReports'
import ReceptionistQueue from './pages/receptionist/ReceptionistQueue'
import DoctorQueue from './pages/doctor/DoctorQueue'
import AddPrescription from './pages/doctor/AddPrescription'
import AddReport from './pages/doctor/AddReport'

function App() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const storedUser = localStorage.getItem('user')
    const token = localStorage.getItem('token')
    if (storedUser && token) {
      try {
        setUser(JSON.parse(storedUser))
      } catch {
        localStorage.removeItem('user')
        localStorage.removeItem('token')
      }
    }
    setLoading(false)
  }, [])

  const login = async (email, password) => {
    try {
      const response = await api.post('/auth/login', { email, password })
      const data = response.data
      const token = data.token
      const userData = data.user || data
      localStorage.setItem('token', token)
      localStorage.setItem('user', JSON.stringify(userData))
      setUser(userData)
      return { success: true }
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Login failed',
      }
    }
  }

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setUser(null)
  }

  return (
    <BrowserRouter>
      <Routes>
        {/* Public */}
        <Route path="/login" element={<Login login={login} />} />

        {/* Protected routes with layout */}
        <Route element={<ProtectedRoute user={user} loading={loading}><Layout user={user} logout={logout} /></ProtectedRoute>}>
          {/* Dashboard — all roles */}
          <Route path="/dashboard" element={<Dashboard user={user} />} />

          {/* Admin */}
          <Route path="/admin/clinic" element={<ProtectedRoute user={user} loading={loading} allowedRoles={["admin"]}><AdminClinicInfo /></ProtectedRoute>} />
          <Route path="/admin/users" element={<ProtectedRoute user={user} loading={loading} allowedRoles={["admin"]}><AdminUsers /></ProtectedRoute>} />

          {/* Patient */}
          <Route path="/appointments" element={<ProtectedRoute user={user} loading={loading} allowedRoles={["patient"]}><PatientAppointments /></ProtectedRoute>} />
          <Route path="/appointments/book" element={<ProtectedRoute user={user} loading={loading} allowedRoles={["patient"]}><BookAppointment /></ProtectedRoute>} />
          <Route path="/appointments/:id" element={<ProtectedRoute user={user} loading={loading} allowedRoles={["patient"]}><AppointmentDetail /></ProtectedRoute>} />
          <Route path="/prescriptions" element={<ProtectedRoute user={user} loading={loading} allowedRoles={["patient"]}><PatientPrescriptions /></ProtectedRoute>} />
          <Route path="/reports" element={<ProtectedRoute user={user} loading={loading} allowedRoles={["patient"]}><PatientReports /></ProtectedRoute>} />

          {/* Receptionist */}
          <Route path="/queue" element={<ProtectedRoute user={user} loading={loading} allowedRoles={["receptionist"]}><ReceptionistQueue /></ProtectedRoute>} />

          {/* Doctor */}
          <Route path="/doctor/queue" element={<ProtectedRoute user={user} loading={loading} allowedRoles={["doctor"]}><DoctorQueue /></ProtectedRoute>} />
          <Route path="/doctor/prescriptions/:appointmentId" element={<ProtectedRoute user={user} loading={loading} allowedRoles={["doctor"]}><AddPrescription /></ProtectedRoute>} />
          <Route path="/doctor/reports/:appointmentId" element={<ProtectedRoute user={user} loading={loading} allowedRoles={["doctor"]}><AddReport /></ProtectedRoute>} />
        </Route>

        {/* Catch-all redirect */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
