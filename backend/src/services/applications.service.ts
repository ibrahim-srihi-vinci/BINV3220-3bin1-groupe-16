import { toApplication } from "../mappers/application.mapper.ts";
import type { Application } from "../models/application.ts";
import type { User } from "../models/user.ts";
import type { ApplicationsRepository } from "../repositories/applications.repository.ts";
import { HttpError } from "../utils/httpError.ts";
import { isStudent } from "./permissions.ts";

const requireStudent = (user: User): void => {
  if (!isStudent(user)) {
    throw new HttpError(403, "FORBIDDEN", "Seul un étudiant peut gérer ses candidatures");
  }
};

const normalizeMessage = (message: unknown): string | null => {
  if (message === undefined || message === null || message === "") return null;
  if (typeof message !== "string") {
    throw new HttpError(400, "INVALID_BODY", "Le message doit être une chaîne de caractères");
  }
  const normalized = message.trim();
  if (normalized.length > 1000) {
    throw new HttpError(400, "INVALID_BODY", "Le message ne peut pas dépasser 1000 caractères");
  }
  return normalized === "" ? null : normalized;
};

export const createApplicationsService = (repository: ApplicationsRepository) => ({
  listMine: (viewer: User): Application[] => {
    requireStudent(viewer);
    return repository.findByStudent(viewer.id).map(toApplication);
  },
  apply: (viewer: User, offerId: number, message: unknown): Application => {
    requireStudent(viewer);
    if (!Number.isInteger(offerId) || offerId <= 0) {
      throw new HttpError(400, "INVALID_BODY", "offerId doit être un entier positif");
    }
    if (!repository.canApply(offerId, viewer.id)) {
      throw new HttpError(
        409,
        "APPLICATION_NOT_ALLOWED",
        "Cette offre n'est pas disponible ou vous avez déjà une candidature active",
      );
    }
    const id = repository.create({
      offerId,
      studentId: viewer.id,
      message: normalizeMessage(message),
    });
    const application = repository.findByIdForStudent(id, viewer.id);
    if (application === undefined) {
      throw new HttpError(500, "INTERNAL_ERROR", "La candidature créée est introuvable");
    }
    return toApplication(application);
  },
  withdraw: (viewer: User, id: number): void => {
    requireStudent(viewer);
    if (!Number.isInteger(id) || id <= 0) {
      throw new HttpError(400, "INVALID_QUERY", "L'identifiant de candidature est invalide");
    }
    const application = repository.findByIdForStudent(id, viewer.id);
    if (application === undefined) {
      throw new HttpError(404, "NOT_FOUND", "Candidature introuvable");
    }
    if (application.status !== "IN_PROGRESS") {
      throw new HttpError(409, "APPLICATION_NOT_WITHDRAWABLE", "Cette candidature est déjà traitée");
    }
    if (!repository.withdraw(id, viewer.id)) {
      throw new HttpError(409, "APPLICATION_NOT_WITHDRAWABLE", "Cette candidature est déjà traitée");
    }
  },
});

export type ApplicationsService = ReturnType<typeof createApplicationsService>;
