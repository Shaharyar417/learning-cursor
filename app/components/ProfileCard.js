export default function ProfileCard({ user }) {
    return (
        <div className="flex flex-col items-center p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
            <div className="w-24 h-24 rounded-full bg-gray-300 dark:bg-gray-700 mb-4" />
            <div className="text-lg font-bold">{user.name}</div>
            <div className="text-gray-500">{user.bio}</div>
        </div>
    );
} 