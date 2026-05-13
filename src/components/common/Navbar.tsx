import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { Wrench, Menu, X } from "lucide-react";

export function Navbar() {
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
