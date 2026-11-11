import Image from "next/image";
import { ButtonLink, TextLink, ParticipationCTA } from "@/components/ui";
import { pageMetadata, site } from "@/lib/site";
import { workingAreas } from "@/content/site-content";

export const metadata = pageMetadata("Echo of Palestine | International Student Solidarity", "Discover the International Student Solidarity Movement for Palestine: a proposed framework for coordination, learning, and sustained collective action.", "/");

export default function Home() {
  return <>
    <section className="institutional-hero">
      <div className="hero-copy"><h1>From Solidarity<br />to <em>Sustained Action.</em></h1><p>Building a Global Infrastructure for Student Solidarity, Institutional Accountability, and Collective Action.</p><div className="actions"><ButtonLink href="/join-us">Join the Movement</ButtonLink><TextLink href="/vision-mission">Explore Our Vision</TextLink></div></div>
      <figure className="hero-photograph"><Image src="/images/conference-audience.webp" alt="Audience and media at the Echo of Palestine International Conference in Islamabad." fill sizes="(max-width: 800px) 100vw, 54vw" preload /><figcaption>Echo of Palestine International Conference<span>Islamabad · February 2025</span></figcaption></figure>
    </section>
    <div className="movement-identity"><div className="container"><p>{site.initiative}</p><a href="/vision-mission">Discover the initiative <span aria-hidden="true">↗</span></a></div></div>

    <section className="section"><div className="container editorial-grid intro-editorial"><h2>Solidarity is a beginning.<br /><em>Continuity is the work.</em></h2><div className="prose"><p className="lead">Echo of Palestine brings attention to the need for lasting international solidarity with the Palestinian people.</p><p>The present focus is a student initiative that looks beyond isolated moments of mobilization. It asks how campus organizing can preserve its knowledge, sustain its relationships, and influence institutional decisions over time.</p><TextLink href="/about">About Echo of Palestine</TextLink></div></div></section>

    <section className="section movement-feature"><div className="container feature-grid">
      <figure className="feature-photo"><Image src="/images/conference-panel.webp" alt="A panel discussion at the 2025 Echo of Palestine International Conference." width={720} height={481} sizes="(max-width: 800px) 100vw, 540px" /><figcaption>A forum for dialogue. Echo of Palestine, Islamabad, 2025.</figcaption></figure>
      <div className="feature-copy"><h2>{site.initiative}</h2><p className="lead">Independent organizations. A shared international framework.</p><p>The proposed movement aims to connect student organizations, unions, and campus campaigns across continents, turning fragmented initiatives into sustained collective action.</p><p>Its intended role is international coordination, strategic learning, leadership development, and institutional accountability.</p><TextLink href="/vision-mission">Read the vision and mission</TextLink></div>
    </div></section>

    <section className="section"><div className="container vision-preview"><div className="vision-heading"><h2>Connected across borders.<br /><em>Led with Palestinians.</em></h2><div className="principle-note">Organizational autonomy.<br />Meaningful Palestinian leadership.</div></div><div><p className="lead">A permanent movement for Palestinian freedom, justice, and self-determination, with meaningful Palestinian leadership at its heart.</p><p>Shared infrastructure should strengthen the organizations it connects. The vision preserves the autonomy of participating groups while creating space for cooperation and collective learning.</p><TextLink href="/vision-mission#our-vision">Explore the full vision</TextLink></div></div></section>

    <section className="section capacity-section"><div className="container"><div className="section-opening"><h2>Building lasting capacity</h2><p>The initiative’s intended areas of work connect the relationships, knowledge, and skills needed to sustain a movement.</p></div><div className="editorial-rows">{workingAreas.map(({ title, text }, index) => <div className="editorial-row" key={title}><span className="row-index" aria-hidden="true">{String(index + 1).padStart(2, "0")}</span><h3>{title}</h3><p>{text}</p></div>)}</div></div></section>

    <section className="section conference-story"><div className="container"><div className="story-heading"><h2>A Voice of the Voiceless</h2><TextLink href="/about#conference">Explore the conference</TextLink></div><figure className="conference-panorama"><Image src="/images/conference-gathering.webp" alt="Participants gathered at the Echo of Palestine International Conference on February 15, 2025." width={1600} height={1069} sizes="(max-width: 800px) 100vw, 1200px" /><figcaption>Echo of Palestine International Conference · Islamabad, Pakistan · February 15–16, 2025</figcaption></figure><div className="story-summary"><p className="lead">A conference that brought Palestinian rights and international solidarity into conversation.</p><div><p>The 2025 conference forms part of the wider context of Echo of Palestine. The student initiative presented here looks toward a sustained framework for cooperation.</p><TextLink href="/about">Our background and direction</TextLink></div></div></div></section>
    <ParticipationCTA />
  </>;
}
