import { useEffect, useRef, useState } from "react";
import { Box, Image, Skeleton } from "@chakra-ui/react";
export const LazyLoadedImage = ({ src, filter, ImageProps, ...rest }) => {
  const [isLoaded, setIsLoaded] = useState();
  const [loaded, setLoaded] = useState(false);
  const imageRef = useRef(null);

  useEffect(() => {
    const imgElement = imageRef.current;
    let observer;

    if (imgElement) {
      observer = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setLoaded(true);
            observer.unobserve(entry.target);
          }
        });
      });

      observer.observe(imgElement);

      return () => {
        if (observer && observer.unobserve) {
          observer.unobserve(imgElement);
        }
      };
    }
  }, []);

  return (
    <Box
      as={Skeleton}
      isLoaded={isLoaded && loaded}
      overflow="hidden"
      fadeDuration={2}
      {...rest}
    >
      <Image
        ref={imageRef}
        src={loaded ? src : ""}
        filter={filter}
        style={{
          width: "100%",
          height: "100%",
          ...ImageProps,
        }}
        loading="lazy"
        decoding="async"
        onLoad={() => {
          setIsLoaded(true);
        }}
      />
    </Box>
  );
};
