import { MarketingNav } from "@/components/marketing-nav";
import { Footer } from "@/components/footer";

export const metadata = { title: "Privacy Policy" };

export default function PrivacyPage() {
  return (
    <>
      <MarketingNav />
      <main className="mx-auto max-w-3xl px-6 py-16">
        <h1 className="mb-8 text-4xl font-black text-slate-900">Privacy Policy</h1>
        <p className="mb-4 text-sm text-slate-400">Last updated: May 2026</p>

        <div className="space-y-8 text-sm leading-relaxed text-slate-600">
          <section>
            <h2 className="mb-3 text-lg font-bold text-slate-900">What we collect</h2>
            <p>We collect your email address and name when you sign up via Clerk. If you complete onboarding, we also store your professional role, industry, topic preferences, and voice preference. Premium users may optionally provide a LinkedIn URL and professional context.</p>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-bold text-slate-900">How we use it</h2>
            <p>Your profile data is used exclusively to generate your personalized daily briefing. We do not sell your data to third parties, use it for advertising, or share it with other companies. Stripe handles all payment data — we only store a Stripe customer ID.</p>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-bold text-slate-900">Third-party services</h2>
            <ul className="list-disc space-y-1 pl-5">
              <li><strong>Clerk</strong> — authentication. Your password and OAuth tokens are managed by Clerk and never touch our servers.</li>
              <li><strong>Stripe</strong> — payments. Card details are never stored on our servers.</li>
              <li><strong>Anthropic (Claude)</strong> — AI content generation. Briefing content is generated using Claude. Your profile data may be sent to Claude's API to personalize briefings.</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-bold text-slate-900">Data retention</h2>
            <p>You can delete your account at any time from Settings. This removes all stored profile data and cancels your subscription. Stripe may retain payment records per their own retention policies.</p>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-bold text-slate-900">Contact</h2>
            <p>Questions? Email us at privacy@omgskill.ai</p>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
