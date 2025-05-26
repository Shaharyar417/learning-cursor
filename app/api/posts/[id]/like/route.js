import { connectToDatabase } from "@/lib/mongodb";
import Post from "@/models/Post";
import User from "@/models/User";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function POST(req, { params }) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return new Response(JSON.stringify({ message: "Unauthorized" }), { status: 401 });
        }
        const postId = params.id;
        await connectToDatabase();
        const user = await User.findOne({ email: session.user.email });
        if (!user) {
            return new Response(JSON.stringify({ message: "User not found" }), { status: 404 });
        }
        const post = await Post.findById(postId);
        if (!post) {
            return new Response(JSON.stringify({ message: "Post not found" }), { status: 404 });
        }
        const liked = post.likes.includes(user._id);
        if (liked) {
            post.likes.pull(user._id);
        } else {
            post.likes.push(user._id);
        }
        await post.save();
        return new Response(JSON.stringify({ liked: !liked, likes: post.likes.length }), { status: 200 });
    } catch (error) {
        return new Response(JSON.stringify({ message: "Error liking post" }), { status: 500 });
    }
} 