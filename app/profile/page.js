"use client";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Post from "../components/Post";
import { FaUserCircle } from "react-icons/fa";

export default function ProfilePage() {
    const { data: session } = useSession();
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (session?.user?.email) {
            fetchUserPosts();
        }
    }, [session]);

    const fetchUserPosts = async () => {
        try {
            const res = await fetch(`/api/posts/user/${session.user.email}`);
            const data = await res.json();
            setPosts(data);
        } catch (error) {
            console.error("Error fetching posts:", error);
        } finally {
            setLoading(false);
        }
    };

    if (!session) {
        return <div>Please sign in to view your profile.</div>;
    }

    return (
        <div className="min-h-screen bg-[#18191a]">
            <Navbar />
            <main className="container mx-auto px-4 py-8">
                {/* Profile Header */}
                <div className="bg-[#242526] rounded-xl p-6 mb-6 flex items-center gap-6">
                    <div className="w-24 h-24 rounded-full bg-gray-700 flex items-center justify-center text-5xl text-gray-500">
                        <FaUserCircle />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-white mb-2">{session.user.name}</h1>
                        <p className="text-gray-400">{session.user.email}</p>
                    </div>
                </div>

                {/* Posts Section */}
                <div className="space-y-4">
                    <h2 className="text-xl font-semibold text-white mb-4">Your Posts</h2>
                    {loading ? (
                        <div className="text-white">Loading posts...</div>
                    ) : posts.length > 0 ? (
                        posts.map((post) => (
                            <Post key={post._id} post={post} refreshPosts={fetchUserPosts} />
                        ))
                    ) : (
                        <div className="text-gray-400">No posts yet.</div>
                    )}
                </div>
            </main>
        </div>
    );
} 