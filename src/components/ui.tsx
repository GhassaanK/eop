import Link from "next/link";
import type { ReactNode } from "react";

export function Arrow({ diagonal = false }: { diagonal?: boolean }) {
  return <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d={diagonal ? "M6 18 18 6M6 6h12v12" : "M4 12h16m-6-6 6 6-6 6"} /></svg>;
}

export function ButtonLink({ href, children, secondary = false }: { href: string; children: ReactNode; secondary?: boolean }) {
  return <Link href={href} className={`button${secondary ? " button-secondary" : ""}`}>{children}<Arrow /></Link>;
}

export function TextLink({ href, children }: { href: string; children: ReactNode }) {
  return <Link className="text-link" href={href}>{children}<Arrow /></Link>;
}

export function PageIntro({ title, children }: { title: string; children: ReactNode }) {
  return <section className="page-intro"><div className="container intro-grid"><h1>{title}</h1><div className="intro-copy">{children}</div></div></section>;
}

export function ParticipationCTA({ title = "Give solidarity a lasting place." }: { title?: string }) {
  return <section className="section participation"><div className="container participation-grid"><h2>{title}</h2><div><p>Help shape the next chapter of international student solidarity for Palestine. Start with an expression of interest.</p><div className="actions"><ButtonLink href="/join-us">Join Us</ButtonLink><TextLink href="/vision-mission">Learn about the movement</TextLink></div></div></div></section>;
}
