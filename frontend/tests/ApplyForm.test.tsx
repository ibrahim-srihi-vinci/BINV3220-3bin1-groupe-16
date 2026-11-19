import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import ApplyForm from "../src/components/ApplyForm.tsx";
import { stubFetch } from "./helpers/fetchMock.ts";

const createdApplication = {
  id: 8,
  offerId: 3,
  offerTitle: "API de facturation",
  companyShortName: "Orbis",
  academicYear: "2026-2027",
  period: "P2",
  message: "  Je souhaite rejoindre votre équipe.  ",
  status: "IN_PROGRESS",
  appliedAt: "2026-10-10 12:00:00",
};

describe("ApplyForm", () => {
  it("envoie le message facultatif et confirme la candidature", async () => {
    const fetchMock = stubFetch({
      "/api/applications": () => Response.json(createdApplication),
    });

    render(<ApplyForm offerId={3} token="jeton" onUnauthorized={vi.fn()} />);

    fireEvent.click(screen.getByRole("button", { name: "Candidater" }));
    const message = screen.getByLabelText("Message (facultatif)");
    fireEvent.change(message, { target: { value: "  Je souhaite rejoindre votre équipe.  " } });
    fireEvent.click(screen.getByRole("button", { name: "Envoyer" }));

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledWith(
        "/api/applications",
        expect.objectContaining({
          method: "POST",
          headers: { Authorization: "jeton", "Content-Type": "application/json" },
          body: JSON.stringify({
            offerId: 3,
            message: "  Je souhaite rejoindre votre équipe.  ",
          }),
        }),
      );
    });
    expect(await screen.findByText("Candidature envoyée")).toBeInTheDocument();
  });

  it("limite le message à 1000 caractères", () => {
    stubFetch({ "/api/applications": () => Response.json(createdApplication) });

    render(<ApplyForm offerId={3} token="jeton" onUnauthorized={vi.fn()} />);
    fireEvent.click(screen.getByRole("button", { name: "Candidater" }));

    expect(screen.getByLabelText("Message (facultatif)")).toHaveAttribute("maxlength", "1000");
  });

  it("affiche l'erreur de candidature renvoyée par l'API", async () => {
    stubFetch({
      "/api/applications": () => new Response(null, { status: 409 }),
    });

    render(<ApplyForm offerId={3} token="jeton" onUnauthorized={vi.fn()} />);
    fireEvent.click(screen.getByRole("button", { name: "Candidater" }));
    fireEvent.click(screen.getByRole("button", { name: "Envoyer" }));

    expect(await screen.findByRole("alert")).toHaveTextContent("statut 409");
    expect(screen.getByRole("button", { name: "Envoyer" })).toBeInTheDocument();
  });

  it("signale une session expirée", async () => {
    stubFetch({
      "/api/applications": () => new Response(null, { status: 401 }),
    });
    const onUnauthorized = vi.fn();

    render(<ApplyForm offerId={3} token="jeton" onUnauthorized={onUnauthorized} />);
    fireEvent.click(screen.getByRole("button", { name: "Candidater" }));
    fireEvent.click(screen.getByRole("button", { name: "Envoyer" }));

    await waitFor(() => expect(onUnauthorized).toHaveBeenCalled());
  });
});
