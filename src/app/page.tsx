import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import SpaceListing from '@/components/SpaceListing';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <SpaceListing />
      </main>
      <Footer />
    </>
  );
}
