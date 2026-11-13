import * as admin from "firebase-admin";
import { onDocumentUpdated } from "firebase-functions/v2/firestore";
import { onCall, HttpsError } from "firebase-functions/v2/https";

const db = admin.firestore();

/**
 * Triggered when an interest document is updated.
 * If status changes to 'accepted', automatically creates a match document in matches/{matchId}
 * and initializes a chat in chats/{matchId}.
 */
export const onInterestUpdated = onDocumentUpdated(
  "interests/{interestId}",
  async (event) => {
    const beforeData = event.data?.before.data();
    const afterData = event.data?.after.data();

    if (!beforeData || !afterData) return;

    // Only run if status transitioned to 'accepted'
    if (beforeData.status !== "accepted" && afterData.status === "accepted") {
      const { fromUid, toUid } = afterData;
      if (!fromUid || !toUid) return;

      const interestId = event.params.interestId;
      const matchId = `match_${fromUid}_${toUid}`;

      // Check if match already exists
      const matchRef = db.collection("matches").doc(matchId);
      const matchDoc = await matchRef.get();
      if (!matchDoc.exists) {
        await matchRef.set({
          id: matchId,
          users: [fromUid, toUid],
          interestId,
          createdAt: admin.firestore.FieldValue.serverTimestamp(),
        });

        // Initialize chat session for this match
        const chatRef = db.collection("chats").doc(matchId);
        await chatRef.set({
          id: matchId,
          participants: [fromUid, toUid],
          createdAt: admin.firestore.FieldValue.serverTimestamp(),
          updatedAt: admin.firestore.FieldValue.serverTimestamp(),
          lastMessage: null,
        });
      }
    }
  }
);

/**
 * Callable function for authenticated user to reveal contact info of a match.
 * Ensures the requester is one of the matched users before fetching private contact details.
 */
export const revealContactOnMatch = onCall(async (request) => {
  if (!request.auth) {
    throw new HttpsError(
      "unauthenticated",
      "Authentication is required to view contact info."
    );
  }

  const requesterUid = request.auth.uid;
  const targetUid = request.data?.targetUid;

  if (!targetUid || typeof targetUid !== "string") {
    throw new HttpsError("invalid-argument", "targetUid is required.");
  }

  // Check if mutual match exists between requesterUid and targetUid
  const matchesQuery = await db
    .collection("matches")
    .where("users", "array-contains", requesterUid)
    .get();

  const isMatched = matchesQuery.docs.some((doc) => {
    const data = doc.data();
    const users = data.users as string[];
    return users.includes(targetUid);
  });

  if (!isMatched) {
    throw new HttpsError(
      "permission-denied",
      "You can only reveal contact details for accepted matches."
    );
  }

  // Fetch private contact info for target profile
  const contactDoc = await db
    .collection("profiles")
    .doc(targetUid)
    .collection("private")
    .doc("contact")
    .get();

  if (!contactDoc.exists) {
    throw new HttpsError("not-found", "Contact details not found for this profile.");
  }

  return contactDoc.data();
});
