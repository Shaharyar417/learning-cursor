"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { FaEnvelope, FaLock } from "react-icons/fa";

export default function SignInForm() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        try {
            const result = await signIn("credentials", {
                email,
                password,
                redirect: false,
            });

            if (result.error) {
                setError(result.error);
            } else {
                router.push("/home");
                router.refresh();
            }
        } catch (error) {
            setError("An error occurred. Please try again.");
        }
        setLoading(false);
    };

    return (
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded text-center text-sm animate-pulse">
                    {error}
                </div>
            )}
            <div className="rounded-md shadow-sm -space-y-px flex flex-col gap-4">
                <div className="relative">
                    <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg" />
                    <input
                        id="email-address"
                        name="email"
                        type="email"
                        autoComplete="email"
                        required
                        className="appearance-none rounded-md pl-10 pr-3 py-3 border border-gray-300 placeholder-gray-500 text-white bg-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 w-full text-base transition"
                        placeholder="Email address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>
                <div className="relative">
                    <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg" />
                    <input
                        id="password"
                        name="password"
                        type="password"
                        autoComplete="current-password"
                        required
                        className="appearance-none rounded-md pl-10 pr-3 py-3 border border-gray-300 placeholder-gray-500 text-white bg-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 w-full text-base transition"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
            </div>

            <div className="flex items-center justify-between mt-2">
                <a href="/auth/register" className="text-indigo-500 hover:underline text-sm">Create an account</a>
                <a href="#" className="text-gray-400 hover:underline text-sm">Forgot password?</a>
            </div>

            <div>
                <button
                    type="submit"
                    className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-base font-semibold rounded-md text-white bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-600 hover:from-pink-600 hover:via-purple-600 hover:to-indigo-700 shadow-lg shadow-pink-500/30 hover:shadow-pink-500/60 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-400 transition duration-200"
                    disabled={loading}
                >
                    {loading ? (
                        <span className="animate-pulse">Signing in...</span>
                    ) : (
                        <>
                            Sign in
                        </>
                    )}
                </button>
            </div>
        </form>
    );
} 