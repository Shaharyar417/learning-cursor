import { connectToDatabase } from "@/lib/mongodb";
import User from "@/models/User";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET(req) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return new Response(JSON.stringify({ message: "Unauthorized" }), { status: 401 });
        }

        const { searchParams } = new URL(req.url);
        const query = searchParams.get("q");

        if (!query) {
            return new Response(JSON.stringify([]), { status: 200 });
        }

        await connectToDatabase();

        // Find users whose name or email matches the query, excluding the current user
        const users = await User.find({
            $and: [
                { email: { $ne: session.user.email } }, // Exclude current user
                {
                    $or: [
                        { name: { $regex: query, $options: "i" } },
                        { email: { $regex: query, $options: "i" } }
                    ]
                }
            ]
        })
            .select("name email profilePic")
            .limit(10);

        return new Response(JSON.stringify(users), { status: 200 });
    } catch (error) {
        return new Response(JSON.stringify({ message: "Error searching users" }), { status: 500 });
    }
} 