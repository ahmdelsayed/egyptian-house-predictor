import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Loader2, TriangleAlert } from "lucide-react";
import { Card, CardContent, CardHeader } from "./ui/Card.jsx";
import Select from "./ui/Select.jsx";
import Input from "./ui/Input.jsx";
import Button from "./ui/Button.jsx";

const API_BASE =
  import.meta.env.VITE_API_BASE ||
  (import.meta.env.PROD
    ? "https://ahmdelsayed.pythonanywhere.com/api"
    : "http://localhost:5000/api");

const EMPTY_FORM = {
  city: "",
  type: "",
  size_sqm: "",
  bedrooms: "",
  bathrooms: "",
};

function formatEGP(value) {
  return new Intl.NumberFormat("en-EG", {
    maximumFractionDigits: 0,
  }).format(value);
}

export default function EstimatorForm() {
  const [cities, setCities] = useState([]);
  const [types, setTypes] = useState([]);
  const [optionsError, setOptionsError] = useState("");

  const [form, setForm] = useState(EMPTY_FORM);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch(`${API_BASE}/options`)
      .then((res) => {
        if (!res.ok) throw new Error();
        return res.json();
      })
      .then((data) => {
        setCities(data.cities || []);
        setTypes(data.types || []);
      })
      .catch(() =>
        setOptionsError(
          "Can't reach the backend. Make sure the Flask server is running on port 5000."
        )
      );
  }, []);

  function handleChange(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setResult(null);
    setLoading(true);

    try {
      const res = await fetch(`${API_BASE}/predict`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Something went wrong. Please try again.");
      } else {
        setResult(data);
      }
    } catch {
      setError(
        "Can't reach the backend. Make sure the Flask server is running on port 5000."
      );
    } finally {
      setLoading(false);
    }
  }

  const isFormValid =
    form.city && form.type && form.size_sqm && form.bedrooms !== "" && form.bathrooms !== "";

  return (
    <section id="estimate" className="bg-navy py-24 sm:py-32">
      <div className="section-shell grid gap-12 lg:grid-cols-[0.85fr_1fr] lg:items-start">
        <div className="lg:sticky lg:top-28">
          <p className="text-sm font-medium text-gold-bright">
            Estimate your property value
          </p>
          <h2 className="mt-4 max-w-md text-balance font-display text-4xl font-medium leading-tight text-papyrus sm:text-5xl">
            A grounded number before you make an offer.
          </h2>
          <p className="mt-5 max-w-md text-[15px] leading-relaxed text-papyrus/70">
            Enter a few details and our model, trained on real Egyptian
            listings, returns a price estimate in seconds. It's a starting
            point for a conversation, not a substitute for a site visit.
          </p>
        </div>

        <Card className="w-full">
          <CardHeader>
            {optionsError && (
              <div className="mb-2 flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-[13px] leading-relaxed text-red-700">
                <TriangleAlert className="mt-0.5 h-4 w-4 shrink-0" />
                <span>{optionsError}</span>
              </div>
            )}
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <div className="flex flex-col gap-1.5">
                <label htmlFor="city" className="text-sm font-medium text-ink-soft">
                  Location
                </label>
                <Select
                  id="city"
                  value={form.city}
                  onChange={(e) => handleChange("city", e.target.value)}
                  disabled={!cities.length}
                >
                  <option value="" disabled>
                    Select a governorate
                  </option>
                  {cities.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </Select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label htmlFor="type" className="text-sm font-medium text-ink-soft">
                  Property type
                </label>
                <Select
                  id="type"
                  value={form.type}
                  onChange={(e) => handleChange("type", e.target.value)}
                  disabled={!types.length}
                >
                  <option value="" disabled>
                    Select a type
                  </option>
                  {types.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </Select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label htmlFor="size" className="text-sm font-medium text-ink-soft">
                  Area (sqm)
                </label>
                <Input
                  id="size"
                  type="number"
                  min="1"
                  placeholder="e.g. 150"
                  value={form.size_sqm}
                  onChange={(e) => handleChange("size_sqm", e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="bedrooms" className="text-sm font-medium text-ink-soft">
                    Bedrooms
                  </label>
                  <Input
                    id="bedrooms"
                    type="number"
                    min="0"
                    placeholder="e.g. 3"
                    value={form.bedrooms}
                    onChange={(e) => handleChange("bedrooms", e.target.value)}
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="bathrooms" className="text-sm font-medium text-ink-soft">
                    Bathrooms
                  </label>
                  <Input
                    id="bathrooms"
                    type="number"
                    min="0"
                    placeholder="e.g. 2"
                    value={form.bathrooms}
                    onChange={(e) => handleChange("bathrooms", e.target.value)}
                  />
                </div>
              </div>

              <Button
                type="submit"
                disabled={!isFormValid || loading}
                className="mt-2 w-full"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Estimating…
                  </>
                ) : (
                  "Predict price"
                )}
              </Button>
            </form>

            {error && (
              <div className="mt-5 flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-[13px] leading-relaxed text-red-700">
                <TriangleAlert className="mt-0.5 h-4 w-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <AnimatePresence>
              {result && (
                <motion.div
                  initial={{ opacity: 0, y: 10, height: 0 }}
                  animate={{ opacity: 1, y: 0, height: "auto" }}
                  exit={{ opacity: 0, y: -6, height: 0 }}
                  transition={{ duration: 0.28, ease: "easeOut" }}
                  className="mt-6 overflow-hidden rounded-xl border border-gold bg-gradient-to-b from-gold/10 to-transparent px-6 py-5"
                >
                  <span className="block text-[13px] text-ink-soft">
                    Estimated listing price
                  </span>
                  <span className="mt-1 block font-display text-4xl font-medium text-navy">
                    {formatEGP(result.predicted_price)} {result.currency}
                  </span>
                  <span className="mt-2 block text-xs text-ink-soft">
                    This is a model estimate, not an official property valuation.
                  </span>
                </motion.div>
              )}
            </AnimatePresence>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
