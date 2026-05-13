import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { Wrench, Phone, Mail, Printer, MapPin, Menu, X } from "lucide-react";

export function SiteHeader() {
  const [open, setOpen] = useState(false);

  const navLinks = (
    <>
      <Link to="/" onClick={() => setOpen(false)} className="hover:text-foreground transition-colors" activeOptions={{ exact: true }} activeProps={{ className: "text-foreground font-semibold" }}>Home</Link>
      <Link to="/" hash="services" onClick={() => setOpen(false)} className="hover:text-foreground transition-colors">Services</Link>
      <Link to="/news" onClick={() => setOpen(false)} className="hover:text-foreground transition-colors" activeProps={{ className: "text-foreground font-semibold" }}>News</Link>
      <Link to="/about" onClick={() => setOpen(false)} className="hover:text-foreground transition-colors" activeProps={{ className: "text-foreground font-semibold" }}>About Us</Link>
    </>
  );

  return (
    <header className="sticky top-2 z-30 mx-auto w-full max-w-6xl px-3 sm:top-4 sm:px-4">
      <nav className="flex h-14 items-center justify-between rounded-2xl border border-border/60 bg-card/90 px-3 backdrop-blur shadow-sm sm:h-16 sm:px-5">
        <Link to="/" className="flex items-center gap-2" onClick={() => setOpen(false)}>
          <Wrench className="h-5 w-5 text-primary sm:h-6 sm:w-6" strokeWidth={2.5} />
          <span className="text-base font-bold tracking-tight sm:text-lg">FixItNow</span>
        </Link>

        <div className="hidden gap-6 text-sm text-muted-foreground md:flex lg:gap-8">
          {navLinks}
        </div>

        <div className="hidden items-center gap-2 md:flex">
          <Link to="/login" className="rounded-full px-3 py-2 text-sm font-medium text-foreground hover:bg-muted transition-colors lg:px-4">Sign In</Link>
          <Link to="/login" className="rounded-full bg-primary px-3 py-2 text-sm font-semibold text-primary-foreground shadow-sm hover:opacity-90 transition-opacity lg:px-4">Sign Up</Link>
        </div>

        <button
          type="button"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border/60 text-foreground hover:bg-muted transition-colors md:hidden"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </nav>

      {open && (
        <div className="mt-2 rounded-2xl border border-border/60 bg-card/95 p-4 shadow-md backdrop-blur md:hidden">
          <div className="flex flex-col gap-3 text-sm text-muted-foreground">
            {navLinks}
          </div>
          <div className="mt-4 grid grid-cols-2 gap-2">
            <Link to="/login" onClick={() => setOpen(false)} className="rounded-full border border-border px-4 py-2 text-center text-sm font-medium text-foreground hover:bg-muted transition-colors">Sign In</Link>
            <Link to="/login" onClick={() => setOpen(false)} className="rounded-full bg-primary px-4 py-2 text-center text-sm font-semibold text-primary-foreground shadow-sm hover:opacity-90 transition-opacity">Sign Up</Link>
          </div>
        </div>
      )}
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="bg-foreground text-background">
      <div className="mx-auto max-w-6xl px-5 py-12 sm:py-14">
        <div className="grid gap-10 sm:grid-cols-2 md:grid-cols-3">
          <div className="sm:col-span-2 md:col-span-1">
            <div className="flex items-center gap-2">
              <Wrench className="h-7 w-7 text-primary" strokeWidth={2.5} />
              <span className="text-2xl font-bold">FixItNow</span>
            </div>
            <p className="mt-4 max-w-xs text-sm text-background/60">
              Trusted home service professionals, on demand.
            </p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-background/50">Quick Links</p>
            <ul className="mt-4 space-y-2 text-sm">
              <li><Link to="/" className="hover:text-primary transition-colors">Home</Link></li>
              <li><Link to="/about" className="hover:text-primary transition-colors">About Us</Link></li>
              <li><Link to="/" hash="services" className="hover:text-primary transition-colors">Services</Link></li>
              <li><Link to="/news" className="hover:text-primary transition-colors">News</Link></li>
              <li><a href="#" className="hover:text-primary transition-colors">Rate Us</a></li>
            </ul>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-background/50">Contact Us</p>
            <ul className="mt-4 space-y-2.5 text-sm text-background/80">
              <li className="flex items-start gap-2"><Phone className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" /><span className="break-words">0771234567 · 0767654321</span></li>
              <li className="flex items-start gap-2"><Mail className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" /><span className="break-all">fixitnow@gmail.com</span></li>
              <li className="flex items-start gap-2"><Printer className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" /><span className="break-all">Fax: +94761234567</span></li>
              <li className="flex items-start gap-2"><MapPin className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" />University of Moratuwa, Sri Lanka</li>
            </ul>
          </div>
        </div>
        <div className="mt-10 flex flex-col items-start justify-between gap-3 border-t border-background/10 pt-6 text-xs text-background/50 sm:flex-row sm:items-center">
          <p>© {new Date().getFullYear()} FixItNow. All rights reserved.</p>
          <div className="flex flex-wrap gap-x-6 gap-y-2">
            <a href="#" className="hover:text-background transition-colors">Terms and Conditions</a>
            <a href="#" className="hover:text-background transition-colors">Privacy and Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
