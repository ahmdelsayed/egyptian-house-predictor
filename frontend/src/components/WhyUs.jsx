import { Sparkles, Database, Zap } from "lucide-react";

const POINTS = [
  {
    icon: Sparkles,
    title: "AI-powered pricing",
    body: "A Random Forest model weighs location, size and room count the way a local agent would.",
  },
  {
    icon: Database,
    title: "Trained on real listings",
    body: "Built from actual Egyptian real-estate data, not generic international benchmarks.",
  },
  {
    icon: Zap,
    title: "Instant results",
    body: "No forms to submit and wait on. Enter the details and get a number back immediately.",
  },
];

export default function WhyUs() {
  return (
    <section id="why" className="bg-navy py-24 sm:py-28">
      <div className="section-shell">
        <p className="text-sm font-medium text-gold-bright">Why estimate with us</p>
        <h2 className="mt-4 max-w-lg text-balance font-display text-3xl font-medium leading-tight text-papyrus sm:text-4xl">
          A quick, honest number to work from.
        </h2>

        <div className="mt-14 grid gap-8 sm:grid-cols-3">
          {POINTS.map(({ icon: Icon, title, body }) => (
            <div key={title} className="border-t border-papyrus/15 pt-6">
              <Icon className="h-6 w-6 text-gold-bright" strokeWidth={1.6} />
              <h3 className="mt-4 font-display text-xl font-medium text-papyrus">
                {title}
              </h3>
              <p className="mt-2 text-[15px] leading-relaxed text-papyrus/65">
                {body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
