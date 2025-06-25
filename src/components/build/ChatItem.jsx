const ChatItem = ({ chat, onSelect }) => {
  return (
    <div
    onClick={onSelect}
    className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-200 dark:hover:bg-neutral-700 cursor-pointer transition">
      <img
        src={chat.photoURL}
        alt="avatar"
        className="w-10 h-10 rounded-full object-cover"
      />
      <div className="flex-1 overflow-hidden">
        <div className="flex justify-between items-center">
          <h4 className="text-sm font-semibold text-gray-900 dark:text-white truncate">{chat.name}</h4>
          <span className="text-xs text-gray-500">{chat.timestamp?.toDate().toLocaleDateString()}</span>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400 truncate">{chat.lastMessage}</p>
      </div>
    </div>
  );
};

export default ChatItem;