"use client";

import { useRef } from "react";
import { useMotionValue, useSpring } from "framer-motion";
import { motion } from "framer-motion";

export const MagneticItem = ({ children }: any) => {
  const ref: any = useRef(null);
  const position = { x: useMotionValue(0), y: useMotionValue(0) };

  const handleMouse = (e: any) => {
    const { clientX, clientY } = e;
    const { height, width, left, top } = ref.current.getBoundingClientRect();

    // Calculate center
    const middleX = clientX - (left + width / 2);
    const middleY = clientY - (top + height / 2);

    // Move slightly towards mouse (Magnetic Pull)
    position.x.set(middleX * 0.3); // 0.3 is the pull strength
    position.y.set(middleY * 0.3);
  };

  const reset = () => {
    position.x.set(0);
    position.y.set(0);
  };

  const { x, y } = position;
  // Smooth spring physics for distinct "jelly" feel
  const springX = useSpring(x, { stiffness: 150, damping: 15, mass: 0.1 });
  const springY = useSpring(y, { stiffness: 150, damping: 15, mass: 0.1 });

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouse}
      onMouseLeave={reset}
      style={{ x: springX, y: springY }}
    >
      {children}
    </motion.div>
  );
};
