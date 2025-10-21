// Safe hook for using Stack user that handles cases when Stack isn't available
/* eslint-disable @typescript-eslint/no-require-imports, react-hooks/rules-of-hooks */
export function useSafeUser() {
  try {
    const { useUser } = require('@stackframe/stack');
    return useUser();
  } catch {
    // Stack not available or not properly configured
    return null;
  }
}