import React, { useState } from 'react';
import './styles.css';

const LoginModal = ({ onClose, onLoginSuccess, onOpenRegister }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Erro ao fazer login');
      }

      sessionStorage.setItem('token', data.token);
      sessionStorage.setItem('user', JSON.stringify(data.user));

      if (onLoginSuccess) onLoginSuccess(data.user);
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='modal-backdrop' onClick={onClose}>
      <div className='login-modal-content' onClick={(e) => e.stopPropagation()}>
        <button className='modal-close' onClick={onClose}>
          ×
        </button>

        {error && <div className='modal-error'>{error}</div>}
        <form className='form' onSubmit={handleLogin}>
          <h2 style={{ marginBottom: '20px' }}>Login</h2>
          <div className='flex-column'>
            <label>Email</label>
          </div>
          <div className='inputForm'>
            <svg
              height='20'
              viewBox='0 0 32 32'
              width='20'
              fill='none'
              stroke='currentColor'
              strokeWidth='2'
              strokeLinecap='round'
              strokeLinejoin='round'
            >
              <path d='M4 8v16h24V8H4z'></path>
              <polyline points='4 8 16 18 28 8'></polyline>
            </svg>

            <input
              type='email'
              className='input'
              placeholder='Enter your Email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className='flex-column'>
            <label>Password</label>
          </div>
          <div className='inputForm'>
            <svg
              height='20'
              viewBox='0 0 24 24'
              width='20'
              fill='none'
              stroke='currentColor'
              strokeWidth='2'
              strokeLinecap='round'
              strokeLinejoin='round'
            >
              <rect x='3' y='11' width='18' height='11' rx='2' ry='2'></rect>
              <path d='M7 11V7a5 5 0 0 1 10 0v4'></path>
            </svg>

            <input
              type='password'
              className='input'
              placeholder='Enter your Password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <svg viewBox='0 0 576 512' height='1em'>
              <path d='...' />
            </svg>
          </div>

          <div className='flex-row'>
            <div className='checkbox-group'>
              <input type='checkbox' id='rememberMe' />
              <label htmlFor='rememberMe'>Remember me</label>
            </div>

            <span className='span'>Forgot password?</span>
          </div>

          <button className='button-submit' type='submit' disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>

          <p className='p'>
            Don't have an account?{' '}
            <span
              className='span'
              onClick={() => {
                if (onOpenRegister) onOpenRegister();
              }}
              style={{ cursor: 'pointer' }}
            >
              Sign Up
            </span>
          </p>
        </form>
      </div>
    </div>
  );
};

export default LoginModal;
