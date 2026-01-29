"use client";

import { Box, Typography } from "@mui/material";
import {
  motion,
  useMotionValue,
  useScroll,
  useVelocity,
  useSpring,
  useTransform,
  useAnimationFrame,
} from "framer-motion";
import { useRef } from "react";

export const VelocityText = ({ baseVelocity = 100, children }: any) => {
  const baseX = useMotionValue(0);
  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);
  const smoothVelocity = useSpring(scrollVelocity, {
    damping: 50,
    stiffness: 400,
  });
  const velocityFactor = useTransform(smoothVelocity, [0, 1000], [0, 5], {
    clamp: false,
  });
  const x = useTransform(baseX, (v) => `${v}%`);
  const directionFactor = useRef(1);

  useAnimationFrame((t, delta) => {
    let moveBy = directionFactor.current * baseVelocity * (delta / 1000);
    if (velocityFactor.get() < 0) directionFactor.current = -1;
    else if (velocityFactor.get() > 0) directionFactor.current = 1;
    moveBy += directionFactor.current * moveBy * velocityFactor.get();
    baseX.set(baseX.get() + moveBy);
  });

  return (
    <Box
      sx={{ overflow: "hidden", whiteSpace: "nowrap", display: "flex", py: 2 }}
    >
      <motion.div style={{ x, display: "flex", gap: "50px" }}>
        {[...Array(4)].map((_, i) => (
          <Typography
            key={i}
            variant="h1"
            sx={{
              fontSize: "8rem",
              fontWeight: 900,
              textTransform: "uppercase",
              color: "#2c2c2cff",
              WebkitTextStroke: "1px rgba(255,255,255,0.3)",
              fontFamily: '"Oswald", sans-serif',
            }}
          >
            {children}
          </Typography>
        ))}
      </motion.div>
    </Box>
  );
};
