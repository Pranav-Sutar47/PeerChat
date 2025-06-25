// import React, { useContext } from "react";
// import { auth, googleProvider } from "../firebase-config";
// import { signInWithPopup } from "firebase/auth";
// import { toast } from "sonner";
// import AppContext from "@/context/AppContext";
// import { useNavigate } from "react-router-dom";
// import { doc, getDoc, setDoc } from "firebase/firestore";
// import { db } from "../firebase-config";

// export default function Login() {
//   const { setUser } = useContext(AppContext);
//   const navigate = useNavigate();

//   const handleGoogleLogin = async () => {
//     const result = await signInWithPopup(auth, googleProvider);
//     const user = result.user;

//     if (user) {
//       toast("Login Successful");

//       localStorage.setItem("token", user.accessToken);

//       const userDocRef = doc(db, "users", user.uid);

//       const userSnap = await getDoc(userDocRef);

//       try {
//         if (!userSnap.exists()) {
//           await setDoc(userDocRef, {
//             uid: user.uid,
//             name: user.displayName,
//             email: user.email,
//             photoURL: user.photoURL,
//           });

//           await setDoc(doc(db, "userChats", user.uid), {});

//         }
//       } catch (err) {
//         console.error("Error creating user/userChats doc:", err);
//       }

//       navigate("/home");
//     } else {
//       toast("Login Failure");
//       setUser({});
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
//       <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-xl">
//         <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
//           Sign Up / Login with Google
//         </h2>

//         <button
//           onClick={handleGoogleLogin}
//           className="w-full flex items-center justify-center gap-3 py-3 px-4 bg-green-500 text-white rounded-xl hover:bg-green-600 transition"
//         >
//           <svg
//             className="w-5 h-5"
//             viewBox="0 0 488 512"
//             fill="currentColor"
//             xmlns="http://www.w3.org/2000/svg"
//           >
//             <path d="M488 261.8C488 403.3 391.1 504 248 504C110.8 504 0 393.2 0 256C0 118.8 110.8 8 248 8C325.3 8 391.8 34.3 443.3 86L372.3 157.3C342.3 127.3 298.5 112 248 112C163.8 112 96 179.8 96 264C96 348.2 163.8 416 248 416C328.3 416 370.3 369 377.3 333.3H248V261.8H488Z" />
//           </svg>
//           <span>Continue with Google</span>
//         </button>

//         <p className="text-center text-sm text-gray-500 mt-6">
//           By continuing, you agree to our{" "}
//           <a href="#" className="text-blue-500 underline">
//             Terms of Service
//           </a>{" "}
//           and{" "}
//           <a href="#" className="text-blue-500 underline">
//             Privacy Policy
//           </a>
//           .
//         </p>
//       </div>
//     </div>
//   );
// }

import React, { useContext, useState } from "react";
import { auth, googleProvider } from "../firebase-config";
import { signInWithPopup } from "firebase/auth";
import { toast } from "sonner";
import AppContext from "@/context/AppContext";
import { useNavigate } from "react-router-dom";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../firebase-config";

