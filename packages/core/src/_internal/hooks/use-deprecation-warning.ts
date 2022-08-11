import React, { useEffect } from 'react';
// import { deprecationWarning } from '@jenga-ui/utils';

export function useDeprecationWarning(...args: Parameters<typeof Object>) {
  const didWarn = React.useRef(false);

  useEffect(() => {
    if (didWarn.current) return;

    didWarn.current = true;
    // deprecationWarning(...args);
  }, [args[0]]);
}
