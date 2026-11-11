import Link from "next/link";
import Image from "next/image";
import { navigation, site } from "@/lib/site";
import { Arrow } from "@/components/ui";
import SocialLinks from "@/components/layout/SocialLinks";

export default function Footer() {
  return <footer className="site-footer"><div className="container">
    <div className="footer-main"><div><Link href="/" className="brand-lockup" aria-label="Echo of Palestine home"><Image src="/brand/eop-logo.webp" alt="EOP International Conference" width={400} height={400} className="official-logo" /><span className="brand-name">Echo of<span>Palestine</span></span></Link><p>A space for international student solidarity, strategic learning, and sustained collective action for Palestine.</p></div><nav aria-label="Footer navigation">{navigation.map(({ href, label }) => <Link key={href} href={href}>{label}</Link>)}</nav><div className="footer-social"><SocialLinks /><a href={site.facebook} target="_blank" rel="noopener noreferrer">Official conference<br />Facebook page <Arrow diagonal /></a><p>Follow the conference’s public record and updates.</p></div></div>
    <div className="footer-bottom"><p>© {new Date().getFullYear()} Echo of Palestine. All rights reserved.</p><p>For Palestinian freedom, justice, and self-determination.</p></div>
  </div></footer>;
}
