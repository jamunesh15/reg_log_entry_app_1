import { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../App';
import { motion } from 'framer-motion';
import { HiArrowPath } from "react-icons/hi2";

const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [signupStep, setSignupStep] = useState('signup'); // 'signup' | 'logging-in' | 'complete'
  const { signup, login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    setSignupStep('signup');

    try {
      // 1. First complete signup
      await signup(name, email, password);
      setSignupStep('logging-in');
      
      // 2. Then automatically login
      await login(email, password);
      setSignupStep('complete');
      
      // 3. Redirect to home after brief delay
      setTimeout(() => navigate('/'), 1000);
      
    } catch (err) {
      setError(err.message || 'Signup failed. Please try again.');
      setSignupStep('signup');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md p-8 space-y-8 bg-white dark:bg-gray-800 rounded-lg shadow-lg"
      >
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white">
            {signupStep === 'logging-in' ? 'Almost there!' : 'Create an account'}
          </h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            {signupStep === 'logging-in' 
              ? 'Logging you in...'
              : signupStep === 'complete'
              ? 'Welcome! Redirecting...'
              : 'Or '}
            {signupStep === 'signup' && (
              <Link
                to="/login"
                className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
              >
                login to existing account
              </Link>
            )}
          </p>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
            {error}
          </div>
        )}

        {signupStep === 'signup' ? (
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="rounded-md shadow-sm space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Full Name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                  placeholder="Full name"
                  disabled={loading}
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Email address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                  placeholder="Email address"
                  disabled={loading}
                />
              </div>
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                  placeholder="Password"
                  disabled={loading}
                />
              </div>
            </div>
            <div>
              <button
                type="submit"
                disabled={loading}
                className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 ${
                  loading ? 'opacity-70 cursor-not-allowed' : ''
                }`}
              >
                {loading ? (
                  <span className="flex items-center">
                    <HiArrowPath className="animate-spin h-4 w-4 mr-2" />
                    Creating account...
                  </span>
                ) : (
                  'Sign up'
                )}
              </button>
            </div>
          </form>
        ) : (
          <div className="text-center py-8">
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
            <p className="mt-4 text-gray-600 dark:text-gray-300">
              {signupStep === 'logging-in'
                ? 'Logging you in automatically...'
                : 'Welcome! Redirecting to your account...'}
            </p>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default Signup;