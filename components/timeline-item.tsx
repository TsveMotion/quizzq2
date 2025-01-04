import { motion } from "framer-motion";

export function TimelineItem({
  date,
  title,
  description,
  isLeft = true,
}: {
  date: string;
  title: string;
  description: string;
  isLeft?: boolean;
}) {
  return (
    <div className={`flex items-center ${isLeft ? 'justify-end' : 'justify-start'} w-full`}>
      <motion.div
        initial={{ opacity: 0, x: isLeft ? -50 : 50 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
        className={`w-1/2 ${isLeft ? 'text-right pr-8' : 'text-left pl-8'}`}
      >
        <div className="inline-block">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 }}
            viewport={{ once: true }}
            className="text-sm font-semibold text-primary mb-2"
          >
            {date}
          </motion.div>
          <motion.h3
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            viewport={{ once: true }}
            className="text-xl font-bold mb-2"
          >
            {title}
          </motion.h3>
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            viewport={{ once: true }}
            className="text-muted-foreground"
          >
            {description}
          </motion.p>
        </div>
      </motion.div>
    </div>
  );
}
