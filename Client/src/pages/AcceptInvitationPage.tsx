

import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { LoaderCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAppSelector } from '@/store/hooks';
import { toast } from 'sonner'; // Import toast for better error/success messages
import { axiosInstance } from '@/lib/axios';

function AcceptInvitationPage() {
  const { token } = useParams();
  const navigate = useNavigate();
  const user = useAppSelector((state) => state.auth.user); // assume this is where user is stored

  const [loading, setLoading] = useState(true);
  const [inviteInfo, setInviteInfo] = useState<null | {
    email: string;
    role: string;
    projectId: string;
    projectName: string;
    hasAccount: boolean; // This is the key property we'll use
  }>(null);
  const [error, setError] = useState<string | null>(null);
  const [accepting, setAccepting] = useState(false);

  useEffect(() => {
    const fetchInvite = async () => {
      try {
        if (!token) {
          setError('Invitation token is missing.');
          setLoading(false);
          return;
        }
        const res = await axios.get(`http://localhost:5003/api/invite/${token}`, { withCredentials: true });
        setInviteInfo(res.data);
      } catch (err: any) {
        console.error("Error fetching invite info:", err);
        setError(err?.response?.data?.message || 'Failed to load invitation details. The link might be invalid or expired.');
      } finally {
        setLoading(false);
      }
    };
    fetchInvite();
  }, [token]);

  // Handle automatic acceptance if the user is already logged in AND matches the invite email
  useEffect(() => {
    if (!loading && !error && inviteInfo && user) {
      if (user.email === inviteInfo.email) {
        // If the logged-in user's email matches the invite email,
        // and they are not already accepting, attempt to accept.
        if (!accepting) {
            handleAccept();
        }
      } else {
        // Logged-in user is different from the invited email
        toast.warning("Logged in user doesn't match invite", {
          description: `You are logged in as ${user.email}, but the invitation is for ${inviteInfo.email}. Please log out or use the correct account.`,
          duration: 7000
        });
      }
    }
  }, [loading, error, inviteInfo, user, accepting]); // Add accepting to dependencies to prevent re-triggering

  const handleAccept = async () => {
    if (!token || !user) {
      // This should ideally not be hit if the UI logic is correct,
      // but good for defensive programming.
      toast.error('Authentication required to accept invite.');
      return;
    }

    try {
      setAccepting(true);
      await axiosInstance.post(`/invite/accept/${token}`, {});
      toast.success('Invitation Accepted!', {
        description: `You have successfully joined ${inviteInfo?.projectName || 'the project'}!`,
      });
      navigate('/dashboard', { replace: true });
    } catch (err: any) {
      console.error("Error accepting invite:", err);
      toast.error('Error Accepting Invitation', {
        description: err?.response?.data?.message || 'Failed to accept invitation.',
      });
      // Optionally, if the invite failed, you might want to redirect them to dashboard anyway
      // if they are already logged in, or back to login if necessary, depending on your flow.
      // For now, staying on the page to show error.
    } finally {
      setAccepting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <LoaderCircle className="animate-spin w-10 h-10 text-blue-600" /> {/* Changed color for consistency */}
        <p className="mt-4 text-gray-600">Loading invitation...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-center p-4">
        <h2 className="text-2xl font-bold text-red-600 mb-4">Invitation Error</h2>
        <p className="text-red-500">{error}</p>
        <Link to="/" className="mt-6">
          <Button>Go to Home</Button>
        </Link>
      </div>
    );
  }

  if (!inviteInfo) {
      // This case should ideally be caught by `error` if token is invalid,
      // but as a fallback.
      return (
        <div className="flex flex-col items-center justify-center min-h-screen text-center p-4">
            <h2 className="text-2xl font-bold text-red-600 mb-4">Invitation Not Found</h2>
            <p className="text-gray-600">The invitation details could not be loaded.</p>
            <Link to="/" className="mt-6">
              <Button>Go to Home</Button>
            </Link>
        </div>
      );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4">
      <div className="max-w-xl w-full p-6 shadow-xl rounded-lg border border-gray-200 bg-white/80 backdrop-blur-sm text-center">
        <h1 className="text-3xl font-bold mb-4 text-gray-900">You've been invited!</h1>
        <p className="mb-2 text-gray-700">You've been invited to join the project:</p>
        <p className="text-xl font-semibold text-blue-700 mb-4">{inviteInfo.projectName || 'Unknown Project'}</p>

        <div className="mb-6 text-gray-600">
          <p><strong>Email:</strong> {inviteInfo.email}</p>
          <p><strong>Role:</strong> {inviteInfo.role}</p>
        </div>

        {user ? (
            user.email === inviteInfo.email ? (
                // User is logged in AND their email matches the invite email
                <div className="mt-6">
                    <p className="text-green-600 mb-4">You are currently logged in as {user.email}.</p>
                    <Button onClick={handleAccept} disabled={accepting} className="w-full sm:w-auto px-8 py-3 text-lg">
                        {accepting ? (
                          <>
                            <LoaderCircle className="animate-spin w-5 h-5 mr-2" /> Accepting...
                          </>
                        ) : (
                          'Accept Invite'
                        )}
                    </Button>
                </div>
            ) : (
                // User is logged in but their email does NOT match the invite email
                <div className="mt-6 bg-yellow-50 border border-yellow-200 text-yellow-800 p-4 rounded-md">
                    <p className="mb-2 font-medium">Logged in user mismatch!</p>
                    <p className="text-sm">You are logged in as <strong className="text-yellow-900">{user.email}</strong>, but this invitation is for <strong className="text-yellow-900">{inviteInfo.email}</strong>.</p>
                    <p className="text-sm mt-2">Please log out and log in with the correct account, or create a new account for this email address.</p>
                    <div className="flex justify-center gap-4 mt-4">
                        <Link to="/login" className="flex-1">
                            <Button variant="outline" className="w-full">Log Out & Log In</Button>
                        </Link>
                    </div>
                </div>
            )
        ) : (
          // User is NOT logged in
          <div className="mt-6 bg-blue-50 border border-blue-200 text-blue-800 p-4 rounded-md">
            <p className="mb-4 font-medium">To accept this invitation, please proceed:</p>
            {inviteInfo.hasAccount ? (
              // User has an account, show login link
              <div className="space-y-4">
                <p>It looks like you already have an account associated with <strong className="text-blue-900">{inviteInfo.email}</strong>.</p>
                <Link to={`/login?redirect=accept-invite&token=${token}`} className="w-full">
                  <Button className="w-full px-8 py-3 text-lg">
                    Log In to Accept
                  </Button>
                </Link>
              </div>
            ) : (
              // User does NOT have an account, show signup link
              <div className="space-y-4">
                <p>You don't seem to have an account yet with <strong className="text-blue-900">{inviteInfo.email}</strong>.</p>
                <Link to={`/signup?redirect=accept-invite&token=${token}`} className="w-full">
                  <Button className="w-full px-8 py-3 text-lg">
                    Sign Up to Accept
                  </Button>
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default AcceptInvitationPage;