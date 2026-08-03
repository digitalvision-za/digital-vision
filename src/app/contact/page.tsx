import type { Metadata } from "next";
import { PublicShell } from "@/components/public-shell";
import { InquiryForm } from "@/components/inquiry-form";

export const metadata: Metadata = {
  title: "Start a project",
  description: "Tell Digital Visions what a clearer website needs to change for your business.",
};

export default function ContactPage() {
  return (
    <PublicShell>
      <section className="site-shell contact-layout">
        <div className="contact-aside">
          <p className="eyebrow">Start a project</p>
          <h1 className="display">Tell us what needs to change.</h1>
          <p>Whether you are starting from scratch, outgrowing a current site, or looking for support after launch, this is a good place to begin.</p>
          <p>Inquiries are saved to the Digital Visions owner dashboard. There are no automated email promises or hidden handoffs.</p>
        </div>
        <InquiryForm />
      </section>
    </PublicShell>
  );
}