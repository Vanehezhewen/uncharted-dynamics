import React, { useEffect, useState, useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useMotionValue,
  useSpring,
  useMotionValueEvent,
} from "motion/react";
import {
  ArrowRight,
  Cpu,
  Activity,
  Database,
  CheckCircle,
  Zap,
} from "lucide-react";

// Add StarBurst component
const StarBurst: React.FC<{ x: number; y: number; onComplete: () => void }> = ({
  x,
  y,
  onComplete,
}) => {
  return (
    <div
      className="fixed pointer-events-none z-[100]"
      style={{ left: x, top: y }}
    >
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={i}
          initial={{ x: 0, y: 0, scale: 1, opacity: 1 }}
          animate={{
            x: Math.cos((i * Math.PI) / 4) * 60,
            y: Math.sin((i * Math.PI) / 4) * 60,
            scale: 0,
            opacity: 0,
          }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          onAnimationComplete={i === 0 ? onComplete : undefined}
          className="absolute w-[3px] h-[3px] bg-brand-accent rounded-full"
          style={{
            originX: 0.5,
            originY: 0.5,
            marginLeft: -1.5,
            marginTop: -1.5,
          }}
        />
      ))}
      <motion.div
        initial={{ scale: 0, opacity: 1, rotate: 0 }}
        animate={{ scale: 1.5, opacity: 0, rotate: 90 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="absolute -ml-3 -mt-3 text-brand-accent"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2L15 9L22 12L15 15L12 22L9 15L2 12L9 9L12 2Z" />
        </svg>
      </motion.div>
    </div>
  );
};

const InteractiveBackground = () => {
  const mouseX = useMotionValue(
    typeof window !== "undefined" ? window.innerWidth / 2 : 0,
  );
  const mouseY = useMotionValue(
    typeof window !== "undefined" ? window.innerHeight / 2 : 0,
  );

  const springConfig = { damping: 25, stiffness: 120 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  const [bursts, setBursts] = useState<{ id: number; x: number; y: number }[]>(
    [],
  );

  useEffect(() => {
    let burstId = 0;
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX - 400); // offset by half the orb size
      mouseY.set(e.clientY - 400);
    };

    const handleMouseDown = (e: MouseEvent) => {
      const id = burstId++;
      setBursts((prev) => [...prev, { id, x: e.clientX, y: e.clientY }]);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mousedown", handleMouseDown);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mousedown", handleMouseDown);
    };
  }, [mouseX, mouseY]);

  const handleBurstComplete = (id: number) => {
    setBursts((prev) => prev.filter((b) => b.id !== id));
  };

  return (
    <>
      <motion.div
        style={{ x: smoothX, y: smoothY }}
        className="fixed top-0 left-0 w-[800px] h-[800px] bg-brand-accent/20 blur-[120px] rounded-full pointer-events-none z-0"
      />
      {bursts.map((burst) => (
        <StarBurst
          key={burst.id}
          x={burst.x}
          y={burst.y}
          onComplete={() => handleBurstComplete(burst.id)}
        />
      ))}
    </>
  );
};

