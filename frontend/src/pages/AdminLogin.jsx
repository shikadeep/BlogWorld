import axios from 'axios';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AdminLogin = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [msg, setMsg] = useState('');
    const [isLogin, setIsLogin] = useState(false);
    const navigate = useNavigate();

    const adminSignup = async (e) => {
        e.preventDefault();
        setMsg('');

        try {
            const url = isLogin
                ? `${import.meta.env.VITE_BACKEND}/api/login`
                : `${import.meta.env.VITE_BACKEND}/api/register`;

            const res = await axios.post(url, { email, password });

            setMsg(res.data.message);
            console.log(res.data.message);

            // On successful login, store token and userId, then navigate
            if (isLogin && res.data.token) {
                localStorage.setItem('token', res.data.token);
                localStorage.setItem('userId', res.data.user.id);
                localStorage.setItem('userEmail', res.data.user.email); // ✅ Make sure this line exists
                navigate(`/dashboard/${res.data.user.id}`);
            }

            // On signup, optionally auto-switch to login form or notify
            if (!isLogin) {
                setIsLogin(true);
                setMsg('Signup successful. Please log in.');
            }

        } catch (err) {
            const errorMsg = err.response?.data?.message || 'An error occurred';
            console.error(errorMsg);
            setMsg(errorMsg);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
            <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
                <h3 className="text-2xl font-bold mb-6 text-center">
                    {isLogin ? 'Login' : 'Sign up'}
                </h3>
                <form onSubmit={adminSignup} className="space-y-4">
                    <div>
                        <label className="block text-gray-700 mb-1">Email</label>
                        <input
                            type="email"
                            value={email}
                            placeholder="Enter email"
                            required
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700 mb-1">Password</label>
                        <input
                            type="password"
                            placeholder="Enter password"
                            required
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition"
                    >
                        {isLogin ? 'Login' : 'Signup'}
                    </button>
                    {msg && <p className="text-center text-sm text-red-500">{msg}</p>}
                    <p className="text-center text-sm mt-4">
                        {isLogin ? "Don't have an account?" : 'Already registered?'}{' '}
                        <button
                            type="button"
                            onClick={() => setIsLogin(!isLogin)}
                            className="text-blue-600 hover:underline font-medium"
                        >
                            {isLogin ? 'Signup here' : 'Login here'}
                        </button>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default AdminLogin;
