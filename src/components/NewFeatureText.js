import { motion } from 'framer-motion';

const typingVariants = {
  hidden: { width: 0 },
  visible: {
    width: 'auto',
    transition: {
      type: 'tween',
      duration: 2
    }
  }
};

const NewFeatureText = ({ text }) => (
  <motion.div
    initial="hidden"
    animate="visible"
    variants={typingVariants}
    style={{ overflow: 'hidden', whiteSpace: 'nowrap', display: 'inline-block' }}
  >
    {text}
  </motion.div>
);

export default NewFeatureText;