const NavLink = ({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) => (
  <a
    href={href}
    className="relative group text-[11px] font-semibold tracking-[0.15em] uppercase hover:text-brand-accent transition-colors py-1"
  >
    {children}
    <span className="absolute bottom-0 left-0 w-full h-[1px] bg-brand-accent scale-x-0 group-hover:scale-x-100 origin-center transition-transform duration-300 ease-out" />
  </a>
);

const Nav = () => (
  <motion.nav
    initial={{ y: -20, opacity: 0 }}
    animate={{ y: 0, opacity: 1 }}
    transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
    className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 xl:px-[150px] h-[7vh] backdrop-blur-md bg-brand-header/90 border-b border-brand-text/15"
  >
    <a
      href="#"
      className="flex items-center h-full group z-10 cursor-pointer w-auto"
    >
      <img
        src="/logo-only.png"
        alt="Uncharted Dynamics Icon"
        className="h-[60%] w-auto object-contain shrink-0"
      />
      <div className="overflow-hidden flex items-center h-full transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] max-w-0 group-hover:max-w-[400px] opacity-0 group-hover:opacity-100 ml-0 group-hover:ml-4">
        <img
          src="/logo.png"
          alt="Uncharted Dynamics Text"
          className="h-[60%] w-auto max-w-none object-contain"
        />
      </div>
    </a>
    <div className="hidden md:flex items-center gap-10 lg:gap-16">
      <NavLink href="#products">Products</NavLink>
      <NavLink href="#technology">Technology</NavLink>
      <NavLink href="#data-services">Data Services</NavLink>
      <NavLink href="#ecosystem">Ecosystem</NavLink>
      <a
        href="#contact"
        className="ml-4 text-[10px] uppercase font-bold tracking-[0.1em] px-4 py-2 border border-brand-text/20 rounded-full hover:bg-brand-text hover:text-white transition-colors"
      >
        Contact Us
      </a>
    </div>
  </motion.nav>
);

const ScrollVideoBackground = () => {
  const { scrollY } = useScroll();
  const yParallax = useTransform(scrollY, [0, 1000], [0, 300]);

  return (
    <motion.div
      style={{ y: yParallax }}
      className="absolute inset-0 w-[120%] h-[120%] -ml-[10%] -mt-[10%] z-0 pointer-events-none opacity-50"
    >
      <video
        src="/bg.mp4"
        className="w-full h-full object-cover"
        playsInline
        muted
        autoPlay
        loop
      />
    </motion.div>
  );
};

const Hero = () => {
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 1000], [0, 250]);
  const y2 = useTransform(scrollY, [0, 1000], [0, -200]);

  return (
    <section
      id="index"
      className="group relative min-h-[90vh] flex flex-col items-center justify-center pt-32 pb-20 px-6 xl:px-[150px] overflow-hidden"
    >
      <ScrollVideoBackground />
      {/* Background Orbs */}
      <div
        className="absolute inset-0 opacity-[0.25] pointer-events-none mix-blend-overlay z-0"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E\")",
        }}
      />

      <div className="relative z-10 w-full mt-20 text-left flex flex-col items-start">
        <motion.div
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: {
                staggerChildren: 0.3,
                delayChildren: 0.2,
              },
            },
          }}
          initial="hidden"
          animate="visible"
          className="md:max-w-[65%] flex flex-col items-start gap-8"
        >
          <motion.h1
            variants={{
              hidden: { opacity: 0, y: 50 },
              visible: {
                opacity: 1,
                y: 0,
                transition: { duration: 1.2, ease: [0.16, 1, 0.3, 1] },
              },
            }}
            className="text-[2.7rem] sm:text-[3.5rem] md:text-[4.5rem] leading-[1.05] font-medium tracking-[-0.03em]"
          >
            Where AI Meets the Physical World <br className="hidden lg:block" />
            <span className="text-brand-accent">At Scale</span>
          </motion.h1>

          <motion.p
            variants={{
              hidden: { opacity: 0, y: 30 },
              visible: {
                opacity: 1,
                y: 0,
                transition: { duration: 1, ease: [0.16, 1, 0.3, 1] },
              },
            }}
            className="font-montserrat font-normal text-lg leading-relaxed opacity-80 max-w-[70vw] md:max-w-[45vw]"
          >
            We believe intelligence is shaped by interaction with the physical world.
            To build machines that truly understand reality, AI must learn physics as a first principle.
            We are building the infrastructure for that future.
          </motion.p>

          <motion.div
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: {
                opacity: 1,
                y: 0,
                transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
              },
            }}
            className="flex flex-col sm:flex-row items-center justify-start gap-4"
          >
            <button className="w-full sm:w-auto py-4 px-8 text-white text-[10px] font-bold tracking-[0.15em] uppercase bg-brand-accent/90 backdrop-blur-md shadow-lg shadow-brand-accent/20 flex justify-between items-center gap-8 hover:bg-brand-accent hover:-translate-y-0.5 transition-all rounded-full">
              <span>Request a Demo</span>
              <span>&rarr;</span>
            </button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

