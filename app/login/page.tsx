"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { setTokens } from '@/lib/auth';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://46.101.184.103:8080'}/api/v1/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        throw new Error('Invalid credentials');
      }

      const data = await response.json();
      
      // Postman collection states access_token and refresh_token
      setTokens(data.access_token, data.refresh_token);
      
      // Redirect to dashboard explicitly handling role context if necessary in future
      router.push('/');
    } catch (err: any) {
      setError(err.message || 'An error occurred during login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-sm mx-auto overflow-hidden bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
      <div className="px-6 py-4">
        <h2 className="text-3xl font-bold text-center text-gray-800">SmartBed</h2>
        <p className="mt-1 text-center text-gray-500">Sign in to your account</p>

        <form className="mt-6" onSubmit={handleSubmit}>
          {error && (
            <div className="p-3 mb-4 text-sm text-red-500 bg-red-50 rounded">
              {error}
            </div>
          )}
          
          <div className="w-full mt-4">
            <input
              className="block w-full px-4 py-2 mt-2 text-gray-700 placeholder-gray-500 bg-white border rounded-md focus:border-blue-400 focus:ring-opacity-40 focus:outline-none focus:ring focus:ring-blue-300"
              type="email"
              placeholder="Email Address"
              value={email}
              autoComplete="email"
              required
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="w-full mt-4">
            <input
              className="block w-full px-4 py-2 mt-2 text-gray-700 placeholder-gray-500 bg-white border rounded-md focus:border-blue-400 focus:ring-opacity-40 focus:outline-none focus:ring focus:ring-blue-300"
              type="password"
              placeholder="Password"
              value={password}
              autoComplete="current-password"
              required
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="flex items-center justify-between mt-6">
            <button
              disabled={loading}
              className={`w-full px-4 py-2 tracking-wide text-white transition-colors duration-200 transform bg-blue-600 rounded-md hover:bg-blue-500 focus:outline-none focus:bg-blue-500 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
              type="submit"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
