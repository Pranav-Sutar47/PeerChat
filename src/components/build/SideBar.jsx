import React, { useContext, useState } from "react";
import { Sidebar, SidebarBody } from "../ui/sidebar";
import { cn } from "@/lib/utils";
import AppContext from "@/context/AppContext";
import { LogOut, UserPlus, Users2, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import ChatBox from "./ChatBox";
import { signOut } from "firebase/auth";
import { auth, db } from "@/firebase-config";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  serverTimestamp,
  updateDoc,
  where,
  Timestamp,
} from "firebase/firestore";
import Dashboard from "./Dashboard";
import AddFriendModal from "./AddFriendModal";
import UserProfileModal from "./UserProfileModal";
import { toast } from "sonner";

export function SideBar() {
  const [open, setOpen] = useState(false);
  const { user, chatLists } = useContext(AppContext);
  const navigate = useNavigate();

  const [showModal, setShowModal] = useState(false);
  const [allUsers, setAllUsers] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [profileModalOpen, setProfileModalOpen] = useState(false);

  const handleFriendAdd = async (friendUid) => {
    try {
      const userChatsRef = doc(db, "userChats", user.uid);
      const userChatsSnap = await getDoc(userChatsRef);

      if (userChatsSnap.exists()) {
        const userChatsData = userChatsSnap.data();

        if (!userChatsData[friendUid]) {
          await updateDoc(userChatsRef, {
            [friendUid]: {
              lastMessage: "",
              timestamp: serverTimestamp(),
            },
          });
        }
      } else {
        await setDoc(userChatsRef, {
          [friendUid]: {
            lastMessage: "",
            timestamp: serverTimestamp(),
          },
        });
      }
    } catch (err) {
      console.error("Error adding friend:", err);
    }

    setShowModal(false);
  };

  const getAllUserExceptCurrent = async () => {
    try {
      const q = query(collection(db, "users"), where("uid", "!=", user.uid));
      const querySnapShot = await getDocs(q);

      const users = [];
      querySnapShot.forEach((doc) => {
        users.push({ id: doc.id, ...doc.data() });
      });

      return users;
    } catch (err) {
      console.error("Error fetching users:", err);
      return [];
    }
  };

  const handleAddFriend = async () => {
    try {
      setListLoad(true);
      const users = await getAllUserExceptCurrent();
      setAllUsers(users);
      setShowModal(true);
    } catch (error) {
      console.error("Error in handleAddFriend:", error);
    }finally{
      setListLoad(false);
    }
  };

  const [load, setLoad] = useState(false);
  const [listLoad,setListLoad] = useState(false);

  const handleUserClick = async () => {
    setLoad(true);
    const uid = auth.currentUser?.uid;

    if (uid) {
      await setDoc(doc(db, "usersStatus", uid), {
        state: "offline",
        lastSeen: serverTimestamp(),
      });
    }

    await signOut(auth);
    localStorage.clear();
    toast("Logout Successfully");
    setLoad(false);
    navigate("/");
  };

  return (
    <div className="relative h-screen w-full overflow-hidden">
      {/* Enhanced Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-blue-500/20 rounded-full blur-xl animate-pulse"></div>
          <div className="absolute bottom-1/3 right-1/4 w-40 h-40 bg-purple-500/20 rounded-full blur-xl animate-pulse animation-delay-2000"></div>
          <div className="absolute top-1/2 left-1/2 w-24 h-24 bg-pink-500/20 rounded-full blur-xl animate-pulse animation-delay-4000"></div>
        </div>

        {/* Floating Particles */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(15)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-white/20 rounded-full animate-float"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 10}s`,
                animationDuration: `${3 + Math.random() * 7}s`,
              }}
            />
          ))}
        </div>
      </div>

      <div
        className={cn(
          "relative z-10 flex w-full flex-1 flex-col overflow-hidden md:flex-row",
          "h-screen"
        )}
      >
        <Sidebar open={open} setOpen={setOpen} animate={false}>
          <SidebarBody className="justify-between gap-4 bg-black/20 backdrop-blur-xl border-r border-white/10">
            <div className="flex flex-1 flex-col overflow-hidden">
              <Logo />

              {/* Chat List Container with Enhanced Scrollbar */}
              <div className="flex-1 mt-6 overflow-hidden">
                <div className="h-full overflow-y-auto custom-scrollbar pr-2">
                  <div className="flex flex-col gap-2">
                    {chatLists.length === 0 ? (
                      <div className="flex flex-col items-center justify-center mt-10 text-white/70 px-4">
                        <div className="relative mb-6">
                          <div className="w-20 h-20 bg-gradient-to-br from-blue-500/30 to-purple-500/30 rounded-2xl flex items-center justify-center backdrop-blur-sm border border-white/20">
                            <Users2 className="w-10 h-10 text-white/60" />
                          </div>
                          <div className="absolute -inset-2 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-3xl blur-lg -z-10"></div>
                        </div>
                        <p className="text-lg font-semibold text-white mb-2">
                          No Chats Yet
                        </p>
                        <p className="text-sm text-white/60 text-center leading-relaxed">
                          Tap on{" "}
                          <span className="text-blue-300 font-medium">
                            Add Friend
                          </span>{" "}
                          to start a conversation
                        </p>
                      </div>
                    ) : (
                      chatLists.map((chat, idx) => (
                        <div
                          key={idx}
                          className="transform transition-all duration-200 hover:scale-[1.02] hover:bg-white/5 rounded-xl p-1"
                        >
                          <div
                            className={cn(
                              "relative p-3 rounded-xl border transition-all duration-200 cursor-pointer",
                              selectedChat?.uid === chat.uid
                                ? "bg-white/20 border-blue-400/50 shadow-lg"
                                : "bg-white/10 border-white/20 hover:bg-white/15 hover:border-white/30"
                            )}
                            onClick={() => setSelectedChat(chat)}
                          >
                            {/* Chat Item Content - Enhanced Visibility */}
                            <div className="flex items-center space-x-3">
                              <div className="relative flex-shrink-0">
                                <img
                                  src={chat.photoURL || "/default-avatar.png"}
                                  className="h-12 w-12 rounded-full border-2 border-white/30 shadow-md"
                                  alt={chat.name || "User"}
                                />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between mb-1">
                                  <h3 className="text-white font-semibold text-sm truncate">
                                    {chat.name || "Unknown User"}
                                  </h3>
                                  <span className="text-white/50 text-xs">
                                    {chat.timestamp instanceof Timestamp
                                      ? new Date(
                                          chat.timestamp.toDate()
                                        ).toLocaleTimeString([], {
                                          hour: "2-digit",
                                          minute: "2-digit",
                                        })
                                      : ""}
                                  </span>
                                </div>
                                <p className="text-white/70 text-xs truncate">
                                  {chat.lastMessage || "No messages yet"}
                                </p>
                              </div>
                            </div>

                            {/* Selection Indicator */}
                            {selectedChat?.uid === chat.uid && (
                              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-gradient-to-b from-blue-400 to-purple-400 rounded-r-full"></div>
                            )}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 p-2">
              {/* Add Friend Button */}
              <button
                onClick={handleAddFriend}
                disabled={listLoad}
                className="group relative p-3 rounded-2xl bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 transition-all duration-300 hover:scale-110 hover:shadow-lg"
                title="Add Friend"
              >
                {
                  listLoad ? (
                    <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin block mx-auto"></span>
                  ) : (
                    <UserPlus className="w-5 h-5 text-white group-hover:text-blue-200 transition-colors" />
                  )
                }
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity -z-10"></div>
              </button>

              {/* Logout Button */}
              <button
                onClick={handleUserClick}
                className="group relative p-3 rounded-2xl bg-white/10 hover:bg-red-500/20 backdrop-blur-sm border border-white/20 transition-all duration-300 hover:scale-110 hover:shadow-lg"
                title="Log Out"
              >
                {load ? (
                  <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin block mx-auto"></span>
                ) : (
                  <LogOut className="w-5 h-5 text-white group-hover:text-red-200 transition-colors" />
                )}

                <div className="absolute inset-0 bg-gradient-to-r from-red-500/20 to-pink-500/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity -z-10"></div>
              </button>
            </div>

            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/30 to-purple-500/30 rounded-2xl blur opacity-60"></div>
              <div className="relative bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-3">
                <div
                  className="flex items-center space-x-3"
                  onClick={() => setProfileModalOpen(true)}
                >
                  <div className="relative">
                    <img
                      src={user.photoURL}
                      className="h-10 w-10 shrink-0 rounded-full border-2 border-white/30 shadow-lg"
                      width={50}
                      height={50}
                      alt="Avatar"
                    />
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full opacity-50 blur-sm -z-10"></div>
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 rounded-full border-2 border-white/80 shadow-lg"></div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-semibold text-sm truncate">
                      {user.displayName || "Unknown"}
                    </p>
                    <p className="text-white/60 text-xs truncate">Online</p>
                  </div>
                </div>
              </div>
            </div>
            {/* <UserProfileCard user={user} onClick={()=>setProfileModalOpen(true)}/> */}
          </SidebarBody>
        </Sidebar>

        <div className="flex-1 relative overflow-hidden">
          {/* Main Content Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900"></div>
          <div className="relative z-10 h-full">
            {selectedChat != null ? (
              <ChatBox recipent={selectedChat} />
            ) : (
              <Dashboard />
            )}
          </div>
        </div>

        {/* Modal Portal */}
        {showModal && (
          <AddFriendModal
            users={allUsers}
            onClose={() => setShowModal(false)}
            onAddFriend={handleFriendAdd}
          />
        )}

        {profileModalOpen && (
          <UserProfileModal
            user={user}
            onClose={() => setProfileModalOpen(false)}
          />
        )}
      </div>

      <style jsx>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0px) rotate(0deg);
          }
          33% {
            transform: translateY(-15px) rotate(120deg);
          }
          66% {
            transform: translateY(8px) rotate(240deg);
          }
        }

        .animate-float {
          animation: float linear infinite;
        }

        .animation-delay-2000 {
          animation-delay: 2s;
        }

        .animation-delay-4000 {
          animation-delay: 4s;
        }

        /* Custom Scrollbar Styles */
        .custom-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: rgba(255, 255, 255, 0.3) transparent;
        }

        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }

        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
          border-radius: 3px;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.3);
          border-radius: 3px;
          transition: background 0.2s;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.5);
        }

        .custom-scrollbar::-webkit-scrollbar-thumb:active {
          background: rgba(255, 255, 255, 0.7);
        }

        /* Hide scrollbar when not hovered */
        .custom-scrollbar:not(:hover)::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.1);
        }
      `}</style>
    </div>
  );
}

export const Logo = () => {
  return (
    <div className="relative group">
      <div className="absolute -inset-2 bg-gradient-to-r from-blue-500/30 to-purple-500/30 rounded-2xl blur opacity-60 group-hover:opacity-100 transition-opacity"></div>
      <a
        href="#"
        className="relative z-20 flex items-center space-x-3 py-3 px-4 text-sm font-normal bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl hover:bg-white/20 transition-all duration-300"
      >
        <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl shadow-lg">
          <Users2 className="w-5 h-5 text-white" />
        </div>
        <span className="font-bold text-lg bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent whitespace-pre">
          PeerChat
        </span>
      </a>
    </div>
  );
};
