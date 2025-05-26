import Link from "next/link";

export default function Navbar() {
    return (
        <nav className="flex gap-6 p-4 bg-gray-100 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
            <Link href="/home" className="font-semibold hover:underline">Home</Link>
            <Link href="/profile" className="font-semibold hover:underline">Profile</Link>
            <Link href="/friends" className="font-semibold hover:underline">Friends</Link>
        </nav>
    );
} 