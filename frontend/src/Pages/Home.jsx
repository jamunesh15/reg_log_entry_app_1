import { useContext, useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AuthContext } from '../App'
import { motion } from 'framer-motion'
import Signup from './Signup'

const WelcomeAnimation = ({ name }) => {
  const [visible, setVisible] = useState(true)

  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => setVisible(false), 3000)
    return () => clearTimeout(timer)
  }, [])

  if (!visible) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -50 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-70 z-50"
    >
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg text-center">
        <motion.h1 
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 1, repeat: Infinity }}
          className="text-3xl font-bold text-white mb-4"
        >
          Welcome, {name}!
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-gray-300"
        >
          We're glad to see you here!
        </motion.p>
      </div>
    </motion.div>
  )
}

const Home = () => {
  const { user, isAuthenticated } = useContext(AuthContext)
  const [showWelcome, setShowWelcome] = useState(false)

  useEffect(() => {
    if (isAuthenticated) {
      setShowWelcome(true)
    }
  }, [isAuthenticated])

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-300">
      {showWelcome && <WelcomeAnimation name={user?.name} />}
      <div className="container mx-auto p-4">
        {isAuthenticated ? (
          <div className="max-w-2xl mx-auto mt-10 p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
            <h1 className="text-3xl font-bold mb-6 text-center">
              Thank you for coming here,{' '}
              <span className="text-blue-600 dark:text-blue-400">{user?.name}</span>!
            </h1>
            <p className="text-lg mb-4">
              This will inspire me to create more MERN projects.
            </p>
            <div className="mt-8">
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 }}
                className="bg-gray-200 dark:bg-gray-700 p-4 rounded-lg"
              >
                <h2 className="text-xl font-semibold mb-2">Your Account Details</h2>
                <p>Email: {user?.email}</p>
              </motion.div>
            </div>

   
          </div>
        ) : (
          <div className="max-w-2xl mx-auto mt-10 p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg text-center">
            <h1 className="text-3xl font-bold mb-6">Welcome to AuthApp</h1>
            <p className="text-lg mb-6">
              Please login or signup to access your account.
            </p>
            <div className="flex justify-center space-x-4">
              <Link
                to="/login"
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
              >
                Signup
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Home