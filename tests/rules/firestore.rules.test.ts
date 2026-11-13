import { describe, it, beforeAll, afterAll, beforeEach } from "vitest";
import {
  initializeTestEnvironment,
  RulesTestEnvironment,
  assertFails,
  assertSucceeds,
} from "@firebase/rules-unit-testing";
import * as fs from "fs";
import * as path from "path";

let testEnv: RulesTestEnvironment;

beforeAll(async () => {
  const rulesPath = path.resolve(process.cwd(), "firestore.rules");
  const rules = fs.readFileSync(rulesPath, "utf8");

  testEnv = await initializeTestEnvironment({
    projectId: "shuvo-milon-test",
    firestore: {
      rules,
      host: "127.0.0.1",
      port: 8080,
    },
  });
});

afterAll(async () => {
  if (testEnv) {
    await testEnv.cleanup();
  }
});

beforeEach(async () => {
  if (testEnv) {
    await testEnv.clearFirestore();
  }
});

describe("Firestore Security Rules", () => {
  it("denies unauthenticated read of a private profile / draft profile", async () => {
    // Setup a draft profile using admin context
    await testEnv.withSecurityRulesDisabled(async (context) => {
      await context.firestore().collection("profiles").doc("user1").set({
        name: "Test User",
        status: "draft",
      });
    });

    const unauthDb = testEnv.unauthenticatedContext().firestore();
    const profileRef = unauthDb.collection("profiles").doc("user1");
    await assertFails(profileRef.get());
  });

  it("allows owner to read own private contact info", async () => {
    await testEnv.withSecurityRulesDisabled(async (context) => {
      await context
        .firestore()
        .collection("profiles")
        .doc("user1")
        .collection("private")
        .doc("contact")
        .set({
          guardianPhone: "+8801700000000",
        });
    });

    const ownerDb = testEnv.authenticatedContext("user1").firestore();
    const contactRef = ownerDb
      .collection("profiles")
      .doc("user1")
      .collection("private")
      .doc("contact");
    await assertSucceeds(contactRef.get());
  });

  it("denies non-owner from reading another user's private contact", async () => {
    await testEnv.withSecurityRulesDisabled(async (context) => {
      await context
        .firestore()
        .collection("profiles")
        .doc("user1")
        .collection("private")
        .doc("contact")
        .set({
          guardianPhone: "+8801700000000",
        });
    });

    const otherUserDb = testEnv.authenticatedContext("user2").firestore();
    const contactRef = otherUserDb
      .collection("profiles")
      .doc("user1")
      .collection("private")
      .doc("contact");
    await assertFails(contactRef.get());
  });

  it("denies interest accept by non-recipient", async () => {
    await testEnv.withSecurityRulesDisabled(async (context) => {
      await context.firestore().collection("interests").doc("int1").set({
        fromUid: "user1",
        toUid: "user2",
        status: "pending",
      });
    });

    // user3 (neither sender nor recipient) attempts to update/accept
    const thirdPartyDb = testEnv.authenticatedContext("user3").firestore();
    const interestRef = thirdPartyDb.collection("interests").doc("int1");
    await assertFails(interestRef.update({ status: "accepted" }));

    // sender (user1) also cannot accept their own sent proposal
    const senderDb = testEnv.authenticatedContext("user1").firestore();
    const senderInterestRef = senderDb.collection("interests").doc("int1");
    await assertFails(senderInterestRef.update({ status: "accepted" }));
  });
});
