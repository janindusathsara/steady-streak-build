import { Link } from "@tanstack/react-router";
import { Wrench, Phone, Mail, Printer, MapPin } from "lucide-react";

export function SiteHeader() {
  return (
    <header className="sticky top-4 z-30 mx-auto max-w-6xl px-4">
      <nav className="flex h-16 items-center justify-between rounded-2xl border border-border/60 bg-card/90 px-5 backdrop-blur shadow-sm">
        <Link to="/" className="flex items-center gap-2">
          <Wrench className="h-6 w-6 text-primary" strokeWidth={2.5} />
          <span className="text-lg font-bold tracking-tight">FixItNow</span>
        </Link>
        <div className="hidden gap-8 text-sm text-muted-foreground sm:flex">
          <Link to="/" className="hover:text-foreground transition-colors" activeOptions={{ exact: true }} activeProps={{ className: "text-foreground font-semibold" }}>Home</Link>
          <Link to="/" hash="services" className="hover:text-foreground transition-colors">Services</Link>
          <Link to="/news" className="hover:text-foreground transition-colors" activeProps={{ className: "text-foreground font-semibold" }}>News</Link>
          <Link to="/about" className="hover:text-foreground transition-colors" activeProps={{ className: "text-foreground font-semibold" }}>About Us</Link>
        </div>
        <div className="flex items-center gap-2">
          <Link to="/login" className="rounded-full px-4 py-2 text-sm font-medium text-foreground hover:bg-muted transition-colors">Sign In</Link>
          <Link to="/login" className="rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-sm hover:opacity-90 transition-opacity">Sign Up</Link>
        </div>
      </nav>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="bg-foreground text-background">
      <div className="mx-auto max-w-6xl px-5 py-14">
        <div className="grid gap-10 md:grid-cols-3">
          <div>
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
              <li className="flex items-start gap-2"><Phone className="mt-0.5 h-4 w-4 text-primary" />0771234567 · 0767654321</li>
              <li className="flex items-start gap-2"><Mail className="mt-0.5 h-4 w-4 text-primary" />fixitnow@gmail.com</li>
              <li className="flex items-start gap-2"><Printer className="mt-0.5 h-4 w-4 text-primary" />Fax: +94761234567</li>
              <li className="flex items-start gap-2"><MapPin className="mt-0.5 h-4 w-4 text-primary" />University of Moratuwa, Sri Lanka</li>
            </ul>
          </div>
        </div>
        <div className="mt-12 flex flex-col items-start justify-between gap-3 border-t border-background/10 pt-6 text-xs text-background/50 sm:flex-row sm:items-center">
          <p>© {new Date().getFullYear()} FixItNow. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-background transition-colors">Terms and Conditions</a>
            <a href="#" className="hover:text-background transition-colors">Privacy and Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
