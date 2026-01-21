'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Tractor, ArrowRight, Loader2 } from 'lucide-react';
import React, { useState, useEffect } from 'react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { useAuth, useUser, initiateEmailSignIn } from '@/firebase';

export default function LoginPage() {
  const router = useRouter();
  const auth = useAuth();
  const { user, isUserLoading } = useUser();
  const loginImage = PlaceHolderImages.find((img) => img.id === 'login-background');
  
  const [email, setEmail] = useState('farmer@kisanmate.com');
  const [password, setPassword] = useState('password');
  const [role, setRole] = useState('farmer');

  useEffect(() => {
    if (!isUserLoading && user) {
      router.push('/dashboard');
    }
  }, [user, isUserLoading, router]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    initiateEmailSignIn(auth, email, password);
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
      <div className="flex items-center justify-center py-12">
        <div className="mx-auto grid w-[350px] gap-6">
          <div className="grid gap-2 text-center">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Tractor className="h-8 w-8 text-primary" />
              <h1 className="text-3xl font-headline font-bold text-primary">KisanMate Pro</h1>
            </div>
            <p className="text-balance text-muted-foreground">Enter your credentials to access your account</p>
          </div>
          <form onSubmit={handleLogin}>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="farmer@example.com" required value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                  <Link href="#" className="ml-auto inline-block text-sm underline">
                    Forgot your password?
                  </Link>
                </div>
                <Input id="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} />
              </div>
              <div className="grid gap-2">
                <Label>Role</Label>
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
              <Button type="submit" className="w-full font-bold" disabled={isUserLoading}>
                {isUserLoading ? <Loader2 className="animate-spin" /> : 'Login'} <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </form>
          <div className="mt-4 text-center text-sm">
            Don&apos;t have an account?{' '}
            <Link href="/signup" className="underline">
              Sign up
            </Link>
          </div>
        </div>
      </div>
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
    </div>
  );
}
