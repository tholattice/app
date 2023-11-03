import { motion, AnimatePresence } from "framer-motion";
import { ReactNode } from "react";

export default function AnimatePresenceWrapper({
  mode,
  //   key,
  animate,
  initial,
  className,
  children,
}: {
  mode: "sync" | "popLayout" | "wait" | undefined;
  //   key: string | null | undefined;
  animate: string;
  initial?: boolean | string | undefined;
  className?: string;
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
        variants={variants}
        // key={key}
        animate={animate}
        initial={initial}
        className={className}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
