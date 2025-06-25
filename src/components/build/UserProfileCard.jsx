import React, { useState } from "react";
import UserProfileModal from './UserProfileModal';

export default function UserProfileCard({ user }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div onClick={() => setOpen(true)} className="relative cursor-pointer">
        <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/30 to-purple-500/30 rounded-2xl blur opacity-60"></div>
        <div className="relative bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-3">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <img
                src={user.photoURL}
                className="h-10 w-10 shrink-0 rounded-full border-2 border-white/30 shadow-lg"
                alt="Avatar"
              />
              <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full opacity-50 blur-sm -z-10"></div>
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 rounded-full border-2 border-white/80 shadow-lg"></div>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white font-semibold text-sm truncate">{user.name}</p>
              <p className="text-white/60 text-xs truncate">Online</p>
            </div>
          </div>
        </div>
      </div>

      {/* {open && <UserProfileModal user={user} onClose={() => setOpen(false)} />} */}
    </>
  );
}