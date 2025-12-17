import { useState } from "react";
import type { FC, FormEvent } from "react";
import { GraduationCap, X } from "lucide-react";
import {
  loginWithEmail,
  loginWithUni,
  signUpWithEmail,
  resetPassword,
} from "../lib/auth";

type LoginScreenProps = {
  onNavigate: (screen: string) => void;
};

type Mode = "welcome" | "signup" | "login";

const LoginScreen: FC<LoginScreenProps> = ({ onNavigate }) => {
  const [mode, setMode] = useState<Mode>("welcome");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleEmailLogin = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await loginWithEmail(email.trim(), password);
    } catch (err: any) {
      setError(err?.message ?? "Email login failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleEmailSignup = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await signUpWithEmail(email.trim(), password);
    } catch (err: any) {
      setError(err?.message ?? "Sign up failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleUniLogin = async () => {
    // Placeholder for UNI login - can be implemented later
    alert("UNI login coming soon!");
  };

  // Welcome Screen
  if (mode === "welcome") {
    return (
      <div className="h-full w-full flex flex-col items-center justify-center bg-white px-8">
        {/* Logo placeholder */}
        <div className="mb-8 flex h-32 w-32 items-center justify-center rounded-2xl bg-gray-200">
          <div className="h-20 w-20 rounded-xl bg-blue-600 flex items-center justify-center text-white">
            <GraduationCap className="w-12 h-12" />
          </div>
        </div>

        {/* Title */}
        <div className="text-center mb-12">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Sign U</h1>
          <p className="text-sm text-gray-600">
            Create an account and<br />join the LionLink community!
          </p>
        </div>

        {/* Buttons */}
        <div className="w-full max-w-xs space-y-4">
          <button
            type="button"
            onClick={handleUniLogin}
            className="w-full inline-flex items-center justify-center rounded-lg bg-blue-600 px-4 py-3 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
          >
            <GraduationCap className="w-4 h-4 mr-2" />
            <span>Continue with UNI</span>
          </button>

          <button
            type="button"
            onClick={() => setMode("signup")}
            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-900 hover:bg-gray-50 transition-colors"
          >
            Sign Up with Ema
          </button>
        </div>

        {/* Terms footer */}
        <p className="mt-8 text-xs text-gray-400 text-center max-w-xs">
          By signing up, you agree with the{" "}
          <button className="text-blue-600 hover:underline">Terms of Service</button>{" "}
          and{" "}
          <button className="text-blue-600 hover:underline">Privacy Policy</button>.
        </p>
      </div>
    );
  }

  // Create Account Screen
  if (mode === "signup") {
    return (
      <div className="h-full w-full bg-white">
        {/* Header */}
        <div className="px-4 pt-4">
          <button
            type="button"
            onClick={() => setMode("welcome")}
            className="h-8 w-8 flex items-center justify-center rounded-full hover:bg-gray-100"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Form */}
        <div className="px-8 pt-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Create An Accou</h2>

          <form onSubmit={handleEmailSignup} className="space-y-4">
            <input
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="First Name"
              className="w-full rounded-md border border-gray-300 px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
            />

            <input
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder="Last Name"
              className="w-full rounded-md border border-gray-300 px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
            />

            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              type="email"
              className="w-full rounded-md border border-gray-300 px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
            />

            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              type="password"
              className="w-full rounded-md border border-gray-300 px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-rose-400 px-4 py-3 text-sm font-medium text-white hover:bg-rose-500 disabled:opacity-60 transition-colors"
            >
              {loading ? "Creating account..." : "Sign Up"}
            </button>

            {error && <p className="text-xs text-red-600 text-center">{error}</p>}
          </form>

          <p className="mt-6 text-xs text-gray-400 text-center">
            By signing up, you agree with the{" "}
            <button className="text-blue-600 hover:underline">Terms of Service</button>{" "}
            and{" "}
            <button className="text-blue-600 hover:underline">Privacy Policy</button>.
          </p>

          <div className="mt-8 text-center">
            <button
              type="button"
              onClick={() => setMode("login")}
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-900 hover:bg-gray-50"
            >
              Already have an account?
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Sign In Screen
  return (
    <div className="h-full w-full bg-white">
      {/* Header */}
      <div className="px-4 pt-4">
        <button
          type="button"
          onClick={() => setMode("welcome")}
          className="h-8 w-8 flex items-center justify-center rounded-full hover:bg-gray-100"
        >
          <X className="w-5 h-5 text-gray-600" />
        </button>
      </div>

      {/* Form */}
      <div className="px-8 pt-8">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Sign In With Ema</h2>

        <form onSubmit={handleEmailLogin} className="space-y-4">
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            type="email"
            className="w-full rounded-md border border-gray-300 px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
          />

          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            type="password"
            className="w-full rounded-md border border-gray-300 px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-rose-400 px-4 py-3 text-sm font-medium text-white hover:bg-rose-500 disabled:opacity-60 transition-colors"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>

          {error && <p className="text-xs text-red-600 text-center">{error}</p>}
        </form>

        <div className="mt-6 text-center">
          <button
            type="button"
            onClick={() => setMode("signup")}
            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-900 hover:bg-gray-50"
          >
            Need an account?
          </button>
        </div>

        <div className="mt-8 text-center">
          <button
            type="button"
            onClick={handleUniLogin}
            className="w-full inline-flex items-center justify-center rounded-lg bg-blue-600 px-4 py-3 text-sm font-medium text-white hover:bg-blue-700"
          >
            <GraduationCap className="w-4 h-4 mr-2" />
            <span>Continue with UNI</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginScreen;