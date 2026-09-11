import { useEffect, useState } from "react";
import { Phone, Menu, X } from "lucide-react";
import Button from "./ui/Button.jsx";
import logo from "../../image.png";

const NAV_LINKS = [
  { label: "Home", href: "#home" },
  { label: "Communities", href: "#communities" },
  { label: "About", href: "#why" },
  { label: "Contact", href: "#estimate" },
];

function Wordmark() {
  return (
    <a href="#home" aria-label="Mountain View Egypt home">
      <img
        src={logo}
        alt="Mountain View Egypt"
        className="h-10 w-auto"
      />
    </a>
  );
}

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 12);
    }
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 transition-colors duration-300 ${
        scrolled ? "bg-navy/90 backdrop-blur-md shadow-soft" : "bg-transparent"
      }`}
    >
      <nav className="section-shell flex h-20 items-center justify-between">
        <Wordmark />

        <div className="hidden items-center gap-9 md:flex">
          {NAV_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-sm font-medium text-papyrus/80 transition-colors hover:text-papyrus"
            >
              {link.label}
            </a>
          ))}
        </div>

        <div className="hidden md:block">
          <Button as="a" href="tel:19201" variant="gold" size="sm">
            <Phone className="h-4 w-4" />
            19201
          </Button>
        </div>

        <button
          type="button"
          className="text-papyrus md:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </nav>

      {open && (
        <div className="border-t border-papyrus/10 bg-navy px-6 py-6 md:hidden">
          <div className="flex flex-col gap-5">
            {NAV_LINKS.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setOpen(false)}
                className="text-base font-medium text-papyrus/85"
              >
                {link.label}
              </a>
            ))}
            <a
              href="tel:19201"
              className="flex items-center gap-2 text-base font-semibold text-gold-bright"
            >
              <Phone className="h-4 w-4" />
              19201
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
