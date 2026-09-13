import { useEffect, useState } from 'react';

// Returns true when viewport is below the given breakpoint (default 768px).
// Used to switch layouts between laptop and phone.
export default function useIsMobile(breakpoint = 768) {
  const [isMobile, setIsMobile] = useState(
    () => window.innerWidth < breakpoint
  );

  useEffect(() => {
    function onResize() {
      setIsMobile(window.innerWidth < breakpoint);
    }

    window.addEventListener('resize', onResize);
    return () =>
      window.removeEventListener('resize', onResize);
  }, [breakpoint]);

  return isMobile;
}
