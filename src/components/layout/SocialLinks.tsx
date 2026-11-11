import { site } from "@/lib/site";

const links = [
  { name: "Facebook", href: site.facebook, icon: "facebook", temporary: false },
  { name: "Instagram", href: site.instagram, icon: "instagram", temporary: true },
  { name: "WhatsApp", href: site.whatsapp, icon: "whatsapp", temporary: true },
  { name: "X", href: site.x, icon: "x", temporary: true },
] as const;

function SocialIcon({ name }: { name: typeof links[number]["icon"] }) {
  if (name === "facebook") return <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M13.5 21v-8.2h2.8l.4-3.2h-3.2v-2c0-.9.3-1.6 1.6-1.6h1.7V3.2a22 22 0 0 0-2.5-.2c-2.5 0-4.2 1.5-4.2 4.3v2.3H7.3v3.2h2.8V21z" /></svg>;
  if (name === "instagram") return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.4" cy="6.7" r="1" fill="currentColor" stroke="none" /></svg>;
  if (name === "whatsapp") return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M20.5 11.8a8.5 8.5 0 0 1-12.6 7.4L3 20.5l1.3-4.8a8.5 8.5 0 1 1 16.2-3.9Z" /><path d="m8 7.3 1.5 2.6-1 1a9 9 0 0 0 4.6 4.3l1-1.2 2.6 1.4c-.1 1.2-.9 2-2.1 2-3.7-.3-8-4.5-8.2-8.1 0-1 .7-1.8 1.6-2Z" /></svg>;
  return <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M18.9 2H22l-6.8 7.8L23.2 22H17l-4.9-7.4L5.6 22H2.4l7.4-8.5L.8 2h6.4l4.5 6.8L18.9 2Zm-1.1 18h1.7L6.2 3.9H4.4L17.8 20Z" /></svg>;
}

export default function SocialLinks() {
  return <nav className="social-links" aria-label="Social media">{links.map(({ name, href, icon, temporary }) => <a key={name} href={href} target="_blank" rel="noopener noreferrer" aria-label={`${name}${temporary ? " (temporary contact)" : " (official conference page)"}, opens in a new tab`} title={`${name}${temporary ? " (temporary contact)" : ""}`}><SocialIcon name={icon} /></a>)}</nav>;
}
