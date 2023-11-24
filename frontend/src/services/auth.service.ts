import { User, signInWithEmailAndPassword, createUserWithEmailAndPassword, getAuth } from "@firebase/auth";
import { getApp } from "firebase/app";
import { FormikValues } from "formik";

export async function signUpWithEmail(formik: FormikValues): Promise<User> {
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

export async function signInWithEmail(formik: FormikValues): Promise<User> {
  const { email, password, rememberMe } = formik;
  const auth = getAuth(getApp())

  if (!email || !password) {
    throw new Error("Email and password are required");
  }

  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    if (rememberMe) {
      localStorage.setItem("user", JSON.stringify(userCredential.user));
    }
    return userCredential.user;
  } catch (error: any) {
    let errorMessage = "Sign-in failed";

    if (error.code === "auth/user-not-found" || error.code === "auth/wrong-password") {
      errorMessage = "Invalid email or password. Please check your credentials and try again.";
    } else if (error.code === "auth/invalid-email") {
      errorMessage = "The email address is not valid.";
    }

    console.error("Sign-in error:", errorMessage);
    throw new Error(errorMessage);
  }
}
