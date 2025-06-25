
// Enhanced AddFriendModal Component
import { X } from 'lucide-react';
const AddFriendModal = ({ users, onClose, onAddFriend }) => {
  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4">
        <div className="relative w-full max-w-md mx-2 sm:mx-0">
          {/* Glowing Background Effect - reduced on mobile */}
          <div className="absolute -inset-2 sm:-inset-4 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-2xl sm:rounded-3xl blur-lg sm:blur-xl" />
          
          {/* Modal Content */}
          <div className="relative bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl border border-white/20 dark:border-gray-700/50 rounded-xl sm:rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200/50 dark:border-gray-700/50 flex-shrink-0">
              <h2 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Add New Friend
              </h2>
              <button
                onClick={onClose}
                className="p-2 sm:p-2 rounded-xl bg-gray-100/50 dark:bg-gray-800/50 hover:bg-red-100 dark:hover:bg-red-900/30 text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-all duration-200 min-w-[44px] min-h-[44px] flex items-center justify-center"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Users List */}
            <div className="p-4 sm:p-6 flex-1 overflow-hidden">
              {users.length === 0 ? (
                <div className="text-center py-6 sm:py-8">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-xl sm:rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-4">
                    <Users2 className="w-6 h-6 sm:w-8 sm:h-8 text-gray-400" />
                  </div>
                  <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400">No users available to add</p>
                </div>
              ) : (
                <div className="space-y-2 sm:space-y-3 max-h-[60vh] sm:max-h-80 overflow-y-auto custom-scrollbar">
                  {users.map((user, index) => (
                    <div
                      key={user.uid || index}
                      className="group flex items-center justify-between p-3 sm:p-4 bg-gray-50/50 dark:bg-gray-800/50 rounded-lg sm:rounded-xl border border-gray-200/50 dark:border-gray-700/50 hover:bg-white dark:hover:bg-gray-700/70 hover:shadow-md transition-all duration-200"
                    >
                      <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
                        <div className="relative flex-shrink-0">
                          <img
                            src={user.photoURL}
                            alt="User"
                            className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 border-white dark:border-gray-600 shadow-sm"
                            onError={(e) => {
                              e.target.src = "/default-avatar.png";
                            }}
                          />
                          <div className="absolute -bottom-0.5 -right-0.5 sm:-bottom-1 sm:-right-1 w-3 h-3 sm:w-4 sm:h-4 bg-green-400 rounded-full border-2 border-white dark:border-gray-700" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <h3 className="font-medium text-sm sm:text-base text-gray-900 dark:text-white truncate">
                            {user.name || user.displayName || "Unknown User"}
                          </h3>
                          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 truncate">
                            {user.email || "No email"}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => onAddFriend(user.uid)}
                        className="px-3 py-2 sm:px-4 sm:py-2 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-lg sm:rounded-xl font-medium text-sm sm:text-base transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl min-w-[60px] sm:min-w-[auto] min-h-[44px] flex items-center justify-center flex-shrink-0 ml-2"
                      >
                        Add
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AddFriendModal;