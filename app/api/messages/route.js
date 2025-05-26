import { connectToDatabase } from "@/lib/mongodb";
import Message from "@/models/Message";
import User from "@/models/User";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

// GET /api/messages?user1=...&user2=...
export async function GET(req) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return new Response(JSON.stringify({ message: "Unauthorized" }), { status: 401 });
        }
        const { searchParams } = new URL(req.url);
        const user1 = searchParams.get("user1");
        const user2 = searchParams.get("user2");
        if (!user1 || !user2) {
            return new Response(JSON.stringify({ message: "Missing user params" }), { status: 400 });
        }
        await connectToDatabase();
        const userA = await User.findOne({ email: user1 });
        const userB = await User.findOne({ email: user2 });
        if (!userA || !userB) {
            return new Response(JSON.stringify({ message: "User not found" }), { status: 404 });
        }
        const messages = await Message.find({
            $or: [
                { sender: userA._id, receiver: userB._id },
                { sender: userB._id, receiver: userA._id },
            ],
        })
            .sort({ createdAt: 1 })
            .populate("sender", "name email profilePic")
            .populate("receiver", "name email profilePic");
        return new Response(JSON.stringify(messages), { status: 200 });
    } catch (error) {
        return new Response(JSON.stringify({ message: "Error fetching messages" }), { status: 500 });
    }
}

// POST /api/messages
export async function POST(req) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return new Response(JSON.stringify({ message: "Unauthorized" }), { status: 401 });
        }
        const { receiverEmail, content } = await req.json();
        if (!receiverEmail || !content) {
            return new Response(JSON.stringify({ message: "Missing fields" }), { status: 400 });
        }
        await connectToDatabase();
        const sender = await User.findOne({ email: session.user.email });
        const receiver = await User.findOne({ email: receiverEmail });
        if (!sender || !receiver) {
            return new Response(JSON.stringify({ message: "User not found" }), { status: 404 });
        }
        const message = await Message.create({
            sender: sender._id,
            receiver: receiver._id,
            content,
        });
        await message.populate("sender", "name email profilePic");
        await message.populate("receiver", "name email profilePic");
        return new Response(JSON.stringify(message), { status: 201 });
    } catch (error) {
        return new Response(JSON.stringify({ message: "Error sending message" }), { status: 500 });
    }
} 