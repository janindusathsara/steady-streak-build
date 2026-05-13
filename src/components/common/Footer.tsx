import { Link } from "@tanstack/react-router";
import { Wrench, Phone, Mail, Printer, MapPin } from "lucide-react";

export function Footer() {
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
