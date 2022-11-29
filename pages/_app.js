import { AuthProvider } from "../context/AuthContext";
import "../styles/globals.css";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../firebase";
import { useEffect } from "react";
import { serverTimestamp, doc, setDoc } from "firebase/firestore";
import Layout from "../Components/layouts";

function MyApp({ Component, pageProps }) {
  const [user, loading] = useAuthState(auth);

  return (
    <AuthProvider>
      {user ? (
        <Layout>
          <Component {...pageProps} />
        </Layout>
      ) : (
        <Component {...pageProps} />
      )}
    </AuthProvider>
  );
}

export default MyApp;
