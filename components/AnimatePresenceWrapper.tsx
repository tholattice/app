import { motion, AnimatePresence } from "framer-motion";
import { ReactNode } from "react";

export default function AnimatePresenceWrapper({
  mode,
  //   key,
  animate,
  initial,
  className,
  transition,
  variantsProvide,
  children,
}: {
  mode: "sync" | "popLayout" | "wait" | undefined;
  //   key: string | null | undefined;
  animate: string | { opacity: number };
  initial?: boolean | string | undefined | { opacity: number };
  className?: string;
  transition?: { duration: number };
  variantsProvide: boolean;
  children: ReactNode;
}) {
  const variants = {
    show: {
      opacity: 1,
      y: 0,
      transition: {
        ease: "easeIn",
        duration: 0.3,
      },
    },
    hide: {
      y: -10,
      opacity: 0,
    },
  };

  return (
    <AnimatePresence mode={mode}>
      <motion.div
        variants={variantsProvide ? variants : undefined}
        // key={key}
        animate={animate}
        initial={initial}
        transition={transition}
        className={className}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
