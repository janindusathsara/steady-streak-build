import { Link } from "@tanstack/react-router";
import { ChevronLeft } from "lucide-react";
import { Navbar } from "@/components/common/Navbar";
import { Footer } from "@/components/common/Footer";

export function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <article className="mx-auto max-w-3xl px-5 pt-10 pb-16">
        <Link to="/" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
          <ChevronLeft className="h-4 w-4" /> Back to Home
        </Link>
        <p className="mt-6 text-[11px] font-semibold uppercase tracking-wider text-primary">Legal</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">Privacy Policy</h1>
        <p className="mt-3 text-sm text-muted-foreground">Last updated: November 12, 2024</p>

        <div className="mt-10 space-y-8 text-base leading-relaxed text-foreground/85">
          <Section title="1. What We Collect">
            Account details you provide (name, email, phone, address), booking history, messages exchanged on the platform, and technical data like device type and IP address. Providers also share verification documents for review.
          </Section>
          <Section title="2. How We Use Your Information">
            To run the platform: matching you with providers, processing bookings and payments, sending booking confirmations and service updates, preventing fraud, and improving the product.
          </Section>
          <Section title="3. Sharing With Providers">
            When you book a service, we share the details the provider needs to complete the job — your name, address, contact number, and the problem description. We don't share payment details with providers.
          </Section>
          <Section title="4. Cookies & Analytics">
            We use cookies to keep you logged in and to understand how the platform is used. You can disable non-essential cookies in your browser settings; some features may stop working if you do.
          </Section>
          <Section title="5. Data Retention">
            We keep your account data while your account is active and for a reasonable period afterwards to handle disputes and comply with legal obligations. You can request deletion at any time.
          </Section>
          <Section title="6. Your Rights">
            You can access, correct, export, or delete your personal data from your profile settings, or by contacting us. We'll respond within a reasonable time.
          </Section>
          <Section title="7. Security">
            Passwords are hashed, traffic is encrypted in transit, and sensitive data is encrypted at rest. No system is perfectly secure — please use a strong, unique password and enable any extra security options we offer.
          </Section>
          <Section title="8. Changes to This Policy">
            If we make material changes to how we handle your data, we'll let you know through the app or by email before the changes take effect.
          </Section>
          <Section title="9. Contact">
            Privacy questions or requests? Email <a className="font-medium text-primary hover:underline" href="mailto:fixitnow@gmail.com">fixitnow@gmail.com</a>.
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
