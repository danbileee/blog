import styled from '@emotion/styled';
import {
  forwardRef,
  HTMLAttributes,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
} from 'react';

interface Props extends HTMLAttributes<HTMLDivElement> {
  callback: (isIntersecting: boolean) => void;
  options?: IntersectionObserverInit;
}

const ElementObserver = forwardRef<HTMLDivElement, Props>(function ElementObserver(
  { callback, options, ...props },
  ref,
) {
  const observerRef = useRef<HTMLDivElement>(null);

  useImperativeHandle(ref, () => observerRef.current as HTMLDivElement, []);

  const handleIntersection: IntersectionObserverCallback = useCallback(
    ([entry]) => {
      callback(entry.isIntersecting);
    },
    [callback],
  );

  useEffect(() => {
    const observer = new IntersectionObserver(handleIntersection, {
      rootMargin: '0px',
      threshold: 1,
      ...options,
    });

    if (observerRef.current) {
      observer.observe(observerRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, [handleIntersection, options]);

  return <Observer ref={observerRef} {...props} />;
});

const Observer = styled.div`
  width: 1px;
  height: 1px;
  margin-top: auto;
`;

export default ElementObserver;
