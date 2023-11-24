import { signInWithEmailAndPassword, createUserWithEmailAndPassword, getAuth } from "@firebase/auth";
import { getApp } from "firebase/app";
import { UserCredential, } from "firebase/auth";
import { FormikValues } from "formik";
import { matchAuthErrorCode } from "../utils/ErrorHandler";
import axios from "axios";

axios.defaults.withCredentials = true

export async function signUpWithEmail(formik: FormikValues): Promise<UserCredential> {
  const { email, password } = formik;
  const auth = getAuth(getApp())

  if (!email || !password) {
    throw new Error("Email and password are required");
  }

  try {
    await createUserWithEmailAndPassword(auth, email, password);
    const user = await signInWithEmail(formik);
    return user;
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
  const { email, password} = formik;
  const auth = getAuth(getApp());

  if (!email || !password) {
    throw new Error("Email and password are required");
  }

  try {
    const userCredential: UserCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential;
  } catch (error: any) {
    console.error("Sign-in error:", matchAuthErrorCode(error));
    throw new Error(matchAuthErrorCode(error) as string);
  }
}