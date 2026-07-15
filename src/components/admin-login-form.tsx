"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { ArrowRight, LoaderCircle } from "lucide-react";
import { loginAction, type LoginState } from "@/app/admin/actions";

const initialState: LoginState = { status: "idle", message: "" };

function LoginButton() {
  const { pending } = useFormStatus();
  return <button className="button button--primary" disabled={pending} type="submit">{pending ? <LoaderCircle className="spin" size={17} /> : <ArrowRight size={17} />} {pending ? "Signing in" : "Sign in"}</button>;
}

export function AdminLoginForm() {
  const [state, formAction] = useActionState(loginAction, initialState);
  return (
    <form action={formAction} className="admin-login-form">
      <div className="field"><label htmlFor="email">Email</label><input autoComplete="email" id="email" name="email" required type="email" /></div>
      <div className="field"><label htmlFor="password">Password</label><input autoComplete="current-password" id="password" name="password" required type="password" /></div>
      <LoginButton />
      {state.status === "error" && <p className="form-message form-message--error" aria-live="polite">{state.message}</p>}
    </form>
  );
}