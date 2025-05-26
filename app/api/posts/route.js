import { connectToDatabase } from "@/lib/mongodb";
import Post from "@/models/Post";
import User from "@/models/User";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";

export async function GET(req) {
    await connectToDatabase();
    // Fetch all posts, newest first, populate user info
    const posts = await Post.find({})
        .sort({ createdAt: -1 })
        .populate("user", "name profilePic");
    return new Response(JSON.stringify(posts), { status: 200 });
}

export async function POST(req) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return new Response(JSON.stringify({ message: "Unauthorized" }), { status: 401 });
        }
        const { content, image } = await req.json();
        await connectToDatabase();
        const user = await User.findOne({ email: session.user.email });
        if (!user) {
            return new Response(JSON.stringify({ message: "User not found" }), { status: 404 });
        }
        const post = await Post.create({
            user: user._id,
            content,
            image: image || null,
            likes: [],
            comments: [],
        });
        await post.populate("user", "name profilePic");
        return new Response(JSON.stringify(post), { status: 201 });
    } catch (error) {
        return new Response(JSON.stringify({ message: "Error creating post" }), { status: 500 });
    }
} 