const SocialProof = () => (
  <section className="py-16 px-6 xl:px-[150px] bg-white/40 border-y border-brand-text/15 text-center flex flex-col items-center">
    <motion.p
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="text-xs sm:text-sm font-semibold tracking-widest uppercase opacity-60 mb-6"
    >
      Powering the next generation of physical intelligence.
    </motion.p>
    <motion.h3
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: 0.1 }}
      className="text-xl sm:text-2xl lg:text-3xl font-medium tracking-tight max-w-4xl"
    >
      Built for{" "}
      <span className="text-brand-accent">Scalable Deployment</span> in the world's most complex physical environments.
    </motion.h3>
  </section>
);

const Metric = ({
  value,
  label,
  desc,
  delay,
}: {
  value: string;
  label: string;
  desc: string;
  delay: number;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-100px" }}
    transition={{ duration: 0.7, delay }}
    className="flex flex-col items-center sm:items-start text-center sm:text-left flex-1"
  >
    <div className="text-[3rem] sm:text-[4rem] leading-[0.95] font-medium tracking-[-0.03em] text-brand-text mb-4">
      {value}
    </div>
    <div className="text-[12px] font-bold tracking-[0.15em] uppercase mb-2">
      {label}
    </div>
    <p className="text-sm opacity-70 leading-relaxed max-w-xs">{desc}</p>
  </motion.div>
);

const CoreBenefits = () => (
  <section
    id="benefits"
    className="py-24 px-10 bg-white/20 border-b border-brand-text/15"
  >
    <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center md:items-start justify-between gap-16 md:gap-8">
      <Metric
        value="<10%"
        label="Industrial-Grade Accuracy"
        desc="Force and friction error within tolerances real deployments demand."
        delay={0.1}
      />
      <div className="hidden md:block w-[1px] h-32 bg-brand-text/15 mt-4" />
      <Metric
        value="10×"
        label="Accelerated Development"
        desc="From concept to deployment, in a fraction of the time."
        delay={0.2}
      />
      <div className="hidden md:block w-[1px] h-32 bg-brand-text/15 mt-4" />
      <Metric
        value="1/10"
        label="Development Cost"
        desc="Less time re-tuning. Less spent on manual data collection."
        delay={0.3}
      />
    </div>
  </section>
);

const FeatureCard = ({ index, title, desc, delay }: any) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    whileHover={{ y: -8, transition: { duration: 0.3, ease: "easeOut" } }}
    viewport={{ once: true, margin: "-50px" }}
    transition={{ duration: 0.6, delay }}
    className="group p-10 sm:p-14 border border-brand-text/10 bg-[#ffffff] rounded-[2rem] shadow-sm flex flex-col hover:shadow-xl hover:shadow-brand-text/5 transition-all duration-300"
  >
    <div>
      <div className="flex items-center gap-4 border-b border-brand-text/10 pb-6 mb-8 group-hover:border-brand-accent/30 transition-colors duration-300">
        <span className="text-[10px] font-bold tracking-[0.15em] uppercase text-brand-text/40 group-hover:text-brand-accent transition-colors duration-300">
          {index}
        </span>
        <span className="text-[10px] font-bold tracking-[0.15em] uppercase group-hover:text-brand-accent transition-colors duration-300">
          {title}
        </span>
      </div>
      <p className="text-xl sm:text-[1.35rem] font-medium leading-relaxed mb-10 text-brand-text">
        {desc}
      </p>
    </div>
    <div className="mt-auto flex justify-start">
      <a
        href="#"
        className="inline-flex items-center gap-2 text-[10px] font-bold tracking-[0.15em] uppercase text-brand-text/70 group-hover:text-brand-accent transition-all duration-300 pb-1"
      >
        Learn More{" "}
        <ArrowRight className="w-4 h-4 ml-0 group-hover:translate-x-2 transition-transform duration-300" />
      </a>
    </div>
  </motion.div>
);

