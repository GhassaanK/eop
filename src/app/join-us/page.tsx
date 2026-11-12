import Image from "next/image";
import { connection } from "next/server";
import { PageIntro, Arrow } from "@/components/ui";
import JoinForm from "@/components/join/JoinForm";
import { pageMetadata, site } from "@/lib/site";
import { getJoinConfig } from "@/lib/join-config";

export const metadata = pageMetadata("Join Us | Echo of Palestine", "Express interest in the International Student Solidarity Movement for Palestine as a student, campus organization, union, or academic and civil society collaborator.", "/join-us");

export default async function JoinUs() {
  await connection();
  return <>
    <PageIntro title="Join the Movement"><p>Express your interest in the International Student Solidarity Movement for Palestine. A first step toward exploring how you or your organization could take part.</p></PageIntro>
    <section className="section"><div className="container join-layout"><aside className="join-aside"><figure className="join-photo"><Image src="/images/supplied-auditorium.webp" alt="A large audience gathered in an auditorium with a full balcony." width={854} height={570} sizes="(max-width: 800px) calc(100vw - 40px), 360px" /><figcaption>A solidarity gathering from the Echo of Palestine photo collection.</figcaption></figure><h2>A place for shared purpose</h2><p>The initiative invites expressions of interest from people and organizations connected to student solidarity, including:</p><ul className="audience-list"><li>Student organizations</li><li>Student unions</li><li>Campus campaigns</li><li>Individual students</li><li>Academic and civil society collaborators</li></ul><p>You can introduce your campus work, explain what you would like to learn, or share your interest in future coordination.</p><div className="join-alternative"><h3>Another way to connect</h3><p>The official conference Facebook page is an alternative point of contact.</p><a href={site.facebook} target="_blank" rel="noopener noreferrer">Official conference Facebook page<Arrow diagonal /></a></div></aside><JoinForm available={Boolean(getJoinConfig())} /></div></section>
  </>;
}
