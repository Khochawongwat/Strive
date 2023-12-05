import { signInWithEmailAndPassword, createUserWithEmailAndPassword, getAuth } from "@firebase/auth";
import { UserCredential, } from "firebase/auth";
import { FormikValues } from "formik";
import { matchAuthErrorCode } from "../utils/ErrorHandler";
import axios from "axios";
import { firebaseApp } from "../apps/firebase.app";
import { AUTH_ENDPOINTS } from "../utils/endpoints";

axios.defaults.withCredentials = true

export async function signUpWithEmail(formik: FormikValues): Promise<UserCredential> {
  const { email, password } = formik;

  if (!email || !password) {
    throw new Error("Email and password are required");
  }

  try {
    const userCredential = await createUserWithEmailAndPassword(firebaseAuth, email, password);
    const user = userCredential.user
    await axios.post(AUTH_ENDPOINTS.users, {
      _id: user.uid,
      email: user.email,
      displayName: user.displayName,
      createdDate: Date.now()
    }).catch(async (error) => {
      await user.delete()
      throw new Error(error)
    })
    return userCredential;
  } catch (error: any) {
    let errorMessage = "Sign-up failed";
    if (error.code === "auth/email-already-in-use") {
      errorMessage = "The email address is already in use by another account.";
    } else if (error.code === "auth/invalid-email") {
      errorMessage = "The email address is not valid.";
    } else if (error.code === "auth/weak-password") {
      errorMessage = "The password is too weak. Please choose a stronger password.";
    }
    console.error("Sign-up error:", error.code);
    throw new Error(errorMessage);
  }
}

export async function signInWithEmail(formik: FormikValues): Promise<UserCredential> {
  const { email, password } = formik;

  if (!email || !password) {
    throw new Error("Email and password are required");
  }

  try {
    const userCredential: UserCredential = await signInWithEmailAndPassword(firebaseAuth, email, password);
    return userCredential;
  } catch (error: any) {
    console.error("Sign-in error:", matchAuthErrorCode(error));
    throw new Error(matchAuthErrorCode(error) as string);
  }
}

export async function signOut(): Promise<Boolean> {
  try {
    await firebaseAuth.signOut();
    return true;
  } catch (error) {
    console.error('Error during sign out:', error);
    throw new Error('Failed to sign out');
  }
}

export const firebaseAuth = getAuth(firebaseApp)