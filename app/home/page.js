"use client";
import Navbar from "../components/Navbar";
import Post from "../components/Post";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";

export default function HomePage() {
    const { data: session } = useSession();
    const [posts, setPosts] = useState([]);
    const [content, setContent] = useState("");
    const [image, setImage] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    // Fetch posts from backend
    useEffect(() => {
        const fetchPosts = async () => {
            setLoading(true);
            const res = await fetch("/api/posts");
            const data = await res.json();
            setPosts(data);
            setLoading(false);
        };
        fetchPosts();
    }, []);

    // Handle image upload and convert to Base64
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (!file) return setImage(null);
        const reader = new FileReader();
        reader.onloadend = () => {
            setImage(reader.result);
        };
        reader.readAsDataURL(file);
    };

    // Create a new post
    const handlePost = async (e) => {
        e.preventDefault();
        if (!content.trim() && !image) return;
        setLoading(true);
        setError("");
        try {
            const res = await fetch("/api/posts", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ content, image }),
            });
            if (!res.ok) throw new Error("Failed to create post");
            const newPost = await res.json();
            setPosts([newPost, ...posts]);
            setContent("");
            setImage(null);
        } catch (err) {
            setError(err.message);
        }
        setLoading(false);
    };

    return (
        <div className="min-h-screen bg-[#18191a] flex flex-col">
            <Navbar />
            <main className="flex-1 flex justify-center py-8 px-2">
                <div className="w-full max-w-xl">
                    <form onSubmit={handlePost} className="mb-6 flex flex-col gap-2 bg-white dark:bg-[#242526] p-4 rounded-xl shadow border border-gray-200 dark:border-gray-800">
                        {error && <div className="text-red-500 text-sm">{error}</div>}
                        <textarea
                            className="w-full p-2 rounded border border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 resize-none"
                            rows={3}
                            placeholder="What's on your mind?"
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                        />
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="text-sm text-gray-500"
                        />
                        {image && (
                            <img src={image} alt="Preview" className="max-h-48 rounded-lg border mt-2" />
                        )}
                        <button
                            type="submit"
                            className="self-end px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition"
                            disabled={loading}
                        >
                            {loading ? "Posting..." : "Post"}
                        </button>
                    </form>
                    <div className="space-y-4">
                        {loading && posts.length === 0 && <div className="text-center text-gray-400">Loading...</div>}
                        {posts.map((post) => (
                            <Post key={post._id} post={post} refreshPosts={() => {
                                // Refetch posts after like/comment
                                fetch("/api/posts").then(res => res.json()).then(setPosts);
                            }} />
                        ))}
                    </div>
                </div>
            </main>
        </div>
    );
} 