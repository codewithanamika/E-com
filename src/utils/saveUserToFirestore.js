import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../firebase"; 

export const saveUserToFirestore = async (user) => {
  const userRef = doc(db, "users", user.uid);
  const docSnap = await getDoc(userRef);

  if (!docSnap.exists()) {
    await setDoc(userRef, {
      email: user.email,
      role: "user", 
    });
  }
};
