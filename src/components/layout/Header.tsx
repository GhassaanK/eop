"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useRef, useState } from "react";
import { navigation } from "@/lib/site";
import { Arrow } from "@/components/ui";

export default function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const toggle = useRef<HTMLButtonElement>(null);
  function close(restoreFocus = false) {
    setOpen(false);
    if (restoreFocus) toggle.current?.focus();
  }
  return <header className="site-header" onKeyDown={(event) => { if (event.key === "Escape" && open) close(true); }} onBlur={(event) => { if (!event.currentTarget.contains(event.relatedTarget)) close(); }}>
    <div className="container header-inner">
      <Link href="/" className="brand-lockup" aria-label="Echo of Palestine home" onClick={() => close()}><Image src="/brand/eop-logo.webp" alt="EOP International Conference" width={400} height={400} className="official-logo" /><span className="brand-name">Echo of<span>Palestine</span></span></Link>
      <button ref={toggle} type="button" className="menu-toggle" aria-expanded={open} aria-controls="primary-navigation" onClick={() => setOpen(!open)}>{open ? "Close" : "Menu"}<span className={`menu-icon${open ? " is-open" : ""}`} aria-hidden="true"><i /><i /></span></button>
      <nav id="primary-navigation" className={`primary-navigation${open ? " is-open" : ""}`} aria-label="Main navigation">
        {navigation.map(({ href, label }) => <Link key={href} href={href} aria-current={pathname === href ? "page" : undefined} className={href === "/join-us" ? "nav-join" : "nav-link"} onClick={() => close()}>{label}{href === "/join-us" && <Arrow />}</Link>)}
      </nav>
    </div>
  </header>;
}
