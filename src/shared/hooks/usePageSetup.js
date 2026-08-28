import { useEffect } from "react";

export const usePageSetup = (title) => {
  useEffect(() => {
    if (!title) {
      return undefined;
    }

    const previousTitle = document.title;

    document.title = title;

    return () => {
      document.title = previousTitle;
    };
  }, [title]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
};
