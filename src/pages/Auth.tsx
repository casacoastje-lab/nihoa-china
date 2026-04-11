import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/src/lib/supabase';
import { Button } from '@/src/components/ui/button';
import { Input } from '@/src/components/ui/input';
import { Label } from '@/src/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/src/components/ui/tabs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/src/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/src/components/ui/select';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'motion/react';
import { LogIn, UserPlus, ArrowRight, Sparkles } from 'lucide-react';

export default function Auth() {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [role, setRole] = useState('reader');
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      toast.error(error.message);
    } else {
      toast.success('Welcome back to the Verse!');
      navigate('/dashboard');
    }
    setLoading(false);
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    const { data, error } = await supabase.auth.signUp({ 
      email, 
      password,
      options: {
        data: {
          full_name: fullName,
          role: role,
        }
      }
    });

    if (error) {
      toast.error(error.message);
    } else if (data.user) {
      toast.success('Registration successful! Please check your email for verification.');
      navigate('/dashboard');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-24 bg-background relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="w-full max-w-2xl z-10"
      >
        <div className="text-center mb-16 space-y-4">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="inline-flex items-center space-x-3 text-primary mb-4"
          >
            <Sparkles className="h-6 w-6" />
            <span className="font-serif italic text-xl font-bold uppercase tracking-widest">The Gateway 门户</span>
          </motion.div>
          <h1 className="text-7xl font-serif font-bold tracking-tight leading-[0.85] mb-6">
            JOIN THE <br /> <span className="text-primary italic">COMMUNITY</span>
          </h1>
          <p className="text-xl font-serif text-muted-foreground italic max-w-md mx-auto">
            Enter the ChinaVerse and begin your journey through the Middle Kingdom's digital scrolls.
          </p>
        </div>

        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-12 bg-card/50 p-2 rounded-full border border-border h-16">
            <TabsTrigger value="login" className="rounded-full data-[state=active]:bg-primary data-[state=active]:text-white font-serif italic text-lg transition-all">
              Login 登录
            </TabsTrigger>
            <TabsTrigger value="register" className="rounded-full data-[state=active]:bg-primary data-[state=active]:text-white font-serif italic text-lg transition-all">
              Register 注册
            </TabsTrigger>
          </TabsList>

          <AnimatePresence mode="wait">
            <TabsContent value="login" className="mt-0">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.5 }}
              >
                <Card className="border-none shadow-2xl rounded-[3rem] bg-card overflow-hidden">
                  <form onSubmit={handleLogin}>
                    <CardHeader className="p-12 pb-6">
                      <CardTitle className="text-4xl font-serif font-bold">Welcome Back</CardTitle>
                      <CardDescription className="text-lg font-serif italic">Enter your credentials to access the archive.</CardDescription>
                    </CardHeader>
                    <CardContent className="p-12 pt-0 space-y-8">
                      <div className="space-y-3">
                        <Label htmlFor="email" className="font-serif italic text-lg ml-2">Email Address</Label>
                        <Input 
                          id="email" 
                          type="email" 
                          placeholder="name@example.com" 
                          className="h-16 rounded-2xl bg-muted/50 border-border font-serif text-lg px-6 focus:ring-primary"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required 
                        />
                      </div>
                      <div className="space-y-3">
                        <Label htmlFor="password" title="Password" className="font-serif italic text-lg ml-2">Password</Label>
                        <Input 
                          id="password" 
                          type="password" 
                          className="h-16 rounded-2xl bg-muted/50 border-border font-serif text-lg px-6 focus:ring-primary"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required 
                        />
                      </div>
                    </CardContent>
                    <CardFooter className="p-12 pt-0">
                      <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-white rounded-full h-16 text-xl font-serif italic shadow-xl shadow-primary/20 group" disabled={loading}>
                        {loading ? 'Opening Scroll...' : (
                          <>
                            Login to Verse <LogIn className="ml-3 h-5 w-5 group-hover:translate-x-2 transition-transform" />
                          </>
                        )}
                      </Button>
                    </CardFooter>
                  </form>
                </Card>
              </motion.div>
            </TabsContent>

            <TabsContent value="register" className="mt-0">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.5 }}
              >
                <Card className="border-none shadow-2xl rounded-[3rem] bg-card overflow-hidden">
                  <form onSubmit={handleRegister}>
                    <CardHeader className="p-12 pb-6">
                      <CardTitle className="text-4xl font-serif font-bold">Create Identity</CardTitle>
                      <CardDescription className="text-lg font-serif italic">Join the community and start your exploration.</CardDescription>
                    </CardHeader>
                    <CardContent className="p-12 pt-0 space-y-6">
                      <div className="space-y-3">
                        <Label htmlFor="name" className="font-serif italic text-lg ml-2">Full Name</Label>
                        <Input 
                          id="name" 
                          placeholder="John Doe" 
                          className="h-14 rounded-2xl bg-muted/50 border-border font-serif text-lg px-6 focus:ring-primary"
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          required 
                        />
                      </div>
                      <div className="space-y-3">
                        <Label htmlFor="reg-email" className="font-serif italic text-lg ml-2">Email Address</Label>
                        <Input 
                          id="reg-email" 
                          type="email" 
                          placeholder="name@example.com" 
                          className="h-14 rounded-2xl bg-muted/50 border-border font-serif text-lg px-6 focus:ring-primary"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required 
                        />
                      </div>
                      <div className="space-y-3">
                        <Label htmlFor="reg-password" title="Password" className="font-serif italic text-lg ml-2">Password</Label>
                        <Input 
                          id="reg-password" 
                          type="password" 
                          className="h-14 rounded-2xl bg-muted/50 border-border font-serif text-lg px-6 focus:ring-primary"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required 
                        />
                      </div>
                      <div className="space-y-3">
                        <Label htmlFor="role" className="font-serif italic text-lg ml-2">I want to join as a:</Label>
                        <Select value={role} onValueChange={setRole}>
                          <SelectTrigger className="h-14 rounded-2xl bg-muted/50 border-border font-serif text-lg px-6">
                            <SelectValue placeholder="Select a role" />
                          </SelectTrigger>
                          <SelectContent className="rounded-2xl border-border bg-popover shadow-xl">
                            <SelectItem value="reader" className="font-serif italic py-3">Reader (Explore & Comment)</SelectItem>
                            <SelectItem value="blogger" className="font-serif italic py-3">Blogger (Share your stories)</SelectItem>
                          </SelectContent>
                        </Select>
                        {role === 'blogger' && (
                          <motion.p 
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            className="text-sm font-serif italic text-primary mt-2 ml-2"
                          >
                            * Blogger accounts require admin approval before posting.
                          </motion.p>
                        )}
                      </div>
                    </CardContent>
                    <CardFooter className="p-12 pt-0">
                      <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-white rounded-full h-16 text-xl font-serif italic shadow-xl shadow-primary/20 group" disabled={loading}>
                        {loading ? 'Inscribing...' : (
                          <>
                            Begin Journey <UserPlus className="ml-3 h-5 w-5 group-hover:translate-x-2 transition-transform" />
                          </>
                        )}
                      </Button>
                    </CardFooter>
                  </form>
                </Card>
              </motion.div>
            </TabsContent>
          </AnimatePresence>
        </Tabs>
      </motion.div>
    </div>
  );
}
