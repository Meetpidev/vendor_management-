import React from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
import { LogIn, Building2 } from 'lucide-react';

export function GoogleAuth({ onLogin}) {
  const navigate = useNavigate();

  const onSuccess = (credentialResponse) => {
    try {
      const userObject = jwtDecode(credentialResponse.credential);
      localStorage.setItem('google_token', credentialResponse.credential);
      localStorage.setItem('google_user', JSON.stringify(userObject));
      onLogin(userObject);
      navigate('/'); 
    } catch (error) {
      alert('Failed to decode user info',error);
    }
  };

  const onError = () => {
    alert('Google Login Failed');
  };

  return (
    // <div style={{ margin: '40px auto', maxWidth: 320, textAlign: 'center' }}>
    //   <h2>Login with Google</h2>
    //   <GoogleLogin onSuccess={onSuccess} onError={onError} useOneTap />
    // </div>
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
              <Building2 className="w-8 h-8 text-blue-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Vendor Management</h1>
            <p className="text-gray-600">Streamline your vendor relationships</p>
          </div>

          <GoogleLogin
            onSuccess={onSuccess}
            onError={onError}
            useOneTap
            className="w-full bg-white border-2 border-gray-200 rounded-lg px-6 py-3 flex items-center justify-center gap-3 hover:border-gray-300 hover:shadow-md transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          />
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500">
              Secure authentication powered by Google
            </p>
          </div>
        </div>

        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500">
            Demo Mode: Click to simulate Google login
          </p>
        </div>
      </div>
    </div>
  );
}