const HowItWorks = () => (
  <section id="technology" className="py-32 px-6 xl:px-[150px]">
    <div className="w-full flex flex-col lg:flex-row gap-16 lg:gap-12 items-start relative">
      <div className="lg:w-5/12 lg:sticky top-[20vh]">
        <div className="w-[60px] h-[12px] bg-brand-accent rounded-full mb-8" />
        <h2 className="text-[3rem] sm:text-[4.5rem] leading-[0.95] font-medium tracking-[-0.03em] mb-6">
          How It <br />
          <span className="text-brand-orange">Works</span>
        </h2>
        <p className="text-lg sm:text-xl leading-relaxed opacity-80 italic max-w-lg mt-8">
          The infrastructure layer the industry has been missing.
        </p>
      </div>

      <div className="lg:w-7/12 flex flex-col gap-6 w-full relative z-10">
        <FeatureCard
          index="01"
          title="High-Fidelity Physics Solver"
          desc="Models contact-rich, nonlinear dynamics with rigorous physical consistency — capturing the interactions that matter most."
          delay={0.1}
        />
        <FeatureCard
          index="02"
          title="Synthetic Data Generation"
          desc="Generates scalable, diverse training data grounded in first-principles physics, without sacrificing real-world fidelity."
          delay={0.2}
        />
        <FeatureCard
          index="03"
          title="Simulation Evaluation Loop"
          desc="Continuously benchmarks and refines behavior against physical ground truth, closing the gap between simulation and reality."
          delay={0.3}
        />
      </div>
    </div>
  </section>
);


const CaseStudies = () => (
  <section
    id="ecosystem"
    className="py-32 px-6 xl:px-[150px] bg-white text-brand-text relative overflow-hidden"
  >
    <div className="relative z-10 max-w-7xl mx-auto">
      <div className="mb-16 flex flex-col items-center text-center">
        <h2 className="text-[2.5rem] sm:text-[3.5rem] leading-[0.95] font-medium tracking-[-0.03em] mb-4">
          Case Studies
        </h2>
        <p className="text-lg opacity-70 max-w-xl">
          What becomes possible across robotic domains.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          {
            title: "Dexterous Hand Manipulation",
            desc: "Handling deformable and soft objects — where contact geometry shifts mid-grasp and most simulators lose physical ground truth.",
          },
          {
            title: "Humanoid Robot Control",
            desc: "Torque consistency and dynamic balance, sim-to-real transfer that holds up outside controlled conditions.",
          },
          {
            title: "Cross-Terrain Operations",
            desc: "Soft-rigid terrain response that gives mobile robots reliable footing on slopes, loose ground, and mixed surfaces.",
          },
        ].map((study, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 * i }}
            className="p-10 border border-brand-text/10 rounded-[2rem] bg-[#f5f5f7] hover:shadow-xl hover:shadow-brand-text/5 transition-all"
          >
            <div className="text-[10px] font-bold tracking-[0.15em] uppercase text-brand-accent mb-6">
              0{i + 1}
            </div>
            <h3 className="text-xl font-medium mb-4">{study.title}</h3>
            <p className="opacity-70 leading-relaxed text-sm">{study.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);


const BuildOnFirstPrinciples = () => (
  <section className="py-32 px-6 xl:px-[150px] bg-[#f5f5f7]">
    <div className="max-w-4xl mx-auto w-full">
      <div className="mb-16">
        <h2 className="text-[2.5rem] sm:text-[3.5rem] leading-[0.95] font-medium tracking-[-0.03em] mb-4">
          Built on First Principles
        </h2>
        <p className="text-lg opacity-60">
          Most simulation engines were designed for graphics. We weren't.
        </p>
      </div>
      <div className="space-y-4">
        {[
          {
            title: "Why We Started From Scratch",
            body: "Existing solvers make tradeoffs that work for rendering and games — speed over accuracy, approximation over consistency. For robotics, those tradeoffs compound. A policy trained on physically inconsistent data fails in the real world. We built from the ground up because patching existing engines couldn't close that gap.",
          },
          {
            title: "The Tradeoffs We Made",
            body: "We chose fidelity over speed where it matters — in contact resolution, deformation modeling, and friction computation. That means our solver is not the fastest, but it is the most physically consistent in the scenarios that break other engines. That's a deliberate choice, not a limitation.",
          },
          {
            title: "What It Unlocks",
            body: "When the physics is right, everything downstream gets better. Training data carries real signal. Policies transfer. Evaluation results mean something. The solver isn't the end product — it's what makes the rest of the stack trustworthy.",
          },
        ].map((item, i) => (
          <div
            key={i}
            className="p-6 sm:p-8 bg-white border border-brand-text/10 rounded-[2rem]"
          >
            <h3 className="font-medium text-lg mb-4">{item.title}</h3>
            <p className="opacity-70 leading-relaxed pl-4 border-l-2 border-brand-accent/30">
              {item.body}
            </p>
          </div>
        ))}
      </div>
    </div>
  </section>
);


