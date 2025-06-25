import EmojiPicker from "emoji-picker-react";
import uploadToCloudinary from "@/config/Upload";
import AppContext from "@/context/AppContext";
import { db, storage } from "@/firebase-config";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  getFirestore,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { PhoneCall, ImageIcon, Send, MoreVertical, Smile } from "lucide-react";
import React, {
  useState,
  useRef,
  useEffect,
  useContext,
  useCallback,
  useMemo,
} from "react";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@radix-ui/react-dropdown-menu";
import { DropdownMenuShortcut } from "../ui/dropdown-menu";

const ChatBox = ({ recipent }) => {
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);

  const { user } = useContext(AppContext);
  const messagesEndRef = useRef(null);
  const chatContainerRef = useRef(null);

  const handleSend = useCallback(async () => {
    const chatId = [user.uid, recipent.uid].sort().join("_");

    try {
      if (message.trim()) {
        setIsTyping(true);
        await addDoc(collection(db, "chats", chatId, "messages"), {
          senderId: user.uid,
          type: "text",
          text: message,
          timestamp: serverTimestamp(),
        });

        await Promise.all([
          updateDoc(doc(db, "userChats", user.uid), {
            [recipent.uid + ".lastMessage"]: message,
            [recipent.uid + ".timestamp"]: serverTimestamp(),
          }),
          updateDoc(doc(db, "userChats", recipent.uid), {
            [user.uid + ".lastMessage"]: message,
            [user.uid + ".timestamp"]: serverTimestamp(),
          }),
        ]);

        setMessage("");
        setIsTyping(false);
      }
    } catch (err) {
      console.error("Error while sending messages", err);
      setIsTyping(false);
    }
  }, [message, user.uid, recipent.uid]);

  const handleImageUpload = useCallback(
    async (e) => {
      const file = e.target.files[0];
      if (!file) return;

      setImageUploading(true);
      const url = await uploadToCloudinary(file);

      if (url) {
        try {
          const chatId = [user.uid, recipent.uid].sort().join("_");
          await addDoc(collection(db, "chats", chatId, "messages"), {
            senderId: user.uid,
            type: "image",
            image: url,
            timestamp: serverTimestamp(),
          });

          await Promise.all([
            updateDoc(doc(db, "userChats", user.uid), {
              [recipent.uid + ".lastMessage"]: "📷 Image",
              [recipent.uid + ".timestamp"]: serverTimestamp(),
            }),
            updateDoc(doc(db, "userChats", recipent.uid), {
              [user.uid + ".lastMessage"]: "📷 Image",
              [user.uid + ".timestamp"]: serverTimestamp(),
            }),
          ]);
        } catch (err) {
          console.error("Error while uploading image", err);
        }
      }
      setImageUploading(false);
    },
    [user.uid, recipent.uid]
  );

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat]);

  useEffect(() => {
    const chatId = [user.uid, recipent.uid].sort().join("_");
    const q = query(
      collection(db, "chats", chatId, "messages"),
      orderBy("timestamp", "asc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs
        .map((doc) => doc.data())
        .map((doc) => ({
          sender: doc.senderId === user.uid ? "me" : "other",
          type: doc.type,
          text: doc.text,
          src: doc.image,
        }));

      setChat(msgs);
    });

    return () => unsubscribe();
  }, [user.uid, recipent.uid]);

  const [status, setStatus] = useState({ state: "offline" });

  useEffect(() => {
    if (!recipent?.uid) return;

    const statusRef = doc(db, "usersStatus", recipent.uid);

    const unsub = onSnapshot(statusRef, (snapshot) => {
      if (snapshot.exists()) {
        setStatus(snapshot.data());
      } else {
        setStatus({ state: "offline" }); // fallback if no doc found
      }
    });

    return () => unsub(); // cleanup
  }, [recipent?.uid]);

  const handleKeyPress = useCallback(
    (e) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleSend();
      }
    },
    [handleSend]
  );

  const memoizedMessages = useMemo(() => {
    return chat.map((msg, index) => (
      <div
        key={index}
        className={`flex items-end gap-3 mb-4 group ${
          msg.sender === "me" ? "justify-end" : "justify-start"
        }`}
      >
        {msg.sender === "other" && (
          <div className="flex-shrink-0">
            <img
              src={recipent.photoURL}
              alt="avatar"
              className="w-8 h-8 rounded-full ring-2 ring-white dark:ring-gray-700 shadow-sm"
            />
          </div>
        )}

        <div
          className={`flex flex-col ${
            msg.sender === "me" ? "items-end" : "items-start"
          }`}
        >
          {msg.type === "text" ? (
            <div
              className={`max-w-xs lg:max-w-md xl:max-w-lg px-4 py-3 rounded-2xl shadow-sm transition-all duration-200 ${
                msg.sender === "me"
                  ? "bg-gradient-to-br from-blue-500 to-blue-600 text-white"
                  : "bg-white text-gray-800 dark:bg-gray-700 dark:text-white border border-gray-200 dark:border-gray-600"
              }`}
            >
              <p className="text-sm leading-relaxed break-words">{msg.text}</p>
            </div>
          ) : (
            <div className="relative group">
              <img
                src={msg.src}
                alt="Sent"
                className="max-w-xs lg:max-w-sm rounded-2xl shadow-lg border border-gray-200 dark:border-gray-600 transition-transform duration-200 hover:scale-105"
              />
              <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-10 rounded-2xl transition-all duration-200"></div>
            </div>
          )}
          <span
            className={`text-xs text-gray-500 dark:text-gray-400 mt-1 px-2 ${
              msg.sender === "me" ? "text-right" : "text-left"
            }`}
          >
            {/* You can add timestamp here if needed */}
          </span>
        </div>

        {msg.sender === "me" && (
          <div className="flex-shrink-0">
            <img
              src={user.photoURL}
              alt="avatar"
              className="w-8 h-8 rounded-full ring-2 ring-blue-500 shadow-sm"
            />
          </div>
        )}
      </div>
    ));
  }, [chat, recipent.photoURL, user.photoURL]);

  function EmojiPickerButton({ onEmojiSelect }) {
    const [showPicker, setShowPicker] = useState(false);

    return (
      <div className="relative">
        <button
          onClick={() => setShowPicker(!showPicker)}
          className="p-2 lg:p-3 text-gray-600 hover:text-yellow-600 rounded-xl hover:bg-gray-200 transition-all duration-200"
        >
          😀
        </button>

        {showPicker && (
          <div className="absolute bottom-12 left-0 z-50 bg-white rounded shadow-md">
            <EmojiPicker
              onEmojiClick={(emojiData) => {
                onEmojiSelect(emojiData.emoji); // 👈 emoji character
                setShowPicker(false);
              }}
            />
          </div>
        )}
      </div>
    );
  }

  const clearChat = async () => {
    const chatId = [user.uid, recipent.uid].sort().join("_");
    try {
      const messagesRef = collection(db, "chats", chatId, "messages");
      const messagesSnapshot = await getDocs(messagesRef);

      const deletePromises = messagesSnapshot.docs.map((docSnap) =>
        deleteDoc(doc(db, "chats", chatId, "messages", docSnap.id))
      );
      await Promise.all(deletePromises);
      await Promise.all([
        updateDoc(doc(db, "userChats", user.uid), {
          [recipent.uid + ".lastMessage"]: "",
          [recipent.uid + ".timestamp"]: serverTimestamp(),
        }),
        updateDoc(doc(db, "userChats", recipent.uid), {
          [user.uid + ".lastMessage"]: "",
          [user.uid + ".timestamp"]: serverTimestamp(),
        }),
      ]);

    } catch (err) {
      console.error("Error clearing chat:", err);
    }
  };

  return (
    <div className="flex flex-col h-full max-h-screen w-full mx-auto bg-white dark:bg-gray-900 shadow-2xl rounded-3xl overflow-hidden border border-gray-200 dark:border-gray-700">
      {/* Chat Header */}
      <div className="flex items-center justify-between p-4 lg:p-6 bg-gradient-to-r from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 border-b border-gray-200 dark:border-gray-700 backdrop-blur-sm">
        <div className="flex items-center gap-4">
          <div className="relative">
            <img
              src={recipent.photoURL}
              alt="Avatar"
              className="w-12 h-12 lg:w-14 lg:h-14 rounded-full ring-4 ring-white dark:ring-gray-700 shadow-lg"
            />
            {status?.state === "online" && (
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full ring-2 ring-white dark:ring-gray-700"></div>
            )}
          </div>
          <div>
            <h3 className="text-lg lg:text-xl font-semibold text-gray-900 dark:text-white">
              {recipent.name}
            </h3>
            {status?.state === "online" ? (
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm text-green-600 dark:text-green-400 font-medium">
                  Online
                </span>
              </div>
            ) : (
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Last seen:{" "}
                {status?.lastSeen?.toDate
                  ? status.lastSeen.toDate().toLocaleString()
                  : "N/A"}
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            className="p-2 lg:p-3 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-xl transition-all duration-200"
            onClick={() => toast("Available Soon...")}
          >
            <PhoneCall className="w-5 h-5 lg:w-6 lg:h-6" />
          </button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="p-2 lg:p-3 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-all duration-200">
                <MoreVertical className="w-5 h-5 lg:w-6 lg:h-6" />
              </button>
            </DropdownMenuTrigger>

            <DropdownMenuContent
              className="w-48 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl shadow-xl p-1"
              align="start"
            >
              <DropdownMenuItem
                className="flex justify-between items-center px-3 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md cursor-pointer transition-colors"
                onClick={() => clearChat()}
              >
                <span>Clear Chat</span>
                <DropdownMenuShortcut className="text-xs text-gray-400">
                  ⇧⌘P
                </DropdownMenuShortcut>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Chat Messages */}
      <div
        ref={chatContainerRef}
        className="flex-1 overflow-y-auto p-4 lg:p-6 bg-gradient-to-b from-gray-50 to-white dark:from-gray-800 dark:to-gray-900 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent"
        style={{ scrollbarWidth: "thin" }}
      >
        <div className="space-y-1">{memoizedMessages}</div>
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 lg:p-6 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-end gap-3 bg-gray-50 dark:bg-gray-800 rounded-2xl p-2 border border-gray-200 dark:border-gray-600 focus-within:border-blue-500 dark:focus-within:border-blue-400 transition-all duration-200">
          <label
            htmlFor="imageUpload"
            className={`p-2 lg:p-3 text-gray-600 dark:text-gray-300 rounded-xl cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-200 ${
              imageUploading
                ? "opacity-50 cursor-not-allowed"
                : "hover:text-blue-600 dark:hover:text-blue-400"
            }`}
          >
            <ImageIcon className="w-5 h-5 lg:w-6 lg:h-6" />
          </label>
          <input
            id="imageUpload"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleImageUpload}
            disabled={imageUploading}
          />

          <EmojiPickerButton
            onEmojiSelect={(emoji) => setMessage((prev) => prev + emoji)}
          />

          <textarea
            className="flex-1 p-3 bg-transparent text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 border-none outline-none resize-none max-h-32 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600"
            placeholder="Type your message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyPress}
            rows={1}
            style={{
              minHeight: "24px",
              scrollbarWidth: "thin",
            }}
          />

          <button
            onClick={handleSend}
            disabled={!message.trim() || isTyping}
            className={`p-2 lg:p-3 rounded-xl transition-all duration-200 ${
              !message.trim() || isTyping
                ? "bg-gray-300 dark:bg-gray-700 text-gray-500 cursor-not-allowed"
                : "bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105"
            }`}
          >
            <Send className="w-5 h-5 lg:w-6 lg:h-6" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatBox;
