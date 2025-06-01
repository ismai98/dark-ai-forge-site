
import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Navigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, LogIn, Shield } from 'lucide-react';

const Auth = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { user, signIn } = useAuth();

  if (user) {
    return <Navigate to="/admin-dashboard-secure" replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { error } = await signIn(email, password);
      if (error) {
        setError('Ungültige Anmeldedaten oder Sie haben keine Admin-Berechtigung');
      }
    } catch (err) {
      setError('Ein unerwarteter Fehler ist aufgetreten');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-gray-950 to-purple-900/20"></div>
      
      <Card className="w-full max-w-md bg-gray-900/95 border-gray-800 backdrop-blur-sm relative z-10">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <div>
            <CardTitle className="text-white text-2xl font-bold">
              Admin Dashboard
            </CardTitle>
            <p className="text-gray-400 text-sm mt-2">
              Melden Sie sich mit Ihren Admin-Zugangsdaten an
            </p>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="email" className="text-gray-300">E-Mail</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-gray-800 border-gray-700 text-white focus:border-blue-500 focus:ring-blue-500"
                placeholder="admin@beispiel.de"
              />
            </div>
            
            <div>
              <Label htmlFor="password" className="text-gray-300">Passwort</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="bg-gray-800 border-gray-700 text-white focus:border-blue-500 focus:ring-blue-500"
                placeholder="••••••••"
              />
            </div>

            {error && (
              <Alert className="bg-red-900/20 border-red-800">
                <AlertDescription className="text-red-400">
                  {error}
                </AlertDescription>
              </Alert>
            )}

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium"
            >
              {loading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <LogIn className="mr-2 h-4 w-4" />
              )}
              Anmelden
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-500 text-xs">
              Nur für autorisierte Administratoren
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Auth;
