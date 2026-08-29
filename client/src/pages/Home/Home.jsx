import { motion } from 'framer-motion';
import HeroBanner from '../../components/Home/HeroBanner';
import TopScholarships from '../../components/Home/TopScholarships';
import Testimonials from '../../components/Home/Testimonials';
import FAQSection from '../../components/Home/FAQSection';

const Home = () => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.8 }}
    className="min-h-screen bg-gray-50 dark:bg-gray-900"
  >
    <HeroBanner />
    <TopScholarships />
    <Testimonials />
    <FAQSection />
  </motion.div>
);

export default Home;
