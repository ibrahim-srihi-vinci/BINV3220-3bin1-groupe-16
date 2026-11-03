CREATE UNIQUE INDEX applications_one_non_withdrawn_per_student_offer
  ON applications (offer_id, student_id)
  WHERE status <> 'WITHDRAWN';
