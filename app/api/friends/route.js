import { connectToDatabase } from "@/lib/mongodb";
import User from "@/models/User";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";

//get friends
export async function GET(req) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return new Response(JSON.stringify({ message: "Unauthorized" }), { status: 401 });
        }
        await connectToDatabase();
        const user = await User.findOne({ email: session.user.email }).populate("friends", "name email profilePic");
        if (!user) {
            return new Response(JSON.stringify({ message: "User not found" }), { status: 404 });
        }
        return new Response(JSON.stringify(user.friends), { status: 200 });
    } catch (error) {
        return new Response(JSON.stringify({ message: "Error fetching friends", error: error.message }), { status: 500 });
    }
}
//add friend
export async function POST(req) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return new Response(JSON.stringify({ message: "Unauthorized" }), { status: 401 });
        }
        const { friendEmail } = await req.json();
        await connectToDatabase();
        const user = await User.findOne({ email: session.user.email });
        const friend = await User.findOne({ email: friendEmail });
        if (!user) {
            return new Response(JSON.stringify({ message: "Current user not found" }), { status: 404 });
        }
        if (!friend) {
            return new Response(JSON.stringify({ message: "Friend user not found" }), { status: 404 });
        }
        if (!user.friends.includes(friend._id)) {
            user.friends.push(friend._id);
            await user.save();
        }
        if (!friend.friends.includes(user._id)) {
            friend.friends.push(user._id);
            await friend.save();
        }
        return new Response(JSON.stringify({ message: "Friend added" }), { status: 201 });
    } catch (error) {
        return new Response(JSON.stringify({ message: "Error adding friend", error: error.message }), { status: 500 });
    }
} 