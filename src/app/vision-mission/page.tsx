import { PageIntro, ParticipationCTA } from "@/components/ui";
import { pageMetadata } from "@/lib/site";
import Image from "next/image";
import { vision, strategicFoundation, priorities } from "@/content/site-content";

export const metadata = pageMetadata("Vision & Mission | Echo of Palestine", "Read the full vision and strategic foundation for a permanent international student movement rooted in Palestinian leadership and organizational autonomy.", "/vision-mission");

export default function VisionMission() {
  return <>
    <PageIntro title="Vision & Mission"><p>Moving from disconnected initiatives toward lasting international coordination, with the knowledge and capacity to sustain collective action.</p></PageIntro>
    <section className="section" id="our-vision"><div className="container editorial-grid"><h2>Our Vision</h2><div className="prose vision-statement">{vision.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</div></div></section>
    <section className="section soft-section"><div className="container editorial-grid"><h2>Our Mission</h2><div className="prose"><p className="lead">To connect student organizations and campus initiatives internationally, and help turn shared purpose into sustained work.</p><p>In practical terms, this means enabling strategic learning, supporting leadership development, encouraging coordinated institutional engagement, and assessing the long-term effectiveness of collective initiatives.</p><p>These aims describe the practical purpose of the supplied vision and strategic foundation. They guide the proposed movement’s direction.</p></div></div></section>
    <section className="section"><div className="container editorial-grid"><div className="foundation-art"><h2>Our Strategic Foundation</h2><figure className="foundation-photo"><Image src="/images/conference-panel.webp" alt="Panel discussion at the 2025 Echo of Palestine conference in Islamabad." width={720} height={481} sizes="(max-width: 800px) calc(100vw - 40px), 520px" /><figcaption>Dialogue at the 2025 conference. The proposed movement builds toward continuing strategic exchange.</figcaption></figure></div><div className="prose">{strategicFoundation.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</div></div></section>
    <section className="section capacity-section"><div className="container"><div className="section-opening"><h2>Priorities for sustained action</h2><p>Six connected priorities describe the initiative’s intended work. They are a direction for development, rather than established programs.</p></div><div className="priority-grid">{priorities.map(({ title, text }) => <article key={title}><h3>{title}</h3><p>{text}</p></article>)}</div></div></section>
    <section className="section"><div className="container editorial-grid"><h2>Beyond a single<br /><em>moment of mobilization.</em></h2><div className="prose"><p className="lead">Durable capacity means that each generation of students can build on the knowledge and relationships of those before it.</p><p>The long-term direction is international cooperation that carries experience between campuses, keeps institutional engagement in view, and preserves organizational learning as students and leadership change.</p><p>Participating organizations would retain their autonomy. Meaningful Palestinian leadership remains central to the shared framework.</p></div></div></section>
    <ParticipationCTA title="Take part in the longer work." />
  </>;
}
