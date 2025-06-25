// import { useEffect, useState } from "react";
// import AppContext from "./AppContext";
// import { onAuthStateChanged } from "firebase/auth";
// import { auth, db } from "@/firebase-config";
// import { doc, getDoc, getFirestore, setDoc,serverTimestamp as fsTimestamp } from "firebase/firestore";
// import {getDatabase,onDisconnect,ref, set, serverTimestamp, onValue} from 'firebase/database';

// export default function AppState(props) {
//   const [user, setUser] = useState({});
//   const [chatLists, setChatList] = useState([]);

//   useEffect(() => {

//     const rtdb = getDatabase();
//     const firestore = getFirestore();

//     const unsub = onAuthStateChanged(auth, (user) => {
//       setUser(user);
//       const uid = user.uid;
//       const statusRef = ref(rtdb, `/onlineStatus/${uid}`);
      
//         const statusOnline = {
//         state: "online",
//         lastSeen: serverTimestamp(),
//       };

//       const statusOffline = {
//         state: "offline",
//         lastSeen: serverTimestamp(),
//       };

//       set(statusRef, statusOnline);
//       onDisconnect(statusRef).set(statusOffline);

//     setDoc(doc(firestore, "usersStatus", uid), {
//         state: "online",
//         lastSeen: fsTimestamp(),
//       });

//         onValue(statusRef, (snapshot) => {
//         const data = snapshot.val();
//         if (data) {
//           setDoc(doc(firestore, "usersStatus", uid), {
//             state: data.state,
//             lastSeen: new Date(data.lastSeen), // convert RTDB timestamp to JS Date
//           });
//         }
//       });
//         console.log('status changed');
//     });
//     return () => {
//       unsub();
//     };
//   }, []);

//   useEffect(() => {
//     const getUserChatList = async () => {
//       try {
//         console.log('hello');

//         const userChatsRef = doc(db, "userChats", user.uid);
//         const userChatsSnap = await getDoc(userChatsRef);

//         if (!userChatsSnap.exists()) {
//           setChatList([]);
//         }

//         const userChatsData = userChatsSnap.data();
//         const chatList = [];

//         const friendUids = Object.keys(userChatsData);

//         for (const friendUid of friendUids) {
//           const friendDoc = await getDoc(doc(db, "users", friendUid));
//           if (friendDoc.exists()) {
//             const friendData = friendDoc.data();
//             const chatMeta = userChatsData[friendUid];

//             chatList.push({
//               uid: friendUid,
//               name: friendData.name,
//               photoURL: friendData.photoURL,
//               lastMessage: chatMeta.lastMessage || "",
//               timestamp: chatMeta.timestamp || null,
//             });
//           }
//         }

//         setChatList(chatList);
//       } catch (error) {
//         console.error("Error fetching user chat list:", error);
//         setChatList([]);
//       }
//     };

//     getUserChatList();
//   }, [user?.uid]);

//   return (
//     <AppContext.Provider value={{ user, setUser, chatLists}}>
//       {props.children}
//     </AppContext.Provider>
//   );
// }


import { useEffect, useState } from "react";
import AppContext from "./AppContext";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "@/firebase-config";
import {
  doc,
  getDoc,
  getFirestore,
  setDoc,
  serverTimestamp as fsTimestamp,
  onSnapshot,
} from "firebase/firestore";
import {
  getDatabase,
  onDisconnect,
  ref,
  set,
  serverTimestamp,
  onValue,
} from "firebase/database";

