import { Router } from "express";
import { toApplicationDto } from "../mappers/application.mapper.ts";
import { getCurrentUser } from "../middlewares/authenticate.ts";
import type { ApplicationsService } from "../services/applications.service.ts";

const parsePositiveInteger = (value: unknown): number | undefined => {
  if (typeof value !== "string" || !/^[1-9]\d*$/.test(value)) return undefined;
  return Number(value);
};

export const createApplicationsRouter = (service: ApplicationsService) => {
  const router = Router();

  router.get("/", (req, res) => {
    res.json(service.listMine(getCurrentUser(req)).map(toApplicationDto));
  });

  router.post("/", (req, res) => {
    const body: unknown = req.body;
    const data =
      typeof body === "object" && body !== null
        ? (body as { offerId?: unknown; message?: unknown })
        : {};
    const offerId = typeof data.offerId === "number" ? data.offerId : Number.NaN;
    const application = service.apply(getCurrentUser(req), offerId, data.message);
    res.status(201).json(toApplicationDto(application));
  });

  router.delete("/:id", (req, res) => {
    const id = parsePositiveInteger(req.params.id);
    service.withdraw(getCurrentUser(req), id ?? Number.NaN);
    res.status(204).send();
  });

  return router;
};
