import { Instagram, Facebook, Linkedin } from "lucide-react";
import logo from "../../image.png";

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
            <img
              src={logo}
              alt="Mountain View Egypt"
              className="h-10 w-auto"
            />
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-papyrus/55">
              Low-density villas and courtyard homes across Egypt's desert
              communities.
            </p>
          </div>

          <div className="flex gap-16">
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

            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wide text-papyrus/40">
                Follow
              </h4>
              <div className="mt-4 flex gap-3">
                <a
                  href="https://www.instagram.com/mountainview_egypt/"
                  aria-label="Instagram"
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-full border border-papyrus/15 p-2 text-papyrus/70 hover:text-papyrus"
                >
                  <Instagram className="h-4 w-4" />
                </a>
                <a
                  href="https://www.facebook.com/MountainViewEgypt"
                  aria-label="Facebook"
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-full border border-papyrus/15 p-2 text-papyrus/70 hover:text-papyrus"
                >
                  <Facebook className="h-4 w-4" />
                </a>
                <a
                  href="https://www.linkedin.com/company/mountainvieweg/"
                  aria-label="LinkedIn"
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-full border border-papyrus/15 p-2 text-papyrus/70 hover:text-papyrus"
                >
                  <Linkedin className="h-4 w-4" />
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-3 border-t border-papyrus/10 pt-6 text-xs text-papyrus/45 sm:flex-row sm:items-center sm:justify-between">
          <p>This is a model estimate, not an official property valuation.</p>
          <p>© {new Date().getFullYear()} Mountain View Egypt. Student project, not an official listing service.</p>
        </div>
      </div>
    </footer>
  );
}
