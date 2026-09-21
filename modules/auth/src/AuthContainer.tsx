import { useLocation } from 'react-router-dom';
import LoginPage from './LoginPage';
import SignupPage from './SignupPage';

/** Single federation entry — routes to login or signup based on URL path */
export default function AuthContainer() {
  const { pathname } = useLocation();
  if (pathname === '/signup') return <SignupPage />;
  return <LoginPage />;
}
