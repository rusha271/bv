import { useState, useEffect, useRef } from 'react';

interface UseLazyLoadReturn {
  ref: React.RefObject<HTMLDivElement | null>;
  isVisible: boolean;
  isLoaded: boolean;
  handleLoad: () => void;
}

export function useLazyLoad(): UseLazyLoadReturn {
  const [isVisible, setIsVisible] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      {
        threshold: 0.1,
        rootMargin: '50px'
      }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  const handleLoad = () => {
    setIsLoaded(true);
  };

  return { ref, isVisible, isLoaded, handleLoad };
}
