import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import ApplicationsPage from "../src/pages/ApplicationsPage.tsx";
import { stubFetch } from "./helpers/fetchMock.ts";

const applications = [
  {
    id: 1,
    offerId: 1,
    offerTitle: "Application React",
    companyShortName: "Lumen Digital",
    academicYear: "2026-2027",
    period: "P2",
    message: "Mon message",
    status: "IN_PROGRESS",
    appliedAt: "2026-10-02 18:10:00",
  },
  {
    id: 2,
    offerId: 2,
    offerTitle: "Migration cloud",
    companyShortName: "Datavia",
    academicYear: "2026-2027",
    period: "P2",
    message: null,
    status: "SELECTED",
    appliedAt: "2026-09-22 12:00:00",
  },
  {
    id: 3,
    offerId: 3,
    offerTitle: "API",
    companyShortName: "Orbis",
    academicYear: "2026-2027",
    period: "P1",
    message: null,
    status: "REJECTED",
    appliedAt: "2026-09-23 12:00:00",
  },
  {
    id: 4,
    offerId: 4,
    offerTitle: "Ancienne candidature",
    companyShortName: "Orbis",
    academicYear: "2026-2027",
    period: "P1",
    message: null,
    status: "WITHDRAWN",
    appliedAt: "2026-09-20 12:00:00",
  },
];

describe("ApplicationsPage", () => {
  it("affiche les quatre statuts et ne permet de retirer que la candidature en cours", async () => {
    const fetchMock = stubFetch({
      "/api/applications": () => Response.json(applications),
    });

    render(<ApplicationsPage token="jeton" onUnauthorized={vi.fn()} />);

    expect(await screen.findByText("Application React")).toBeInTheDocument();
    expect(screen.getByText("En cours")).toBeInTheDocument();
    expect(screen.getByText("Retenue")).toBeInTheDocument();
    expect(screen.getByText("Non retenue")).toBeInTheDocument();
    expect(screen.getByText("Retirée")).toBeInTheDocument();
    expect(screen.getAllByRole("button", { name: "Retirer" })).toHaveLength(1);

    fireEvent.click(screen.getByRole("button", { name: "Retirer" }));

    await waitFor(() =>
      expect(fetchMock).toHaveBeenCalledWith(
        "/api/applications/1",
        expect.objectContaining({ method: "DELETE", headers: { Authorization: "jeton" } }),
      ),
    );
  });
});
