import type { Db } from "../db/database.ts";
import type { ApplicationDbo } from "../models/application.ts";

interface CreateApplicationParams {
  offerId: number;
  studentId: number;
  message: string | null;
}

export const createApplicationsRepository = (db: Db) => {
  const findByStudent = db.prepare<{ studentId: number }, ApplicationDbo>(`
    SELECT a.id, a.offer_id, o.title AS offer_title, c.short_name AS company_short_name,
           ay.label AS academic_year_label, p.code AS period_code, a.student_id,
           a.message, a.status, a.applied_at
    FROM applications a
    JOIN offers o ON o.id = a.offer_id
    JOIN companies c ON c.id = o.company_id
    JOIN academic_years ay ON ay.id = o.academic_year_id
    JOIN periods p ON p.id = o.period_id
    WHERE a.student_id = @studentId
      AND ay.is_current = 1
    ORDER BY a.applied_at DESC, a.id DESC
  `);
  const findActiveOrProcessed = db.prepare<
    { offerId: number; studentId: number },
    { id: number }
  >(`
    SELECT id
    FROM applications
    WHERE offer_id = @offerId
      AND student_id = @studentId
      AND status <> 'WITHDRAWN'
    LIMIT 1
  `);
  const offerForApplication = db.prepare<
    { offerId: number },
    { status: "PUBLISHED"; academic_year_id: number } | undefined
  >("SELECT status, academic_year_id FROM offers WHERE id = @offerId");
  const currentAcademicYear = db.prepare<unknown[], { id: number }>(
    "SELECT id FROM academic_years WHERE is_current = 1",
  );
  const insert = db.prepare<CreateApplicationParams, { id: number }>(`
    INSERT INTO applications (offer_id, student_id, message)
    VALUES (@offerId, @studentId, @message)
    RETURNING id
  `);
  const findByIdForStudent = db.prepare<
    { id: number; studentId: number },
    ApplicationDbo | undefined
  >(`
    SELECT a.id, a.offer_id, o.title AS offer_title, c.short_name AS company_short_name,
           ay.label AS academic_year_label, p.code AS period_code, a.student_id,
           a.message, a.status, a.applied_at
    FROM applications a
    JOIN offers o ON o.id = a.offer_id
    JOIN companies c ON c.id = o.company_id
    JOIN academic_years ay ON ay.id = o.academic_year_id
    JOIN periods p ON p.id = o.period_id
    WHERE a.id = @id AND a.student_id = @studentId
  `);
  const withdraw = db.prepare<{ id: number; studentId: number }, { changes: number }>(`
    UPDATE applications
    SET status = 'WITHDRAWN'
    WHERE id = @id AND student_id = @studentId AND status = 'IN_PROGRESS'
  `);

  return {
    findByStudent: (studentId: number): ApplicationDbo[] => findByStudent.all({ studentId }),
    canApply: (offerId: number, studentId: number): boolean => {
      const offer = offerForApplication.get({ offerId });
      const currentYear = currentAcademicYear.get();
      return (
        offer?.status === "PUBLISHED" &&
        currentYear !== undefined &&
        offer.academic_year_id === currentYear.id &&
        findActiveOrProcessed.get({ offerId, studentId }) === undefined
      );
    },
    create: ({ offerId, studentId, message }: CreateApplicationParams): number =>
      insert.get({ offerId, studentId, message })?.id ??
      (() => {
        throw new Error("La candidature n'a pas été créée");
      })(),
    findByIdForStudent: (id: number, studentId: number): ApplicationDbo | undefined =>
      findByIdForStudent.get({ id, studentId }),
    withdraw: (id: number, studentId: number): boolean =>
      withdraw.run({ id, studentId }).changes === 1,
  };
};

export type ApplicationsRepository = ReturnType<typeof createApplicationsRepository>;
