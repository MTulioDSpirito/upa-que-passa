export const MAX_LOGIN_ATTEMPTS = 5;
export const LOCKOUT_MINUTES = 15;

export function isLocked(lockedUntil: Date | null): boolean {
  return !!lockedUntil && lockedUntil.getTime() > Date.now();
}

export function lockoutRemainingMinutes(lockedUntil: Date | null): number {
  if (!lockedUntil) return 0;
  return Math.max(1, Math.ceil((lockedUntil.getTime() - Date.now()) / 60000));
}

export function nextLockoutState(currentAttempts: number): {
  failedLoginAttempts: number;
  lockedUntil: Date | null;
} {
  const attempts = currentAttempts + 1;
  if (attempts >= MAX_LOGIN_ATTEMPTS) {
    return { failedLoginAttempts: 0, lockedUntil: new Date(Date.now() + LOCKOUT_MINUTES * 60 * 1000) };
  }
  return { failedLoginAttempts: attempts, lockedUntil: null };
}
