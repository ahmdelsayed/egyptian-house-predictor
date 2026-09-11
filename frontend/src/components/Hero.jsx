import { motion } from "framer-motion";
import { ArrowDown } from "lucide-react";

function ArchMotif() {
  return (
    <svg
      viewBox="0 0 900 600"
      className="absolute inset-0 h-full w-full opacity-[0.14]"
      preserveAspectRatio="xMidYMax slice"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="archStroke" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#C89F4E" />
          <stop offset="100%" stopColor="#C89F4E" stopOpacity="0" />
        </linearGradient>
      </defs>
      {[0, 1, 2, 3, 4].map((i) => (
        <path
          key={i}
          d={`M ${40 + i * 160} 600 V ${340 - i * 8} A ${70 + i * 6} ${
            70 + i * 6
          } 0 0 1 ${40 + i * 160 + 140 + i * 12} ${340 - i * 8} V 600`}
          fill="none"
          stroke="url(#archStroke)"
          strokeWidth="1.5"
        />
      ))}
    </svg>
  );
}

export default function Hero() {
  return (
    <section
      id="home"
      className="relative isolate overflow-hidden bg-navy text-papyrus"
    >
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(60% 50% at 18% 15%, rgba(200,159,78,0.16), transparent 60%), radial-gradient(45% 40% at 85% 8%, rgba(110,122,79,0.18), transparent 60%), radial-gradient(70% 60% at 50% 100%, #153431, #0B211F 70%)",
        }}
        aria-hidden="true"
      />
      <ArchMotif />

      <div className="section-shell relative flex min-h-[86vh] flex-col justify-center py-28">
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-sm font-medium text-gold-bright"
        >
          A gated community, reimagined for the desert
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="mt-5 max-w-3xl text-balance font-display text-5xl font-medium leading-[1.08] sm:text-6xl md:text-7xl"
        >
          Space to breathe, land that holds its value.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="mt-6 max-w-xl text-lg leading-relaxed text-papyrus/75"
        >
          Mountain View Egypt builds low-density villas and courtyard homes across Egypt's
          growing desert communities. Before you visit, get a grounded sense
          of what a property like yours is really worth.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="mt-10 flex flex-wrap items-center gap-5"
        >
          <a
            href="#estimate"
            className="inline-flex items-center gap-2 rounded-full bg-gold px-7 py-4 text-base font-semibold text-navy transition-colors hover:bg-gold-bright"
          >
            Estimate your property value
            <ArrowDown className="h-4 w-4" />
          </a>
          <a
            href="#communities"
            className="text-sm font-medium text-papyrus/70 underline decoration-papyrus/30 underline-offset-4 hover:text-papyrus"
          >
            See our communities
          </a>
        </motion.div>
      </div>
    </section>
  );
}