export default function AppState(props) {
  const [user, setUser] = useState(null);
  const [chatLists, setChatList] = useState([]);

//   useEffect(() => {
//     const rtdb = getDatabase();
//     const firestore = getFirestore();
//     let statusListenerUnsub = null;

//     // const unsub = onAuthStateChanged(auth, (user) => {
//     //   setUser(user);

//     //   if (user) {
//     //     const uid = user.uid;
//     //     const statusRef = ref(rtdb, `/onlineStatus/${uid}`);
//     //     const userStatusRef = doc(firestore, "usersStatus", uid);

//     //     const statusOnline = {
//     //       state: "online",
//     //       lastSeen: serverTimestamp(),
//     //     };

//     //     const statusOffline = {
//     //       state: "offline",
//     //       lastSeen: serverTimestamp(),
//     //     };

//     //     // Listen to connection state
//     //     const connectedRef = ref(rtdb, ".info/connected");
//     //     onValue(connectedRef, (snap) => {
//     //       if (snap.val() === true) {
//     //         // Set onDisconnect first
//     //         onDisconnect(statusRef).set(statusOffline).then(() => {
//     //           // Then set online
//     //           set(statusRef, statusOnline);
//     //           setDoc(userStatusRef, {
//     //             state: "online",
//     //             lastSeen: fsTimestamp(),
//     //           });
//     //         });
//     //       }
//     //     });

//     //     // Sync from RTDB to Firestore
//     //     statusListenerUnsub = onValue(statusRef, (snapshot) => {
//     //       const data = snapshot.val();
//     //       if (data) {
//     //         setDoc(userStatusRef, {
//     //           state: data.state,
//     //           lastSeen: new Date(data.lastSeen),
//     //         });
//     //       }
//     //     });
//     //   } else {
//     //     // User logged out
//     //     setUser(null);
//     //     if (statusListenerUnsub) statusListenerUnsub();
//     //   }
//     // });

//     const unsub = onAuthStateChanged(auth, async (user) => {
//   if (user) {
//     setUser(user);
//     const uid = user.uid;
//     const rtdb = getDatabase();
//     const firestore = getFirestore();
//     const statusRef = ref(rtdb, `/onlineStatus/${uid}`);
//     const userStatusRef = doc(firestore, "usersStatus", uid);

//     const statusOnline = {
//       state: "online",
//       lastSeen: serverTimestamp(),
//     };

//     const statusOffline = {
//       state: "offline",
//       lastSeen: serverTimestamp(),
//     };

//     // Track connection
//     const connectedRef = ref(rtdb, ".info/connected");
//     onValue(connectedRef, (snap) => {
//       if (snap.val() === true) {
//         onDisconnect(statusRef).set(statusOffline).then(() => {
//           set(statusRef, statusOnline);
//           setDoc(userStatusRef, {
//             state: "online",
//             lastSeen: fsTimestamp(),
//           });
//         });
//       }
//     });

//     // Sync from RTDB to Firestore
//     statusListenerUnsub = onValue(statusRef, (snapshot) => {
//       const data = snapshot.val();
//       if (data) {
//         setDoc(userStatusRef, {
//           state: data.state,
//           lastSeen: new Date(data.lastSeen),
//         });
//       }
//     });
//   } else {
//     // ✅ LOGOUT: force offline status manually
//     setUser(null);
//     const rtdb = getDatabase();
//     const firestore = getFirestore();

//     const uid = auth?.currentUser?.uid;
//     if (uid) {
//       const statusRef = ref(rtdb, `/onlineStatus/${uid}`);
//       const userStatusRef = doc(firestore, "usersStatus", uid);

//       const statusOffline = {
//         state: "offline",
//         lastSeen: serverTimestamp(),
//       };

//       await set(statusRef, statusOffline);
//       await setDoc(userStatusRef, {
//         state: "offline",
//         lastSeen: fsTimestamp(),
//       });
//     }

//     if (statusListenerUnsub) statusListenerUnsub();
//   }
// });


//     return () => {
//       unsub();
//       if (statusListenerUnsub) statusListenerUnsub();
//     };
//   }, []);

useEffect(() => {
  const unsub = onAuthStateChanged(auth, async (user) => {
    if (user) {
      setUser(user);

      await setDoc(doc(db, "usersStatus", user.uid), {
        state: "online",
        lastSeen: serverTimestamp(),
      });

    } else {
      setUser(null);
    }
  });

  return () => unsub();
}, []);


useEffect(() => {
  if (!user?.uid) {
    setChatList([]);
    return;
  }

  const userChatsRef = doc(db, "userChats", user.uid);

  const unsubscribe = onSnapshot(userChatsRef, async (snapshot) => {
    if (!snapshot.exists()) {
      setChatList([]);
      return;
    }

    const userChatsData = snapshot.data();
    const chatList = [];

    const friendUids = Object.keys(userChatsData);

    for (const friendUid of friendUids) {
      try {
        const friendDoc = await getDoc(doc(db, "users", friendUid));
        if (friendDoc.exists()) {
          const friendData = friendDoc.data();
          const chatMeta = userChatsData[friendUid];

          chatList.push({
            uid: friendUid,
            name: friendData.name,
            photoURL: friendData.photoURL,
            lastMessage: chatMeta.lastMessage || "",
            timestamp: chatMeta.timestamp || null,
          });
        }
      } catch (error) {
        console.error("Error fetching friend data:", error);
      }
    }

    setChatList(chatList);
  });

  return () => unsubscribe();
}, [user?.uid]);

  return (
    <AppContext.Provider value={{ user, setUser, chatLists }}>
      {props.children}
    </AppContext.Provider>
  );
}
