import { useState, useEffect, createContext } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Home from './Pages/Home'
import Login from './Pages/Login'
import Signup from './Pages/Signup'
import Navbar from './Pages/Navbar'


export const AuthContext = createContext()

const API_BASE_URL = 'http://localhost:8080'

function App() {
  const [user, setUser] = useState(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)
  const [darkMode, setDarkMode] = useState(() => {
    return JSON.parse(localStorage.getItem('darkMode')) ?? true
  })

  // API Functions
  const loginUser = async (email, password) => {
    const response = await fetch(`${API_BASE_URL}/login`, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    })
    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || 'Login failed')
    }
    return await response.json()
  }

  const registerUser = async (name, email, password) => {
    const response = await fetch(`${API_BASE_URL}/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password }),
    })
    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || 'Registration failed')
    }
    return await response.json()
  }

  const checkAuthStatus = async () => {
    const response = await fetch(`${API_BASE_URL}/check-auth`, {
      credentials: 'include',
    })
    if (!response.ok) throw new Error('Not authenticated')
    return await response.json()
  }

  // Auth Actions
  const login = async (email, password) => {
    try {
      const data = await loginUser(email, password)
      setUser(data.user)
      setIsAuthenticated(true)
    } catch (error) {
      throw error
    }
  }

  const signup = async (name, email, password) => {
    try {
      const data = await registerUser(name, email, password)
      setUser(data.user)
      setIsAuthenticated(true)
    } catch (error) {
      throw error
    }
  }

  const logout = () => {
    setUser(null)
    setIsAuthenticated(false)
    document.cookie = 'cookies=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;'
  }

  // Effects
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const data = await checkAuthStatus()
        setUser(data.user)
        setIsAuthenticated(true)
      } catch (error) {
        console.error('Auth check failed:', error)
      } finally {
        setLoading(false)
      }
    }
    checkAuth()
  }, [])

  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(darkMode))
    if (darkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [darkMode])

  const toggleDarkMode = () => setDarkMode(!darkMode)

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated,
      login,
      signup,
      logout,
      darkMode,
      toggleDarkMode
    }}>
      <Router>
        <div className={`min-h-screen ${darkMode ? 'dark' : ''}`}>
          <Navbar/>
          <Routes>
            <Route path="/" element={ <Home/> } />
            <Route path="/login" element={<Login/>} />
            <Route path="/signup" element={<Signup/>} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </div>
      </Router>
    </AuthContext.Provider>
  )
}

export default App