import { MarketingNav } from "@/components/marketing-nav";
import { Footer } from "@/components/footer";

export const metadata = { title: "Terms of Service" };

export default function TermsPage() {
  return (
    <>
      <MarketingNav />
      <main className="mx-auto max-w-3xl px-6 py-16">
        <h1 className="mb-8 text-4xl font-black text-slate-900">Terms of Service</h1>
        <p className="mb-4 text-sm text-slate-400">Last updated: May 2026</p>

        <div className="space-y-8 text-sm leading-relaxed text-slate-600">
          <section>
            <h2 className="mb-3 text-lg font-bold text-slate-900">Service</h2>
            <p>omgskill.ai provides a daily AI intelligence briefing service. Free accounts receive access to 3 signals per day. Pro and Premium accounts unlock additional content as described on the pricing page.</p>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-bold text-slate-900">Subscriptions</h2>
            <p>Paid plans are billed monthly or annually via Stripe. You can cancel at any time from Settings. Cancellation takes effect at the end of the current billing period — there are no partial refunds.</p>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-bold text-slate-900">Content</h2>
            <p>Briefing content is AI-generated based on publicly available news sources. It is provided for informational purposes only and should not be treated as professional, legal, or financial advice. We make no guarantees about accuracy or completeness.</p>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-bold text-slate-900">Acceptable use</h2>
            <p>You may not share your account, resell access, or use our service to train competing AI models. Briefing content is for personal and professional use — commercial redistribution requires written permission.</p>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-bold text-slate-900">Liability</h2>
            <p>omgskill.ai is provided "as is" without warranty of any kind. We are not liable for any decisions made based on briefing content. Our maximum liability is the amount you paid in the 30 days prior to any claim.</p>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-bold text-slate-900">Contact</h2>
            <p>Questions? Email us at hello@omgskill.ai</p>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
