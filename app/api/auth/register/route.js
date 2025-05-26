import { connectToDatabase } from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcryptjs";

export async function POST(req) {
    try {
        const { name, email, password } = await req.json();

        await connectToDatabase();

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return new Response(
                JSON.stringify({ message: "User already exists" }),
                { status: 400 }
            );
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 12);

        // Create new user
        const user = await User.create({
            name,
            email,
            password: hashedPassword,
        });

        // Remove password from response
        const { password: _, ...userWithoutPassword } = user.toObject();

        return new Response(JSON.stringify(userWithoutPassword), { status: 201 });
    } catch (error) {
        return new Response(
            JSON.stringify({ message: "Something went wrong" }),
            { status: 500 }
        );
    }
} 