// import { useEffect, useState } from 'react';
// import { signOut } from 'firebase/auth';
// import { getDoc, doc } from 'firebase/firestore';
// import { auth, db } from '../firebase'; // Passe den Pfad an

// export const useCheckUserCollection = (currentUser) => {
//     const [isLoading, setIsLoading] = useState(true); // Ladezustand
//     const [isVerified, setIsVerified] = useState(false); // Verifizierungszustand

//     useEffect(() => {
//         const checkCollection = async () => {
//             if (!currentUser || !currentUser.uid) {
//                 console.log("No current user found. Skipping Firestore check.");
//                 setIsLoading(false); // Beende das Laden, wenn kein Nutzer vorhanden ist
//                 return;
//             }

//             try {
//                 const userDoc = await getDoc(doc(db, "users", currentUser.uid));
//                 if (userDoc.exists()) {
//                     console.log("User Firestore collection exists.");
//                     setIsVerified(true);
//                 } else {
//                     console.warn("User has no Firestore collection. Logging out...");
//                     console.log("Triggering signOut due to missing Firestore collection.");
//                     await signOut(auth);
//                     console.log("signOut completed successfully.");
//                 }
//             } catch (error) {
//                 console.error("Error checking user Firestore collection:", error);
//             } finally {
//                 setIsLoading(false); // Ladezustand beenden
//             }
//         };

//         checkCollection();
//     }, [currentUser]);

//     return { isLoading, isVerified };
// };
