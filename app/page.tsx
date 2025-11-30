"use client";

import {
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
  type DragEvent,
  type HTMLInputTypeAttribute,
} from "react";

type Currency = "USD" | "EUR" | "GBP";

type InvoiceForm = {
  sender: string;
  client: string;
  service: string;
  price: string;
  invoiceNo: string;
  issueDate: string;
  dueDate: string;
  notes: string;
  currency: Currency;
};

const currencyOptions: Currency[] = ["USD", "EUR", "GBP"];

const formatMoney = (value: string, currency: Currency) => {
  const amount = Number.parseFloat(value || "0");
  if (Number.isNaN(amount)) return value || "";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
  }).format(amount);
};

export default function Home() {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [logo, setLogo] = useState<string | null>(null);
  const [logoName, setLogoName] = useState<string>("");
  const [logoError, setLogoError] = useState<string>("");
  const [form, setForm] = useState<InvoiceForm>({
    sender: "Bright Studio",
    client: "Client Name",
    service: "Product design sprint and prototype",
    price: "1200",
    invoiceNo: "INV-2025-001",
    issueDate: new Date().toISOString().slice(0, 10),
    dueDate: "",
    notes: "Payment is due within 14 days. Thank you for your trust.",
    currency: "USD",
  });

  const formattedPrice = useMemo(
    () => formatMoney(form.price, form.currency),
    [form.price, form.currency],
  );

  const handleFile = (file: File) => {
    if (!file.type.startsWith("image/")) {
      setLogoError("Please upload an image file (PNG, JPG, SVG).");
      return;
    }
    setLogoError("");
    setLogo(URL.createObjectURL(file));
    setLogoName(file.name);
  };

  const handleDrop = (event: DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    const file = event.dataTransfer.files?.[0];
    if (file) handleFile(file);
  };

  const handleInput =
    (key: keyof InvoiceForm) =>
    (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      setForm((current) => ({ ...current, [key]: event.target.value }));
    };

  const clearLogo = () => {
    setLogo(null);
    setLogoName("");
    setLogoError("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 text-slate-50">
      <main className="mx-auto flex max-w-5xl flex-col gap-10 px-6 pb-16 pt-10">
        <header className="flex flex-col gap-3">
          <p className="text-sm font-medium uppercase tracking-[0.3em] text-slate-400">
            Instant Invoice
          </p>
          <h1 className="text-3xl font-semibold leading-tight text-white sm:text-4xl">
            Drop your logo, add a service and price, and ship a polished invoice in seconds.
          </h1>
          <p className="max-w-2xl text-base text-slate-300">
            Live preview updates as you type. Export-ready layout that looks sharp on screens and
            print.
          </p>
        </header>

        <section className="grid grid-cols-1 gap-8 xl:grid-cols-5">
          <div className="space-y-6 rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl shadow-black/30 backdrop-blur xl:col-span-2">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-white">Invoice Details</h2>
              <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs uppercase tracking-wide text-slate-300">
                Generator
              </span>
            </div>

            <div className="space-y-4">
              <label
                htmlFor="logo"
                onDrop={handleDrop}
                onDragOver={(event) => event.preventDefault()}
                className="group relative flex cursor-pointer items-center gap-4 rounded-2xl border border-dashed border-slate-500/60 bg-slate-900/40 px-4 py-5 transition hover:border-emerald-400/80 hover:bg-slate-900/60"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 text-slate-950 shadow-lg shadow-emerald-500/30">
                  ⬆
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-semibold text-white">Drop or upload your logo</span>
                  <span className="text-xs text-slate-400">
                    PNG, JPG, SVG up to 5 MB. Drag & drop or click to browse.
                  </span>
                  {logoName && <span className="mt-1 text-xs text-emerald-200">{logoName}</span>}
                  {logoError && <span className="mt-1 text-xs text-red-300">{logoError}</span>}
                </div>
                <input
                  ref={fileInputRef}
                  id="logo"
                  type="file"
                  accept="image/*"
                  className="sr-only"
                  onChange={(event) => {
                    const file = event.target.files?.[0];
                    if (file) handleFile(file);
                  }}
                />
                {logo && (
                  <button
                    type="button"
                    onClick={(event) => {
                      event.preventDefault();
                      clearLogo();
                      fileInputRef.current?.value && (fileInputRef.current.value = "");
                    }}
                    className="absolute right-3 top-3 rounded-full bg-white/10 px-3 py-1 text-xs text-slate-200 transition hover:bg-white/20"
                  >
                    Clear
                  </button>
                )}
              </label>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Field
                  label="Your name or company"
                  value={form.sender}
                  onChange={handleInput("sender")}
                  placeholder="Acme Studio"
                />
                <Field
                  label="Client"
                  value={form.client}
                  onChange={handleInput("client")}
                  placeholder="Client Name"
                />
                <Field
                  label="Invoice #"
                  value={form.invoiceNo}
                  onChange={handleInput("invoiceNo")}
                  placeholder="INV-2025-001"
                />
                <div className="flex flex-col gap-2">
                  <label className="text-sm text-slate-200">Currency</label>
                  <select
                    value={form.currency}
                    onChange={handleInput("currency")}
                    className="w-full rounded-xl border border-white/10 bg-slate-900/60 px-3 py-2 text-sm text-white outline-none ring-emerald-400/60 focus:ring-2"
                  >
                    {currencyOptions.map((option) => (
                      <option key={option} value={option} className="bg-slate-900">
                        {option}
                      </option>
                    ))}
                  </select>
                </div>
                <Field
                  label="Issue date"
                  type="date"
                  value={form.issueDate}
                  onChange={handleInput("issueDate")}
                />
                <Field
                  label="Due date"
                  type="date"
                  value={form.dueDate}
                  onChange={handleInput("dueDate")}
                />
              </div>

              <Field
                label="Service provided"
                value={form.service}
                onChange={handleInput("service")}
                placeholder="UI/UX design sprint"
              />

              <Field
                label="Price"
                type="number"
                value={form.price}
                onChange={handleInput("price")}
                placeholder="1200"
              />

              <div className="flex flex-col gap-2">
                <label className="text-sm text-slate-200">Notes</label>
                <textarea
                  value={form.notes}
                  onChange={handleInput("notes")}
                  rows={3}
                  placeholder="Payment is due within 14 days. Thank you for your business."
                  className="w-full rounded-xl border border-white/10 bg-slate-900/60 px-3 py-2 text-sm text-white outline-none ring-emerald-400/60 focus:ring-2"
                />
              </div>

              <button
                type="button"
                onClick={() => {
                  setLogoError("");
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-400 to-emerald-500 px-4 py-3 text-sm font-semibold uppercase tracking-wide text-slate-950 shadow-lg shadow-emerald-500/30 transition hover:from-emerald-300 hover:to-emerald-500"
              >
                Generate Invoice
              </button>
            </div>
          </div>

          <div className="relative rounded-3xl border border-white/10 bg-white/10 p-6 shadow-2xl shadow-black/30 backdrop-blur xl:col-span-3">
            <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_20%_20%,rgba(74,222,128,0.18),transparent_35%),radial-gradient(circle_at_80%_0%,rgba(59,130,246,0.14),transparent_30%),radial-gradient(circle_at_90%_80%,rgba(244,114,182,0.12),transparent_28%)]" />
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 shadow-lg shadow-emerald-500/30">
                  {logo ? (
                    <img
                      src={logo}
                      alt="Logo preview"
                      className="h-12 w-12 rounded-xl object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-lg font-semibold text-slate-900">
                      {form.sender.slice(0, 2).toUpperCase()}
                    </div>
                  )}
                </div>
                <div className="flex flex-col">
                  <span className="text-sm uppercase tracking-[0.2em] text-slate-300">Invoice</span>
                  <span className="text-lg font-semibold text-white">{form.sender}</span>
                </div>
              </div>
              <div className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-200">
                {form.currency}
              </div>
            </div>

            <div className="mt-8 grid grid-cols-1 gap-4 rounded-2xl border border-white/10 bg-slate-900/60 p-5 sm:grid-cols-2">
              <div className="space-y-1">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Invoice #</p>
                <p className="text-base font-semibold text-white">{form.invoiceNo || "TBD"}</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Issue Date</p>
                <p className="text-base font-semibold text-white">
                  {form.issueDate || "Not set"}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Due Date</p>
                <p className="text-base font-semibold text-white">
                  {form.dueDate || "Flexible"}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Bill To</p>
                <p className="text-base font-semibold text-white">{form.client}</p>
              </div>
            </div>

            <div className="mt-6 rounded-2xl border border-white/5 bg-white/5 p-4 shadow-inner shadow-black/30">
              <div className="flex items-center justify-between border-b border-white/5 pb-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Service</p>
                  <p className="text-lg font-semibold text-white">{form.service}</p>
                </div>
                <p className="text-lg font-semibold text-emerald-200">{formattedPrice}</p>
              </div>
              <div className="mt-4 flex items-center justify-between">
                <p className="text-sm text-slate-300">Total</p>
                <p className="text-2xl font-bold text-white">{formattedPrice}</p>
              </div>
            </div>

            <div className="mt-6 rounded-2xl border border-white/5 bg-slate-900/50 p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Notes</p>
              <p className="mt-2 text-sm leading-relaxed text-slate-200">{form.notes}</p>
            </div>

            <div className="mt-6 flex flex-wrap gap-3 text-xs text-slate-300">
              <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 uppercase tracking-[0.2em]">
                Instant Preview
              </span>
              <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 uppercase tracking-[0.2em]">
                Print Ready
              </span>
              <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 uppercase tracking-[0.2em]">
                Shareable
              </span>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

type FieldProps = {
  label: string;
  value: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  type?: HTMLInputTypeAttribute;
};

function Field({ label, value, onChange, placeholder, type = "text" }: FieldProps) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm text-slate-200">{label}</label>
      <input
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        type={type}
        className="w-full rounded-xl border border-white/10 bg-slate-900/60 px-3 py-2 text-sm text-white outline-none ring-emerald-400/60 focus:ring-2"
      />
    </div>
  );
}
