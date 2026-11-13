import * as admin from "firebase-admin";
import { onCall, HttpsError } from "firebase-functions/v2/https";

/**
 * Assign or revoke admin role custom claim.
 * Only callable by existing super-admins.
 */
export const setAdminRole = onCall(async (request) => {
  if (!request.auth) {
    throw new HttpsError("unauthenticated", "User must be authenticated.");
  }

  // Ensure caller is already an admin
  if (request.auth.token.admin !== true) {
    throw new HttpsError("permission-denied", "Only administrators can assign admin roles.");
  }

  const { targetUid, isAdmin } = request.data;
  if (!targetUid || typeof targetUid !== "string") {
    throw new HttpsError("invalid-argument", "targetUid is required.");
  }

  await admin.auth().setCustomUserClaims(targetUid, {
    admin: Boolean(isAdmin),
  });

  await admin.firestore().collection("users").doc(targetUid).set(
    {
      role: isAdmin ? "admin" : "user",
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    },
    { merge: true }
  );

  return { success: true, targetUid, isAdmin: Boolean(isAdmin) };
});
