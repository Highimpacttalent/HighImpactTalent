import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { apiRequest } from '../../utils';

export default function LinkedInCallback() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const code = searchParams.get('code');
    const error = searchParams.get('error');
    const state = searchParams.get('state');
    const storedState = localStorage.getItem('linkedin_oauth_state');
    
    if (error) {
      navigate('/u-login', { 
        state: { error: `LinkedIn login failed: ${error}` } 
      });
      return;
    }

    if (!code || !state) {
      navigate('/login', { 
        state: { error: 'Authorization failed: Missing code or state' } 
      });
      return;
    }

    if (!state || state !== storedState) {
      navigate('/u-login', { 
        state: { error: 'Security violation: Invalid state parameter' } 
      });
      return;
    }

    const authenticate = async () => {
      try {
        const response = await apiRequest({
          url: '/auth/linkedin',
          method: 'POST',
          data: { code, state,storedState }
        });

        if (response?.token) {
          localStorage.removeItem('linkedin_oauth_state');
          console.log(response)
          const userData = { token: response?.token, ...response?.user };
          dispatch(Login(userData));
          localStorage.setItem('userInfo', userData);
          navigate(response.isNewUser ? '/userinformation' : '/find-jobs');
        } else {
          navigate('/u-login', { 
            state: { error: response?.message || 'Authentication failed' } 
          });
        }
      } catch (err) {
        navigate('/u-login', { 
          state: { error: err.message || 'Server error during login' } 
        });
      }
    };

    authenticate();
  }, [navigate, searchParams]);

  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">Processing LinkedIn login...</h1>
        <p>Please wait while we authenticate your account.</p>
      </div>
    </div>
  );
}