const FinalCTA = () => (
  <section className="py-32 px-6 xl:px-[150px] bg-brand-accent text-white text-center flex flex-col items-center">
    <h2 className="text-[3rem] sm:text-[4.5rem] leading-[0.95] font-medium tracking-[-0.03em] mb-6">
      Minimize the <br className="md:hidden" />
      Sim2Real Gap Today.
    </h2>
    <p className="text-xl sm:text-2xl opacity-90 mb-12 max-w-2xl font-light">
      Join the next-generation physical intelligence ecosystem.
    </p>
    <a
      href="#contact"
      className="py-5 px-10 text-brand-text text-[11px] font-bold tracking-[0.15em] uppercase bg-white hover:scale-105 transition-all rounded-full shadow-2xl flex items-center gap-4"
    >
      Connect With Our Experts <ArrowRight className="w-5 h-5" />
    </a>
  </section>
);

const Footer = () => (
  <footer
    id="contact"
    className="w-full px-6 xl:px-[150px] py-16 border-t border-brand-text/15 bg-white/20 flex flex-col md:flex-row justify-between items-start md:items-center gap-12 text-brand-text"
  >
    <div className="flex flex-col gap-6 max-w-sm">
      <a
        href="#"
        className="flex items-center group z-10 opacity-80 hover:opacity-100 transition-opacity cursor-pointer"
      >
        <img
          src="/logo.png"
          alt="Uncharted Dynamics Logo"
          className="h-6 w-auto object-contain shrink-0"
        />
      </a>
      <p className="text-sm opacity-60 leading-relaxed font-montserrat">
        Enabling every intelligent agent to truly understand and interact with
        the physical world.
      </p>
    </div>

    <div className="flex flex-col sm:flex-row gap-12 lg:gap-24">
      <div className="flex flex-col gap-4 text-sm">
        <span className="text-[10px] font-bold tracking-[0.15em] uppercase opacity-50">
          Contact Information
        </span>
        <a
          href="mailto:info@uncharted-dynamics.com"
          className="hover:text-brand-accent transition-colors font-semibold"
        >
          info@uncharted-dynamics.com
        </a>
      </div>
      <div className="flex flex-col gap-4 text-sm">
        <span className="text-[10px] font-bold tracking-[0.15em] uppercase opacity-50">
          Links
        </span>
        <a
          href="#"
          className="hover:text-brand-accent transition-colors opacity-80"
        >
          SDK Documentation
        </a>
        <a
          href="#"
          className="hover:text-brand-accent transition-colors opacity-80"
        >
          Privacy Policy
        </a>
        <a
          href="#"
          className="hover:text-brand-accent transition-colors opacity-80"
        >
          Terms of Service
        </a>
      </div>
    </div>
  </footer>
);

export default function App() {
  return (
    <div className="bg-brand-bg text-brand-text min-h-screen font-sans selection:bg-brand-accent/20 selection:text-brand-text">
      <InteractiveBackground />
      <Nav />
      <main>
        <Hero />
        <SocialProof />
        <CoreBenefits />
        <HowItWorks />
        <CaseStudies />
        <FAQ />
        <FinalCTA />
      </main>
      <Footer />
    </div>
  );
}
