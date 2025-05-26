import connectToDatabase from "../lib/mongodb.js";

import UserModule from "../models/User.js";
const User = UserModule.default || UserModule;

import PostModule from "../models/Post.js";
const Post = PostModule.default || PostModule;

import bcrypt from "bcryptjs";

const YOUR_EMAIL = process.env.SEED_PRESERVE_EMAIL || "your-email@example.com";

async function seed() {
    try {
        await connectToDatabase();
        console.log("Connected to database");

        // Get your user ID first
        const currentUser = await User.findOne({ email: YOUR_EMAIL });
        const currentUserId = currentUser?._id;

        // Clear existing data except your own
        await User.deleteMany({
            $and: [
                { email: { $ne: YOUR_EMAIL } },
                { email: { $ne: process.env.NEXTAUTH_ADMIN_EMAIL } }
            ]
        });
        if (currentUserId) {
            await Post.deleteMany({ user: { $ne: currentUserId } });
        }

        // Create mock users
        const mockUsers = [
            {
                name: "Alice Johnson",
                email: "alice@example.com",
                password: await bcrypt.hash("password123", 12),
            },
            {
                name: "Bob Smith",
                email: "bob@example.com",
                password: await bcrypt.hash("password123", 12),
            },
            {
                name: "Charlie Brown",
                email: "charlie@example.com",
                password: await bcrypt.hash("password123", 12),
            },
            {
                name: "Diana Prince",
                email: "diana@example.com",
                password: await bcrypt.hash("password123", 12),
            },
            {
                name: "Ethan Hunt",
                email: "ethan@example.com",
                password: await bcrypt.hash("password123", 12),
            }
        ];

        const createdUsers = await User.insertMany(mockUsers);
        console.log("Created mock users");

        // Create mock posts for each user
        const mockPosts = [];
        for (const user of createdUsers) {
            const userPosts = [
                {
                    user: user._id,
                    content: `Hello everyone! I'm ${user.name}. Excited to be here!`,
                    likes: [],
                    comments: [],
                    createdAt: new Date(),
                },
                {
                    user: user._id,
                    content: `Just posted my second update. What a great platform!`,
                    likes: [],
                    comments: [],
                    createdAt: new Date(Date.now() - 1000 * 60 * 60), // 1 hour ago
                },
                {
                    user: user._id,
                    content: `Sharing some thoughts about technology and social media...`,
                    likes: [],
                    comments: [],
                    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
                }
            ];
            mockPosts.push(...userPosts);
        }

        await Post.insertMany(mockPosts);
        console.log("Created mock posts");

        console.log("Seeding completed successfully!");
        process.exit(0);
    } catch (error) {
        console.error("Error seeding database:", error);
        process.exit(1);
    }
}

seed(); 