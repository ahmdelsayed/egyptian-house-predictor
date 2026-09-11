import { useState } from "react";
import { motion } from "framer-motion";
import { MapPin } from "lucide-react";

const COMMUNITIES = [
  {
    name: "Amber Dune",
    city: "Ain Sokhna",
    blurb: "Terraced villas facing the Red Sea, built around shared pools.",
    image:
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=900&q=85",
  },
  {
    name: "Olive Court",
    city: "New Cairo",
    blurb: "Courtyard townhouses set around a working olive grove.",
    image:
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=900&q=85",
  },
  {
    name: "Sahara Bloom",
    city: "North Coast",
    blurb: "Low-rise chalets with private gardens, steps from the shore.",
    image:
      "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=900&q=85",
  },
  {
    name: "Nile Terrace",
    city: "6th of October",
    blurb: "Family villas on wide plots, ten minutes from the ring road.",
    image:
      "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?auto=format&fit=crop&w=900&q=85",
  },
];

export default function Communities() {
  const [tilted, setTilted] = useState(null);

  return (
    <section
      id="communities"
      className="relative isolate overflow-hidden bg-papyrus py-24 sm:py-32"
    >
      <svg
        className="pointer-events-none absolute -right-16 top-12 -z-10 h-[26rem] w-[26rem] text-gold/15"
        viewBox="0 0 400 400"
        fill="none"
        aria-hidden="true"
      >
        <circle cx="200" cy="200" r="142" stroke="currentColor" strokeWidth="1" />
        <circle cx="200" cy="200" r="98" stroke="currentColor" strokeWidth="1" />
        <path d="M55 200h290M200 55v290M98 98l204 204M302 98 98 302" stroke="currentColor" strokeWidth="1" />
        <path d="M200 55 345 200 200 345 55 200Z" stroke="currentColor" strokeWidth="1.5" />
      </svg>
      <div className="section-shell">
        <div className="max-w-xl">
          <p className="text-sm font-medium text-gold">Explore our communities</p>
          <h2 className="mt-4 text-balance font-display text-4xl font-medium leading-tight text-navy sm:text-5xl">
            Four settings, one way of building.
          </h2>
          <p className="mt-5 text-[15px] leading-relaxed text-ink-soft">
            Every Mountain View Egypt community keeps the same low density and shared green
            space, wherever in Egypt it sits.
          </p>
        </div>

        <div className="mt-14 grid gap-7 sm:grid-cols-2 lg:grid-cols-4">
          {COMMUNITIES.map((c, i) => (
            <motion.article
              key={c.name}
              onMouseEnter={() => setTilted(i)}
              onMouseLeave={() => setTilted(null)}
              animate={{
                rotateX: tilted === i ? -3 : 0,
                rotateY: tilted === i ? 3 : 0,
                y: tilted === i ? -4 : 0,
              }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              style={{ transformPerspective: 800 }}
              className="group overflow-hidden rounded-xl2 border border-line bg-white shadow-soft"
            >
              <div className="h-40 w-full overflow-hidden">
                <img
                  src={c.image}
                  alt={`${c.name} community by Mountain View Egypt`}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
              </div>
              <div className="p-5">
                <h3 className="font-display text-xl font-medium text-navy">
                  {c.name}
                </h3>
                <p className="mt-1 flex items-center gap-1.5 text-xs font-medium text-gold">
                  <MapPin className="h-3.5 w-3.5" />
                  {c.city}
                </p>
                <p className="mt-3 text-sm leading-relaxed text-ink-soft">
                  {c.blurb}
                </p>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
