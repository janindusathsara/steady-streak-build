import { Link } from "@tanstack/react-router";
import { ChevronLeft } from "lucide-react";
import { Navbar } from "@/components/common/Navbar";
import { Footer } from "@/components/common/Footer";

export function TermsPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <article className="mx-auto max-w-3xl px-5 pt-10 pb-16">
        <Link to="/" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
          <ChevronLeft className="h-4 w-4" /> Back to Home
        </Link>
        <p className="mt-6 text-[11px] font-semibold uppercase tracking-wider text-primary">Legal</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">Terms of Service</h1>
        <p className="mt-3 text-sm text-muted-foreground">Last updated: November 12, 2024</p>

        <div className="mt-10 space-y-8 text-base leading-relaxed text-foreground/85">
          <Section title="1. Acceptance of Terms">
            By creating an account or booking a service on FixItNow, you agree to these Terms of Service and to our Privacy Policy. If you do not agree, please do not use the platform.
          </Section>
          <Section title="2. The FixItNow Platform">
            FixItNow connects homeowners with independent service providers. We are a technology platform — the providers you book are independent professionals responsible for the services they deliver.
          </Section>
          <Section title="3. Accounts & Eligibility">
            You must be at least 18 years old to create an account. You are responsible for keeping your login credentials secure and for any activity on your account. Provide accurate information when signing up and keep it up to date.
          </Section>
          <Section title="4. Bookings & Payments">
            When you book a service, the total amount is held in escrow until the work is completed and confirmed. Cancellation windows, refunds, and dispute resolution are handled per the booking policy shown at checkout.
          </Section>
          <Section title="5. Provider Responsibilities">
            Service providers warrant that they are qualified, properly licensed where required, and will perform work in a safe and professional manner. Providers carry their own insurance for their tools and operations.
          </Section>
          <Section title="6. Acceptable Use">
            You agree not to misuse the platform — no harassment, no fraudulent bookings, no attempts to bypass the platform to avoid fees, and no posting of unlawful or harmful content.
          </Section>
          <Section title="7. Liability">
            FixItNow's liability is limited to the amount paid for the specific booking giving rise to a claim. We are not responsible for losses arising from the independent acts of providers beyond the protections of the booking guarantee.
          </Section>
          <Section title="8. Changes to These Terms">
            We may update these terms from time to time. Material changes will be communicated through the app or by email. Continued use after changes means you accept the updated terms.
          </Section>
          <Section title="9. Contact">
            Questions about these terms? Email <a className="font-medium text-primary hover:underline" href="mailto:fixitnow@gmail.com">fixitnow@gmail.com</a>.
          </Section>
        </div>
      </article>
      <Footer />
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="text-xl font-bold tracking-tight">{title}</h2>
      <p className="mt-3">{children}</p>
    </section>
  );
}
