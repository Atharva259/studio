'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Tractor, ArrowRight, Loader2 } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { updateProfile } from 'firebase/auth';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { useAuth, useUser, initiateEmailSignUp } from '@/firebase';
import { useToast } from '@/hooks/use-toast';
import { FirebaseError } from 'firebase/app';

export default function SignupPage() {
  const router = useRouter();
  const auth = useAuth();
  const { toast } = useToast();
  const { user, isUserLoading } = useUser();
  const loginImage = PlaceHolderImages.find((img) => img.id === 'login-background');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [role, setRole] = useState('farmer');
  const [isSigningUp, setIsSigningUp] = useState(false);

  useEffect(() => {
    if (!isUserLoading && user) {
      router.push('/dashboard');
    }
  }, [user, isUserLoading, router]);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName) {
      toast({
        variant: 'destructive',
        title: 'Sign-up Failed',
        description: 'Please enter your full name.',
      });
      return;
    }
    setIsSigningUp(true);
    try {
      const userCredential = await initiateEmailSignUp(auth, email, password);
      await updateProfile(userCredential.user, {
        displayName: fullName,
      });
      // On success, onAuthStateChanged listener in FirebaseProvider will set user,
      // and the useEffect above will redirect to the dashboard.
    } catch (error) {
      let description = 'An unexpected error occurred. Please try again.';
      if (error instanceof FirebaseError) {
        switch (error.code) {
          case 'auth/email-already-in-use':
            description = 'This email is already in use. Please try logging in.';
            break;
          case 'auth/weak-password':
            description = 'The password is too weak. It must be at least 6 characters long.';
            break;
          default:
            description = error.message;
        }
      }
      toast({
        variant: 'destructive',
        title: 'Sign-up Failed',
        description,
      });
    } finally {
      setIsSigningUp(false);
    }
  };

  if (isUserLoading || (!isUserLoading && user)) {
    return (
      <div className="flex min-h-screen w-full items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="w-full lg:grid lg:min-h-screen lg:grid-cols-2 xl:min-h-screen">
      <div className="hidden bg-muted lg:block">
        {loginImage && (
          <Image
            src={loginImage.imageUrl}
            alt="A beautiful farm landscape"
            width="1920"
            height="1080"
            className="h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
            data-ai-hint={loginImage.imageHint}
          />
        )}
      </div>
      <div className="flex items-center justify-center py-12">
        <div className="mx-auto grid w-[350px] gap-6">
          <div className="grid gap-2 text-center">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Tractor className="h-8 w-8 text-primary" />
              <h1 className="text-3xl font-headline font-bold text-primary">KisanMate Pro</h1>
            </div>
            <p className="text-balance text-muted-foreground">Create your account to get started</p>
          </div>
          <form onSubmit={handleSignup}>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="full-name">Full Name</Label>
                <Input
                  id="full-name"
                  placeholder="Ram Singh"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="farmer@example.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label>I am a...</Label>
                <RadioGroup value={role} onValueChange={setRole} className="flex gap-4">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="farmer" id="r1" />
                    <Label htmlFor="r1">Farmer</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="driver" id="r2" />
                    <Label htmlFor="r2">Driver</Label>
                  </div>
                </RadioGroup>
              </div>
              <Button type="submit" className="w-full font-bold" disabled={isUserLoading || isSigningUp}>
                {isUserLoading || isSigningUp ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  'Create Account'
                )}{' '}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </form>
          <div className="mt-4 text-center text-sm">
            Already have an account?{' '}
            <Link href="/" className="underline">
              Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
