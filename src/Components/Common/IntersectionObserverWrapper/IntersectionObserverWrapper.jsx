import React, { useRef, useEffect, useState } from "react";

export const IntersectionObserverWrapper = ({
  children,
  options = { threshold: 0.1 },
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const targetRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsVisible(true);
        observer.disconnect(); // Stop observing once the element is visible
      }
    }, options);

    if (targetRef.current) {
      observer.observe(targetRef.current);
    }

    return () => {
      if (targetRef.current) {
        observer.unobserve(targetRef.current);
      }
    };
  }, [options]);

  return (
    <div
      style={{
        width: "fit-content",
        height: "fit-content",
      }}
      ref={targetRef}
    >
      {isVisible ? children : null}
    </div>
  );
};
