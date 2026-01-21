'use client';
import {
  Auth, // Import Auth type for type hinting
  signInAnonymously,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from 'firebase/auth';

/** Initiates anonymous sign-in. */
export function initiateAnonymousSignIn(authInstance: Auth) {
  // Auth state change is handled by the onAuthStateChanged listener in the provider.
  return signInAnonymously(authInstance);
}

/** Initiates email/password sign-up. */
export function initiateEmailSignUp(authInstance: Auth, email: string, password: string) {
  // Auth state change is handled by the onAuthStateChanged listener in the provider.
  return createUserWithEmailAndPassword(authInstance, email, password);
}

/** Initiates email/password sign-in. */
export function initiateEmailSignIn(authInstance: Auth, email: string, password: string) {
  // Auth state change is handled by the onAuthStateChanged listener in the provider.
  return signInWithEmailAndPassword(authInstance, email, password);
}
