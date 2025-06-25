import uploadToCloudinary from "@/config/Upload";
import { getAuth, updateProfile } from "firebase/auth";
import { doc, getFirestore, updateDoc } from "firebase/firestore";
import React, { useState } from "react";

export default function UserProfileModal({ user, onClose }) {
  const [name, setName] = useState(user.name);
  const [photoURL, setPhotoURL] = useState(user.photoURL); // for preview
  const [photoFile, setPhotoFile] = useState(null); // actual file
  const [load, setLoad] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setPhotoFile(file);

    const reader = new FileReader();
    reader.onloadend = () => {
      setPhotoURL(reader.result); // base64 preview
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    setLoad(true);
    const auth = getAuth();
    const currentUser = auth.currentUser;

    let downloadURL = user.photoURL;

    try {
      if (photoFile) {
        downloadURL = await uploadToCloudinary(photoFile);
      }

      const shouldUpdateName = name !== user.name;
      const shouldUpdatePhoto = downloadURL !== user.photoURL;

      if (shouldUpdateName || shouldUpdatePhoto) {
        await updateProfile(currentUser, {
          displayName: shouldUpdateName ? name : currentUser.displayName,
          photoURL: shouldUpdatePhoto ? downloadURL : currentUser.photoURL,
        });
        const db = getFirestore();
        await updateDoc(doc(db, "users", currentUser.uid), {
          name,
          photoURL: downloadURL,
        });
      }
    } catch (error) {
      console.error("Error updating profile:", error);
    } finally {
      setLoad(false);
      onClose(); // close modal
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-900 rounded-xl p-6 w-96 max-w-full space-y-4 shadow-lg">
        <h2 className="text-lg font-bold text-gray-800 dark:text-white">
          Edit Profile
        </h2>

        <div className="flex flex-col items-center gap-2">
          <img
            src={photoURL}
            alt="Preview"
            className="w-20 h-20 rounded-full object-cover border border-gray-300 dark:border-gray-700"
          />
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="w-full text-sm text-gray-500 dark:text-white"
          />
        </div>

        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Display name"
          className="w-full px-3 py-2 border rounded-md text-sm dark:bg-gray-800 dark:text-white"
        />

        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm text-gray-700 dark:text-white bg-gray-200 dark:bg-gray-700 rounded-md"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={load}
            className={`flex items-center justify-center gap-2 px-4 py-2 text-sm text-white rounded-md ${
              load
                ? "bg-blue-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {load && (
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
            )}
            {load ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}
