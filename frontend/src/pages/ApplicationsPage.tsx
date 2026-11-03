import ApplicationTable from "../components/ApplicationTable.tsx";
import EmptyState from "../components/EmptyState.tsx";
import ErrorState from "../components/ErrorState.tsx";
import LoadingState from "../components/LoadingState.tsx";
import { useApplications } from "../hooks/useApplications.ts";

interface ApplicationsPageProps {
  token: string;
  onUnauthorized: () => void;
}

const ApplicationsPage = ({ token, onUnauthorized }: ApplicationsPageProps) => {
  const { applications, isLoading, error, withdraw } = useApplications(token, onUnauthorized);

  return (
    <section>
      <div className="page-heading">
        <div>
          <p className="eyebrow">GESTA · SUIVI</p>
          <h1>Mes candidatures</h1>
          <p className="page-description">Consultez vos candidatures de l'année courante.</p>
        </div>
        <div className="offers-summary" aria-label="Nombre de candidatures">
          <span className="offers-summary-value">{applications.length}</span>
          <span className="offers-summary-label">candidature{applications.length > 1 ? "s" : ""}</span>
        </div>
      </div>
      {error && <ErrorState message={error} />}
      {isLoading && <LoadingState />}
      {!isLoading && !error && applications.length === 0 && (
        <EmptyState message="Aucune candidature pour l'année courante." />
      )}
      {!isLoading && !error && applications.length > 0 && (
        <ApplicationTable applications={applications} onWithdraw={withdraw} />
      )}
    </section>
  );
};

export default ApplicationsPage;
