"use client";
import { Github } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { signIn, signInWithProviders } from "../app/lib/actions/auth-actions";
import { toast } from "sonner";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });
  const [loading, setLoading] = useState(false);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const result = await signIn(formData.email, formData.password);
      if (result.user) {
        toast.success("Login successful");
        window.location.href = "/";
      }
    } catch (error) {
      toast.error(error?.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSignIn = async (provider: "github" | "google") => {
    await signInWithProviders(provider);
  }

  return (
    <section className="flex flex-1 items-center justify-center">
      <div className="max-w-md w-full space-y-8 bg-dark-100 border border-dark-200 rounded-[10px] card-shadow px-8 py-10">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-semibold text-gradient max-sm:text-2xl">
            Welcome back
          </h1>
          <p className="text-light-100 text-sm">
            Log in to EventHub and never miss another dev event.
          </p>
        </div>

        <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-2">
            <label htmlFor="email" className="text-sm text-light-100">
              Email
            </label>
            <input
              id="email"
              className="bg-dark-200 rounded-[6px] px-5 py-2.5 text-sm outline-none"
              placeholder="you@example.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="password" className="text-sm text-light-100">
              Password
            </label>
            <input
              id="password"
              type="password"
              
              className="bg-dark-200 rounded-[6px] px-5 py-2.5 text-sm outline-none"
              placeholder="••••••••"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            />
          </div>

          <button
            type="submit"
            className="bg-primary hover:bg-primary/90 w-full cursor-pointer flex items-center justify-center rounded-[6px] px-4 py-2.5 text-lg font-semibold text-black mt-2"
          >
            {loading ? "Loading..." : "Login"}
          </button>
        </form>

        <div className="flex items-center gap-3 text-light-200 text-xs">
          <span className="h-px flex-1 bg-dark-200" />
          <span>or continue with</span>
          <span className="h-px flex-1 bg-dark-200" />
        </div>

        <div className="flex flex-col gap-3">
          <button
            onClick={() => handleSignIn("google")}
            type="button"
            className="bg-dark-200 hover:bg-dark-200/80 w-full cursor-pointer flex items-center justify-center gap-2 rounded-[6px] px-4 py-2.5 text-sm font-medium text-light-100 border border-dark-200"
          >
            <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="18" height="18" viewBox="0 0 48 48">
<path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"></path><path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"></path><path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"></path><path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"></path>
</svg>
            <span>Continue with Google</span>
          </button>
          <button
            onClick={() => handleSignIn("github")}
            type="button"
            className="bg-dark-200 hover:bg-dark-200/80 w-full cursor-pointer flex items-center justify-center gap-2 rounded-[6px] px-4 py-2.5 text-sm font-medium text-light-100 border border-dark-200"
          >
            <Github size={18} />
            <span>Continue with GitHub</span>
          </button>
        </div>
        <p className="text-light-200 text-xs">
          Do not have an account?{" "}
          <Link href="/register" className="text-primary">
            Register
          </Link>
        </p>
      </div>
    </section>
  );
};

export default Login;
