import { useCallback, useEffect, useState } from "react";
import type { Application } from "../models/application.ts";
import {
  getApplications,
  withdrawApplication,
} from "../services/applications.service.ts";
import { isUnauthorized } from "../utils/api.ts";

export const useApplications = (token: string, onUnauthorized: () => void) => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const reload = useCallback(async () => {
    setError(null);
    try {
      setApplications(await getApplications(token));
    } catch (reason: unknown) {
      if (isUnauthorized(reason)) {
        onUnauthorized();
      } else {
        setError(reason instanceof Error ? reason.message : "Erreur inconnue");
      }
    } finally {
      setIsLoading(false);
    }
  }, [onUnauthorized, token]);

  useEffect(() => {
    let active = true;
    getApplications(token)
      .then((data) => {
        if (active) setApplications(data);
      })
      .catch((reason: unknown) => {
        if (!active) return;
        if (isUnauthorized(reason)) {
          onUnauthorized();
        } else {
          setError(reason instanceof Error ? reason.message : "Erreur inconnue");
        }
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });

    return () => {
      active = false;
    };
  }, [onUnauthorized, token]);

  const withdraw = async (id: number) => {
    try {
      await withdrawApplication(token, id);
      await reload();
    } catch (reason: unknown) {
      if (isUnauthorized(reason)) onUnauthorized();
      else setError(reason instanceof Error ? reason.message : "Erreur inconnue");
    }
  };

  return { applications, isLoading, error, withdraw };
};
