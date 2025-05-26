export default function Comment({ comment }) {
    return (
        <div className="pl-4 border-l-2 border-gray-200 dark:border-gray-700 mb-2">
            <span className="font-semibold">{comment.user}:</span> {comment.content}
        </div>
    );
} 