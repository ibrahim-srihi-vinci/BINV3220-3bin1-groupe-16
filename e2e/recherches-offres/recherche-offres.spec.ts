import { expect, test } from '@playwright/test';

const student = {
  kind: 'STUDENT',
  id: 42,
  firstName: 'Louis',
  lastName: 'Claes',
  email: 'louis.claes@etu.gesta.test',
  roles: [],
  companies: [],
};

const offers = [
  {
    id: 101,
    title: 'API REST de facturation',
    companyShortName: 'Gesta Data',
    academicYear: '2026-2027',
    period: 'P1',
    status: 'PUBLISHED',
  },
  {
    id: 102,
    title: 'Tableau de bord de qualité de données',
    companyShortName: 'Gesta Data',
    academicYear: '2026-2027',
    period: 'P2',
    status: 'PUBLISHED',
  },
  {
    id: 103,
    title: 'Assistant conversationnel interne',
    companyShortName: 'Gesta Services',
    academicYear: '2026-2027',
    period: 'OTHER',
    status: 'PUBLISHED',
  },
];

test.beforeEach(async ({ page }) => {
  await page.route('**/api/auth/demo-users', (route) =>
    route.fulfill({ json: [student] }),
  );
  await page.route('**/api/auth/demo-login', (route) =>
    route.fulfill({ json: { token: 'e2e-student-token', user: student } }),
  );
  await page.route('**/api/offers**', async (route) => {
    const query =
      new URL(route.request().url()).searchParams.get('q')?.trim().toLowerCase() ?? '';
    const results = query === ''
      ? offers
      : offers.filter((offer) => offer.title.toLowerCase().includes(query));

    await route.fulfill({ json: results });
  });

  await page.goto('/');
  await page.getByRole('button', { name: 'Louis Claes' }).click();
  await page.getByRole('link', { name: 'Offres' }).click();
  await expect(page.getByRole('heading', { name: 'Offres de stage' })).toBeVisible();
});

test('Scénario 1 — affiche uniquement les offres publiées correspondant à la recherche', async ({
  page,
}) => {
  await page.getByRole('searchbox', { name: 'Rechercher par titre' }).fill('Api');

  const matchingRow = page.getByRole('row', { name: /API REST de facturation/ });
  await expect(matchingRow).toBeVisible();
  await expect(matchingRow.getByText('Publiée')).toBeVisible();
  await expect(
    page.getByRole('row', { name: /Tableau de bord de qualité de données/ }),
  ).toHaveCount(0);
  await expect(
    page.getByRole('row', { name: /Assistant conversationnel interne/ }),
  ).toHaveCount(0);
});

test('Scénario 2 — affiche un état vide lorsqu’aucune offre ne correspond', async ({
  page,
}) => {
  await page.getByRole('searchbox', { name: 'Rechercher par titre' }).fill('zzzz');

  await expect(
    page.getByText('Aucune offre ne correspond à la recherche.'),
  ).toBeVisible();
  await expect(page.getByRole('table')).toHaveCount(0);
  await expect(page.getByText('API REST de facturation')).toHaveCount(0);
  await expect(page.getByText('Tableau de bord de qualité de données')).toHaveCount(0);
  await expect(page.getByText('Assistant conversationnel interne')).toHaveCount(0);
});
