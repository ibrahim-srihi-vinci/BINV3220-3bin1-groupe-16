import { useState } from "react";
import EmptyState from "../components/EmptyState.tsx";
import ErrorState from "../components/ErrorState.tsx";
import LoadingState from "../components/LoadingState.tsx";
import OfferTable from "../components/OfferTable.tsx";
import { useOffers } from "../hooks/useOffers.ts";
import type { PeriodCode } from "../models/offer.ts";
import type { User } from "../models/user.ts";

interface OffersPageProps {
  user: User;
  token: string;
  onUnauthorized: () => void;
}

const DESCRIPTIONS = {
  ADMIN: "Toutes les offres, tous statuts confondus.",
  STUDENT: "Les offres publiées.",
  CONTACT: "Les offres que vous avez déposées.",
} as const;

const OffersPage = ({ user, token, onUnauthorized }: OffersPageProps) => {
  const [period, setPeriod] = useState<PeriodCode | undefined>();
  const { offers, isLoading, error } = useOffers(token, period, onUnauthorized);

  const renderContent = () => {
    if (error) return <ErrorState message={error} />;
    if (isLoading) return <LoadingState />;
    if (offers.length === 0) return <EmptyState message="Aucune offre à afficher." />;
    return (
      <>
        <p className="result-count">
          {offers.length} offre{offers.length > 1 ? "s" : ""}
        </p>
        <OfferTable offers={offers} />
      </>
    );
  };

  return (
    <section className="offers-page">
      <div className="page-heading">
        <div>
          <p className="eyebrow">GESTA · OPPORTUNITÉS</p>
          <h1>Offres de stage</h1>
          <p className="page-description">{DESCRIPTIONS[user.kind]}</p>
        </div>
        <div className="offers-summary" aria-label="Nombre d'offres">
          <span className="offers-summary-value">{offers.length}</span>
          <span className="offers-summary-label">offre{offers.length > 1 ? "s" : ""}</span>
        </div>
      </div>
      <div className="offers-toolbar">
        <div>
          <p className="toolbar-title">Filtrer les offres</p>
          <p className="toolbar-description">Affichez uniquement les offres d'une période.</p>
        </div>
        <label className="period-filter" htmlFor="offer-period">
          <span>Période</span>
          <select
            id="offer-period"
            value={period ?? ""}
            onChange={(event) => {
              const value = event.target.value;
              setPeriod(value === "" ? undefined : (value as PeriodCode));
            }}
          >
            <option value="">Toutes les périodes</option>
            <option value="P1">P1</option>
            <option value="P2">P2</option>
            <option value="OTHER">Autre</option>
          </select>
        </label>
      </div>
      {renderContent()}
    </section>
  );
};

export default OffersPage;
