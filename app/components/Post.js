import { useState } from "react";
import { FaRegThumbsUp, FaRegCommentDots, FaRegShareSquare, FaUserCircle } from "react-icons/fa";
import { useSession } from "next-auth/react";

export default function Post({ post, refreshPosts }) {
    const { data: session } = useSession();
    const [likes, setLikes] = useState(post.likes?.length || 0);
    const [liked, setLiked] = useState(false);
    const [showComments, setShowComments] = useState(false);
    const [comments, setComments] = useState(post.comments || []);
    const [commentText, setCommentText] = useState("");
    const [commentLoading, setCommentLoading] = useState(false);
    const [likeLoading, setLikeLoading] = useState(false);

    // Like/unlike post
    const handleLike = async () => {
        if (!session) return;
        setLikeLoading(true);
        try {
            const res = await fetch(`/api/posts/${post._id}/like`, { method: "POST" });
            const data = await res.json();
            setLiked(data.liked);
            setLikes(data.likes);
            if (refreshPosts) refreshPosts();
        } catch { }
        setLikeLoading(false);
    };

    // Add comment
    const handleComment = async (e) => {
        e.preventDefault();
        if (!commentText.trim() || !session) return;
        setCommentLoading(true);
        try {
            await fetch(`/api/posts/${post._id}/comment`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ content: commentText }),
            });
            setCommentText("");
            if (refreshPosts) refreshPosts();
        } catch { }
        setCommentLoading(false);
    };

    return (
        <div className="bg-white dark:bg-[#242526] rounded-xl shadow p-4 flex flex-col gap-2 border border-gray-200 dark:border-gray-800">
            {/* Header */}
            <div className="flex items-center gap-3">
                {/* Avatar */}
                <div className="w-10 h-10 rounded-full bg-gray-300 dark:bg-gray-700 flex items-center justify-center text-2xl text-gray-500">
                    <FaUserCircle />
                </div>
                <div>
                    <div className="font-semibold text-gray-900 dark:text-gray-100">{post.user?.name || post.user || "User"}</div>
                    <div className="text-xs text-gray-500">{new Date(post.createdAt).toLocaleString()}</div>
                </div>
            </div>
            {/* Content */}
            <div className="text-gray-800 dark:text-gray-200 text-base mb-2 whitespace-pre-line">{post.content}</div>
            {/* Image */}
            {post.image && (
                <img src={post.image} alt="Post" className="max-h-96 rounded-lg border mb-2" />
            )}
            {/* Actions */}
            <div className="flex justify-between pt-2 border-t border-gray-100 dark:border-gray-700 mt-2">
                <button
                    className={`flex items-center gap-1 text-gray-500 hover:text-blue-600 dark:hover:text-blue-400 transition ${liked ? "text-blue-600 dark:text-blue-400" : ""}`}
                    onClick={handleLike}
                    disabled={likeLoading}
                >
                    <FaRegThumbsUp /> <span>Like</span> <span className="ml-1 text-xs">{likes}</span>
                </button>
                <button
                    className="flex items-center gap-1 text-gray-500 hover:text-blue-600 dark:hover:text-blue-400 transition"
                    onClick={() => setShowComments((v) => !v)}
                >
                    <FaRegCommentDots /> <span>Comment</span> <span className="ml-1 text-xs">{comments.length || post.comments?.length || 0}</span>
                </button>
                <button className="flex items-center gap-1 text-gray-500 hover:text-blue-600 dark:hover:text-blue-400 transition">
                    <FaRegShareSquare /> <span>Share</span>
                </button>
            </div>
            {/* Comments Section */}
            {showComments && (
                <div className="mt-3">
                    <form onSubmit={handleComment} className="flex gap-2 mb-2">
                        <input
                            className="flex-1 rounded border border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 px-2 py-1"
                            placeholder="Write a comment..."
                            value={commentText}
                            onChange={(e) => setCommentText(e.target.value)}
                            disabled={commentLoading}
                        />
                        <button type="submit" className="px-3 py-1 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition text-sm" disabled={commentLoading}>
                            {commentLoading ? "Posting..." : "Post"}
                        </button>
                    </form>
                    <div className="space-y-2">
                        {(post.comments || []).map((c, i) => (
                            <div key={i} className="flex items-center gap-2">
                                <div className="w-7 h-7 rounded-full bg-gray-300 dark:bg-gray-700 flex items-center justify-center text-lg text-gray-500">
                                    <FaUserCircle />
                                </div>
                                <div>
                                    <span className="font-semibold text-gray-800 dark:text-gray-200 mr-1">{c.user?.name || "User"}</span>
                                    <span className="text-gray-700 dark:text-gray-300">{c.content}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
} 