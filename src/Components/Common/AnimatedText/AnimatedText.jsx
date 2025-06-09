import { useInView, motion } from "framer-motion";
import PropTypes from "prop-types";
import React, { useRef, useMemo } from "react";

const AnimatedWord = ({
  word,
  inView,
  index,
  duration = 0.3,
  staggerDelay = 0.01,
}) => {
  const wordVariants = {
    initial: {
      y: "100%",
      opacity: 0,
    },
    hidden: {
      y: "100%",
      opacity: 0,
    },
    show: {
      y: "0%",
      opacity: 1,
      transition: {
        type: "spring",
        damping: 20,
      },
    },
  };

  return (
    <span
      style={{
        height: "fit-content",
        display: "inline-block",
        overflow: "hidden",
        paddingBottom: "5px",
      }}
    >
      <motion.span
        style={{
          display: "inline-block",
          willChange: "transform, opacity",
        }}
        variants={wordVariants}
        initial="initial"
        animate={inView ? "show" : "hidden"}
        exit="hidden"
        transition={{
          duration,
          delay: index * staggerDelay,
        }}
      >
        {word}
      </motion.span>
    </span>
  );
};

AnimatedWord.propTypes = {
  word: PropTypes.string.isRequired,
  inView: PropTypes.bool.isRequired,
  index: PropTypes.number.isRequired,
  duration: PropTypes.number,
  staggerDelay: PropTypes.number,
};

export const AnimatedText = ({
  children,
  spacing = "5px",
  isCentered = false,
  staggerDelay = 0.01,
  animationDuration = 0.3,
  threshold = 0.2,
}) => {
  const ref = useRef(null);
  const inView = useInView(ref, {
    amount: threshold,
  });

  // Memoize child processing to prevent unnecessary re-renders
  const processedChildren = useMemo(() => {
    // Handle single child or array of children
    const childrenArray = Array.isArray(children) ? children : [children];

    return childrenArray.map((child, childIndex) => {
      // Ensure child is a valid React element
      if (!React.isValidElement(child)) return null;

      const words = (child.props.children || "")
        .toString()
        .trim()
        .split(" ")
        .filter((word) => word.length > 0);

      return React.cloneElement(child, {
        ref,
        key: childIndex,
        style: {
          display: "flex",
          gap: spacing,
          flexWrap: "wrap",
          justifyContent: isCentered ? "center" : "flex-start",
          alignItems: "center",
        },
        children: words.map((word, wordIndex) => (
          <AnimatedWord
            key={wordIndex}
            word={word}
            index={wordIndex}
            inView={inView}
            duration={child.props.animationDuration || animationDuration}
            staggerDelay={staggerDelay}
          />
        )),
      });
    });
  }, [
    children,
    spacing,
    isCentered,
    inView,
    animationDuration,
    staggerDelay,
    threshold,
  ]);

  return <>{processedChildren}</>;
};

AnimatedText.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]).isRequired,
  spacing: PropTypes.string,
  isCentered: PropTypes.bool,
  staggerDelay: PropTypes.number,
  animationDuration: PropTypes.number,
  threshold: PropTypes.number,
};
