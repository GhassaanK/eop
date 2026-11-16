import Image from "next/image";
import TeamSection from "@/components/TeamSection";
import { ButtonLink, TextLink, ParticipationCTA } from "@/components/ui";
import { pageMetadata, site } from "@/lib/site";
import { workingAreas } from "@/content/site-content";

export const metadata = pageMetadata("Echo of Palestine | International Student Solidarity", "Discover the International Student Solidarity Movement for Palestine: a proposed framework for coordination, learning, and sustained collective action.", "/");

export default function Home() {
  return <>
    <section className="institutional-hero">
      <div className="container hero-content"><div className="hero-copy">
        <h1>Global Student Solidarity <em>For Palestine</em></h1>
        <p>Building a Global Infrastructure for Student Solidarity, Institutional Accountability, and Collective Action.</p>
        <div className="actions"><ButtonLink href="/join-us">Join the Movement</ButtonLink><TextLink href="/vision-mission">Explore Our Vision</TextLink></div>
      </div></div>
      <figure className="hero-photograph">
        <Image src="/images/malaysia-audience.webp" alt="Participants listening at the Echo of Palestine conference in Kelantan, Malaysia." fill sizes="100vw" preload />
        <figcaption>Echo of Palestine conference<span>Kelantan, Malaysia · June 2025</span></figcaption>
      </figure>
    </section>

    <section className="section movement-feature home-introduction" aria-labelledby="movement-title">
      <div className="container feature-grid">
        <figure className="feature-photo">
          <Image src="/images/supplied-student-gathering.webp" alt="Students gathered for a solidarity event, with Palestinian flags visible among the audience." width={1068} height={713} sizes="(max-width: 800px) 100vw, 540px" />
          <figcaption>Student solidarity. Photograph from the Echo of Palestine collection.</figcaption>
        </figure>
        <div className="feature-copy">
          <h2 id="movement-title">Solidarity is a beginning.<br /><em>Continuity is the work.</em></h2>
          <p className="lead">{site.initiative}</p>
          <p>Echo of Palestine brings attention to the need for lasting solidarity with the Palestinian people. The proposed student movement aims to connect independent organizations, unions, and campus campaigns across continents.</p>
          <p>A shared framework for cooperation, learning, and collective action—built to carry relationships and experience beyond a single moment of mobilization.</p>
          <TextLink href="/about">About Echo of Palestine</TextLink>
        </div>
      </div>
    </section>

    <TeamSection />

    <section className="section home-direction" aria-labelledby="direction-title">
      <div className="container">
        <div className="direction-intro">
          <div>
            <h2 id="direction-title">Connected across borders.<br /><em>Led with Palestinians.</em></h2>
            <div className="principle-note">Organizational autonomy.<br />Meaningful Palestinian leadership.</div>
          </div>
          <div className="prose">
            <p className="lead">A permanent movement for Palestinian freedom, justice, and self-determination, with meaningful Palestinian leadership at its heart.</p>
            <p>The vision preserves the autonomy of participating organizations while creating space for cooperation and collective learning. These intended areas of work give that vision a practical direction.</p>
            <TextLink href="/vision-mission">Explore the vision and mission</TextLink>
          </div>
        </div>
        <div className="direction-work" aria-labelledby="capacity-title">
          <h3 id="capacity-title">Building lasting capacity</h3>
          <div className="work-grid">
            {workingAreas.map(({ title, text }, index) => <article className="work-item" key={title}>
              <span className="work-number" aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
              <h4>{title}</h4><p>{text}</p>
            </article>)}
          </div>
        </div>
      </div>
    </section>

    <section className="section conference-story" aria-labelledby="conference-title">
      <div className="container home-conference-grid">
        <div className="conference-copy">
          <h2 id="conference-title">A Voice of the Voiceless</h2>
          <p className="lead">A conference that brought Palestinian rights and international solidarity into conversation.</p>
          <p>The February 2025 conference in Islamabad forms part of the wider context of Echo of Palestine. The student initiative looks toward a sustained framework for cooperation.</p>
          <TextLink href="/about#conference">Explore the conference</TextLink>
        </div>
        <figure className="conference-panorama">
          <Image src="/images/conference-gathering.webp" alt="Participants gathered at the Echo of Palestine International Conference on February 15, 2025." width={1600} height={1069} sizes="(max-width: 800px) 100vw, 600px" />
          <figcaption>Echo of Palestine International Conference · Islamabad, Pakistan · February 15–16, 2025</figcaption>
        </figure>
      </div>
    </section>
    <ParticipationCTA />
  </>;
}
