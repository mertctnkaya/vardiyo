import { useEffect } from 'react';

const BASE_TITLE = 'Vardiyo';

export function usePageTitle(pageTitle: string) {
  useEffect(() => {
    document.title = pageTitle ? `${BASE_TITLE} | ${pageTitle}` : BASE_TITLE;

    return () => {
      document.title = BASE_TITLE;
    };
  }, [pageTitle]);
}

