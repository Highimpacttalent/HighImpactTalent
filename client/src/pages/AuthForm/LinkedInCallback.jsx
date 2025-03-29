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
    const storedState = localStorage.getItem('linkedin_oauth_state'); // Retrieve stored state

    // Handle errors from LinkedIn
    if (error) {
      navigate('/login', { 
        state: { error: `LinkedIn login failed: ${error}` } 
      });
      return;
    }

    // Validate required parameters
    if (!code || !state) {
      navigate('/login', { 
        state: { error: 'Authorization failed: Missing code or state' } 
      });
      return;
    }

    // Verify state to prevent CSRF attacks
    if (!state || state !== storedState) {
      navigate('/login', { 
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
          // Clear the stored state after successful validation
          localStorage.removeItem('linkedin_oauth_state');

          // Store user data and redirect
          localStorage.setItem('userInfo', JSON.stringify(response));
          navigate(response.user?.isNewUser ? '/userinformation' : '/find-jobs');
        } else {
          navigate('/login', { 
            state: { error: response?.message || 'Authentication failed' } 
          });
        }
      } catch (err) {
        navigate('/login', { 
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