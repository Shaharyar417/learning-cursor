"use client";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Navbar from "../components/Navbar";
import { FaUserCircle, FaSearch } from "react-icons/fa";
import ChatModal from "../components/ChatModal";

export default function FriendsPage() {
    const { data: session } = useSession();
    const [friends, setFriends] = useState([]);
    const [users, setUsers] = useState([]);
    const [searchResults, setSearchResults] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [loading, setLoading] = useState(true);
    const [searching, setSearching] = useState(false);
    const [chatFriend, setChatFriend] = useState(null);

    useEffect(() => {
        if (session) {
            fetchFriends();
            fetchUsers();
        }
    }, [session]);

    const fetchFriends = async () => {
        try {
            const res = await fetch("/api/friends");
            const data = await res.json();
            if (Array.isArray(data)) {
                setFriends(data);
            } else {
                setFriends([]); // fallback to empty array if error or not array
            }
        } catch (error) {
            console.error("Error fetching friends:", error);
            setFriends([]); // fallback to empty array on error
        }
    };

    const fetchUsers = async () => {
        try {
            const res = await fetch("/api/users/all");
            const data = await res.json();
            setUsers(data);
        } catch (error) {
            console.error("Error fetching users:", error);
        } finally {
            setLoading(false);
        }
    };

    const searchUsers = async (query) => {
        if (!query.trim()) {
            setSearchResults([]);
            return;
        }
        setSearching(true);
        try {
            const res = await fetch(`/api/users/search?q=${encodeURIComponent(query)}`);
            const data = await res.json();
            setSearchResults(data);
        } catch (error) {
            console.error("Error searching users:", error);
        } finally {
            setSearching(false);
        }
    };

    const addFriend = async (friendEmail) => {
        try {
            const res = await fetch("/api/friends", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ friendEmail }),
            });
            if (res.ok) {
                fetchFriends();
                setSearchQuery("");
                setSearchResults([]);
            }
        } catch (error) {
            console.error("Error adding friend:", error);
        }
    };

    if (!session) {
        return <div>Please sign in to view your friends.</div>;
    }

    // Helper to check if user is already a friend
    const isFriend = (user) => friends.some(f => f.email === user.email);

    // List to show: search results if searching, otherwise all users
    const displayUsers = searchQuery ? searchResults : users;

    return (
        <div className="min-h-screen bg-[#18191a] flex flex-col">
            <Navbar />
            <main className="flex-1 flex flex-col items-center py-8 px-2">
                <div className="w-full max-w-xl">
                    <h1 className="text-2xl font-bold mb-6 text-white">Friends</h1>
                    {/* Search Section */}
                    <div className="mb-8">
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Search users..."
                                value={searchQuery}
                                onChange={(e) => {
                                    setSearchQuery(e.target.value);
                                    searchUsers(e.target.value);
                                }}
                                className="w-full p-3 pl-10 bg-[#242526] text-white rounded-lg border border-gray-700 focus:outline-none focus:border-blue-500"
                            />
                            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        </div>
                        {/* User List */}
                        <div className="mt-2 space-y-2">
                            {searching ? (
                                <div className="text-gray-400">Searching...</div>
                            ) : displayUsers.length > 0 ? (
                                displayUsers.map((user) => (
                                    <div key={user._id} className="flex items-center gap-4 bg-[#242526] p-4 rounded-xl">
                                        <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center text-2xl text-gray-500">
                                            <FaUserCircle />
                                        </div>
                                        <div className="flex-1">
                                            <div className="text-white">{user.name}</div>
                                            <div className="text-sm text-gray-400">{user.email}</div>
                                        </div>
                                        {isFriend(user) ? (
                                            <span className="px-4 py-1 bg-green-600 text-white rounded text-sm">Friend</span>
                                        ) : (
                                            <button
                                                onClick={() => addFriend(user.email)}
                                                className="px-4 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition text-sm"
                                            >
                                                Add Friend
                                            </button>
                                        )}
                                    </div>
                                ))
                            ) : (
                                <div className="text-gray-400">No users found</div>
                            )}
                        </div>
                    </div>
                    {/* Friends List */}
                    <div className="space-y-4">
                        <h2 className="text-xl font-semibold text-white mb-4">Your Friends</h2>
                        {loading ? (
                            <div className="text-gray-400">Loading friends...</div>
                        ) : friends.length > 0 ? (
                            friends.map((friend) => (
                                <div key={friend._id} className="flex items-center gap-4 bg-[#242526] p-4 rounded-xl border border-gray-800">
                                    <div className="w-12 h-12 rounded-full bg-gray-700 flex items-center justify-center text-3xl text-gray-500">
                                        <FaUserCircle />
                                    </div>
                                    <div className="flex-1">
                                        <div className="font-semibold text-white">{friend.name}</div>
                                        <div className="text-sm text-gray-400">{friend.email}</div>
                                    </div>
                                    <button className="px-4 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition text-sm" onClick={() => setChatFriend(friend)}>
                                        Message
                                    </button>
                                </div>
                            ))
                        ) : (
                            <div className="text-gray-400">No friends yet. Try searching for users above!</div>
                        )}
                    </div>
                </div>
                {/* Chat Modal */}
                {chatFriend && (
                    <ChatModal friend={chatFriend} onClose={() => setChatFriend(null)} session={session} />
                )}
            </main>
        </div>
    );
} 