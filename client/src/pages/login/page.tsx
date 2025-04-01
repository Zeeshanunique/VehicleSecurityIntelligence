import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { LayoutDashboard, Lock, UserCircle, BadgeAlert, KeyRound, Building } from 'lucide-react';

const loginSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters' }),
  role: z.string().optional()
});

const LoginForm = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
      role: 'police'
    }
  });

  const onSubmit = async (data: z.infer<typeof loginSchema>) => {
    setIsLoading(true);
    try {
      await login(data.email, data.password);
      navigate('/dashboard');
      toast({
        title: 'Login successful',
        description: 'Welcome to the Vehicle Security Intelligence System',
      });
    } catch (error) {
      console.error('Login error:', error);
      toast({
        title: 'Login failed',
        description: 'Invalid email or password',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="space-y-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="name@example.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="••••••••" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="role"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Access Level</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your role" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="police">
                      <div className="flex items-center">
                        <BadgeAlert className="mr-2 h-4 w-4" />
                        Police Officer
                      </div>
                    </SelectItem>
                    <SelectItem value="traffic">
                      <div className="flex items-center">
                        <Building className="mr-2 h-4 w-4" />
                        Traffic Control
                      </div>
                    </SelectItem>
                    <SelectItem value="admin">
                      <div className="flex items-center">
                        <KeyRound className="mr-2 h-4 w-4" />
                        System Administrator
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? 'Logging in...' : 'Sign In'}
          </Button>
        </div>
      </form>
    </Form>
  );
};

const LoginPage: React.FC = () => {
  const [selectedAuthMethod, setSelectedAuthMethod] = useState('credentials');

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/40 px-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold">Vehicle Security Intelligence System</h1>
          <p className="text-muted-foreground mt-2">Secure authentication required</p>
        </div>
        
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="text-2xl text-center">Login</CardTitle>
            <CardDescription className="text-center">
              Please sign in to access the system
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="credentials" className="w-full" onValueChange={setSelectedAuthMethod}>
              <TabsList className="grid w-full grid-cols-2 mb-4">
                <TabsTrigger value="credentials">
                  <Lock className="mr-2 h-4 w-4" />
                  Password
                </TabsTrigger>
                <TabsTrigger value="biometric">
                  <UserCircle className="mr-2 h-4 w-4" />
                  Biometric
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="credentials">
                <LoginForm />
              </TabsContent>
              
              <TabsContent value="biometric">
                <div className="space-y-4 py-4 text-center">
                  <div className="mx-auto bg-muted/30 rounded-full w-20 h-20 flex items-center justify-center">
                    <UserCircle className="h-10 w-10 text-muted-foreground" />
                  </div>
                  <h3 className="font-medium">Biometric Authentication</h3>
                  <p className="text-sm text-muted-foreground">
                    Use your fingerprint or face ID to securely login
                  </p>
                  <Button className="w-full mt-2" variant="outline" disabled>
                    Authenticate with Biometrics
                  </Button>
                  <p className="text-xs text-muted-foreground mt-2">
                    Biometric authentication coming soon
                  </p>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <div className="text-center text-sm">
              <span className="text-muted-foreground">Having trouble logging in? </span>
              <a href="#" className="text-primary hover:underline">Contact support</a>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default LoginPage; 