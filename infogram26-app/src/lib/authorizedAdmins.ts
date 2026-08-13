// Only these Google accounts may sign in to the admin panel as Super Admin.
export const SUPER_ADMIN_EMAILS = [
  'maithreyan2006@gmail.com',
  'mohammedthameem0806@gmail.com',
];

export function isAuthorizedSuperAdminEmail(email: string | null | undefined): boolean {
  if (!email) return false;
  return SUPER_ADMIN_EMAILS.includes(email.toLowerCase());
}
