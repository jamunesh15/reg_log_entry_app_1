import { Link } from 'react-router-dom'
import { useContext } from 'react'
import { AuthContext } from '../App'
import { IoSunnyOutline } from "react-icons/io5";
import { LuSunMoon } from "react-icons/lu";


const Navbar = () => {
  const { user, isAuthenticated, logout, darkMode, toggleDarkMode } = useContext(AuthContext)

  return (
    <nav className={`${darkMode ? 'bg-gray-900' : 'bg-gray-800'} text-white p-4 shadow-md`}>
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-xl font-bold">
          AuthApp
        </Link>
        <div className="flex items-center space-x-4">
          {isAuthenticated ? (
            <>
              <span className="hidden md:inline">Hello, {user?.name}</span>
              <button
                onClick={logout}
                className="px-4 py-2 bg-red-600 rounded hover:bg-red-700 transition"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="px-4 py-2 bg-blue-600 rounded hover:bg-blue-700 transition"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="px-4 py-2 bg-green-600 rounded hover:bg-green-700 transition"
              >
                Signup
              </Link>
            </>
          )}
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-full hover:bg-gray-700 transition"
            aria-label="Toggle dark mode"
          >
            {darkMode ? (
            <IoSunnyOutline className="h-5 w-5 text-gray-300" />
            ) : (
             <LuSunMoon  className="h-5 w-5 text-gray-300"  />
            )}
          </button>
        </div>
      </div>
    </nav>
  )
}

export default Navbar