const QUICK_LINKS = [
  { label: "Home", href: "#home" },
  { label: "Communities", href: "#communities" },
  { label: "Estimate value", href: "#estimate" },
  { label: "About", href: "#why" },
];

export default function Footer() {
  return (
    <footer className="border-t border-papyrus/10 bg-navy pb-10 pt-16">
      <div className="section-shell">
        <div className="flex flex-col gap-10 sm:flex-row sm:justify-between">
          <div>
            <p className="font-display text-xl font-medium text-papyrus">
              House Price Predictor
            </p>
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-papyrus/55">
              Low-density villas and courtyard homes across Egypt's desert
              communities.
            </p>
          </div>

          <div>
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wide text-papyrus/40">
                Quick links
              </h4>
              <ul className="mt-4 flex flex-col gap-2.5">
                {QUICK_LINKS.map((l) => (
                  <li key={l.label}>
                    <a
                      href={l.href}
                      className="text-sm text-papyrus/65 hover:text-papyrus"
                    >
                      {l.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

          </div>
        </div>

        <div className="mt-14 flex flex-col gap-3 border-t border-papyrus/10 pt-6 text-xs text-papyrus/45 sm:flex-row sm:items-center sm:justify-between">
          <p>This is a model estimate, not an official property valuation.</p>
          <p>© {new Date().getFullYear()} House Price Predictor. Student project, not an official listing service.</p>
        </div>
      </div>
    </footer>
  );
}
