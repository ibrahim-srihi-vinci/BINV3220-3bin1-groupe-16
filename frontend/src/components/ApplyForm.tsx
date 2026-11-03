import { useState } from "react";
import { createApplication } from "../services/applications.service.ts";
import { isUnauthorized } from "../utils/api.ts";

interface ApplyFormProps {
  offerId: number;
  token: string;
  onUnauthorized: () => void;
}

const ApplyForm = ({ offerId, token, onUnauthorized }: ApplyFormProps) => {
  const [message, setMessage] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async () => {
    setError(null);
    try {
      await createApplication(token, offerId, message);
      setIsSent(true);
      setIsOpen(false);
    } catch (reason: unknown) {
      if (isUnauthorized(reason)) onUnauthorized();
      else setError(reason instanceof Error ? reason.message : "Erreur inconnue");
    }
  };

  if (isSent) return <span>Candidature envoyée</span>;
  if (!isOpen) {
    return (
      <button type="button" onClick={() => setIsOpen(true)}>
        Candidater
      </button>
    );
  }
  return (
    <div>
      <label htmlFor={`application-message-${offerId}`}>Message (facultatif)</label>
      <textarea
        id={`application-message-${offerId}`}
        value={message}
        maxLength={1000}
        onChange={(event) => setMessage(event.target.value)}
      />
      {error && <p role="alert">{error}</p>}
      <button type="button" onClick={() => void submit()}>
        Envoyer
      </button>
      <button type="button" onClick={() => setIsOpen(false)}>
        Annuler
      </button>
    </div>
  );
};

export default ApplyForm;
