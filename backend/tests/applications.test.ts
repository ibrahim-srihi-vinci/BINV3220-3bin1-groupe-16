import request from "supertest";
import { beforeEach, describe, expect, it } from "vitest";
import { APPLICATION, ADMINISTRATOR, OFFER, STUDENT } from "../src/db/seed/seedIds.ts";
import { createTestApp, tokenFor } from "./helpers/testApp.ts";

let app: ReturnType<typeof createTestApp>;

beforeEach(() => {
  app = createTestApp();
});

describe("GET /applications", () => {
  it("retourne uniquement les candidatures de l'étudiant connecté", async () => {
    const response = await request(app)
      .get("/applications")
      .set("Authorization", tokenFor("STUDENT", STUDENT.LUCAS_DUPONT));

    expect(response.status).toBe(200);
    expect(response.body).toEqual([
      expect.objectContaining({
        id: APPLICATION.LUCAS_FLEET_APP,
        offerId: OFFER.FLEET_APP,
        status: "IN_PROGRESS",
      }),
    ]);
  });

  it("refuse l'accès à un administrateur", async () => {
    const response = await request(app)
      .get("/applications")
      .set("Authorization", tokenFor("ADMIN", ADMINISTRATOR.ANNE_LECLERCQ));

    expect(response.status).toBe(403);
  });
});

describe("POST /applications", () => {
  it("crée une candidature avec un message trimé", async () => {
    const response = await request(app)
      .post("/applications")
      .set("Authorization", tokenFor("STUDENT", STUDENT.LUCAS_DUPONT))
      .send({ offerId: OFFER.BILLING_API, message: "  Mon message  " });

    expect(response.status).toBe(201);
    expect(response.body).toEqual(
      expect.objectContaining({ offerId: OFFER.BILLING_API, message: "Mon message" }),
    );
  });

  it("refuse une offre non publiée et les doublons actifs", async () => {
    const token = tokenFor("STUDENT", STUDENT.LUCAS_DUPONT);
    const unpublished = await request(app)
      .post("/applications")
      .set("Authorization", token)
      .send({ offerId: OFFER.CLIENT_PORTAL });
    const duplicate = await request(app)
      .post("/applications")
      .set("Authorization", token)
      .send({ offerId: OFFER.FLEET_APP });

    expect(unpublished.status).toBe(409);
    expect(duplicate.status).toBe(409);
  });
});

describe("DELETE /applications/:id", () => {
  it("retire une candidature en cours puis autorise une nouvelle candidature", async () => {
    const token = tokenFor("STUDENT", STUDENT.LUCAS_DUPONT);
    const withdrawn = await request(app)
      .delete(`/applications/${APPLICATION.LUCAS_FLEET_APP}`)
      .set("Authorization", token);
    const reapplied = await request(app)
      .post("/applications")
      .set("Authorization", token)
      .send({ offerId: OFFER.FLEET_APP });

    expect(withdrawn.status).toBe(204);
    expect(reapplied.status).toBe(201);
  });

  it("refuse le retrait d'une candidature traitée", async () => {
    const response = await request(app)
      .delete(`/applications/${APPLICATION.MATEUSZ_CLOUD_MIGRATION}`)
      .set("Authorization", tokenFor("STUDENT", STUDENT.MATEUSZ_KOWALSKI));

    expect(response.status).toBe(409);
  });
});
