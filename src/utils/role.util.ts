export function assignRoleFromEmail(email?: string): 'ADMIN' | 'USER' {
  if (!email) return 'USER';
  const domain = email.split('@')[1]?.toLowerCase() ?? '';
  return domain === 'company.com' ? 'ADMIN' : 'USER';
}