export default function Login() {
  const { setUser } = useContext(AppContext);
  const navigate = useNavigate();
  const [load, setLoad] = useState(false);

  const handleGoogleLogin = async () => {
    setLoad(true);
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;

    if (user) {
      toast("Login Successful");

      localStorage.setItem("token", user.accessToken);

      const userDocRef = doc(db, "users", user.uid);

      const userSnap = await getDoc(userDocRef);

      try {
        if (!userSnap.exists()) {
          await setDoc(userDocRef, {
            uid: user.uid,
            name: user.displayName,
            email: user.email,
            photoURL: user.photoURL,
          });

          await setDoc(doc(db, "userChats", user.uid), {});
        }
      } catch (err) {
        console.error("Error creating user/userChats doc:", err);
      }

      navigate("/home");
    } else {
      toast("Login Failure");
      setUser({});
    }
    setLoad(false);
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute top-1/3 right-1/4 w-72 h-72 bg-purple-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-2000"></div>
        <div className="absolute bottom-1/4 left-1/3 w-72 h-72 bg-pink-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-4000"></div>
      </div>

      {/* Floating Particles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-white rounded-full opacity-10 animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 10}s`,
              animationDuration: `${5 + Math.random() * 10}s`,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4">
        {/* App Title */}
        <div className="text-center mb-12 animate-fade-in-down">
          <h1 className="text-6xl md:text-7xl font-bold bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent mb-4 tracking-tight">
            PeerChat
          </h1>
          <div className="flex items-center justify-center gap-2 text-white/80 text-lg">
            <div className="w-8 h-px bg-gradient-to-r from-transparent via-white/50 to-transparent"></div>
            <span className="text-sm font-light tracking-widest">
              CONNECT • CHAT • COLLABORATE
            </span>
            <div className="w-8 h-px bg-gradient-to-r from-transparent via-white/50 to-transparent"></div>
          </div>
        </div>

        {/* Login Card */}
        <div className="max-w-md w-full animate-fade-in-up">
          <div className="bg-white/10 backdrop-blur-xl p-8 rounded-3xl shadow-2xl border border-white/20 hover:bg-white/15 transition-all duration-300">
            <div className="text-center mb-8">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-blue-400 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                <svg
                  className="w-8 h-8 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">
                Welcome Back
              </h2>
              <p className="text-white/70 text-sm">
                Sign in to continue your conversations
              </p>
            </div>

            <button
              onClick={handleGoogleLogin}
              disabled={load}
              className="w-full group relative overflow-hidden bg-white hover:bg-gray-50 text-gray-800 font-semibold py-4 px-6 rounded-2xl transition-all duration-300 transform hover:scale-105 hover:shadow-xl shadow-lg disabled:opacity-60 disabled:cursor-not-allowed"
            >
              <div className="flex items-center justify-center gap-3 min-h-[24px]">
                <svg
                  className={`w-5 h-5 transition-transform ${
                    !load ? "group-hover:scale-110" : "opacity-50"
                  }`}
                  viewBox="0 0 488 512"
                  fill="currentColor"
                >
                  <path d="M488 261.8C488 403.3 391.1 504 248 504C110.8 504 0 393.2 0 256C0 118.8 110.8 8 248 8C325.3 8 391.8 34.3 443.3 86L372.3 157.3C342.3 127.3 298.5 112 248 112C163.8 112 96 179.8 96 264C96 348.2 163.8 416 248 416C328.3 416 370.3 369 377.3 333.3H248V261.8H488Z" />
                </svg>

                {load ? (
                  <span className="w-5 h-5 border-2 border-gray-600 border-t-transparent rounded-full animate-spin"></span>
                ) : (
                  <span>Continue with Google</span>
                )}
              </div>

              {/* Hover Effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 translate-x-full group-hover:translate-x-0 transition-transform duration-300 pointer-events-none"></div>
            </button>

            <div className="mt-8 text-center">
              <p className="text-white/60 text-xs leading-relaxed">
                By continuing, you agree to our{" "}
                <a
                  href="#"
                  className="text-blue-300 hover:text-blue-200 underline transition-colors"
                >
                  Terms of Service
                </a>{" "}
                and{" "}
                <a
                  href="#"
                  className="text-blue-300 hover:text-blue-200 underline transition-colors"
                >
                  Privacy Policy
                </a>
              </p>
            </div>
          </div>

          {/* Additional Features */}
          <div className="mt-8 grid grid-cols-3 gap-4 text-center">
            <div className="text-white/60">
              <div className="w-8 h-8 mx-auto mb-2 bg-white/10 rounded-lg flex items-center justify-center">
                <svg
                  className="w-4 h-4"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <p className="text-xs">Secure</p>
            </div>
            <div className="text-white/60">
              <div className="w-8 h-8 mx-auto mb-2 bg-white/10 rounded-lg flex items-center justify-center">
                <svg
                  className="w-4 h-4"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z" />
                </svg>
              </div>
              <p className="text-xs">Private</p>
            </div>
            <div className="text-white/60">
              <div className="w-8 h-8 mx-auto mb-2 bg-white/10 rounded-lg flex items-center justify-center">
                <svg
                  className="w-4 h-4"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <p className="text-xs">Fast</p>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0px) rotate(0deg);
          }
          33% {
            transform: translateY(-20px) rotate(120deg);
          }
          66% {
            transform: translateY(10px) rotate(240deg);
          }
        }

        @keyframes fade-in-down {
          0% {
            opacity: 0;
            transform: translateY(-30px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fade-in-up {
          0% {
            opacity: 0;
            transform: translateY(30px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-float {
          animation: float linear infinite;
        }

        .animate-fade-in-down {
          animation: fade-in-down 0.8s ease-out;
        }

        .animate-fade-in-up {
          animation: fade-in-up 0.8s ease-out 0.2s both;
        }

        .animation-delay-2000 {
          animation-delay: 2s;
        }

        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
}
