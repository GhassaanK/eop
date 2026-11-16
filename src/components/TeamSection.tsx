import Image from "next/image";

type TeamMember = {
  name: string;
  role: string;
  country?: string;
  portrait: string;
  position?: string;
};

const president: TeamMember = {
  name: "Hafiz Uzair Ali Khan",
  role: "President",
  portrait: "/team/hafiz.png",
};

const members: TeamMember[] = [
  { name: "Halis Aküsüm", role: "Executive Member", country: "Türkiye", portrait: "/team/aaa.jpeg" },
  { name: "Khairul Nadzir", role: "Executive Member", country: "Malaysia", portrait: "/team/portt.jpg", position: "42% center" },
  { name: "Chaima Romdhani", role: "Coordinator", portrait: "/team/chaima.jpeg" },
];

function Profile({ member, featured = false }: { member: TeamMember; featured?: boolean }) {
  return (
    <article className={`team-profile${featured ? " team-president" : ""}`}>
        <div className="team-portrait">
          <Image src={member.portrait} alt={member.name} width={720} height={900}
            sizes="(max-width: 639px) calc(100vw - 40px), (max-width: 1000px) 45vw, 280px"
            style={{ objectPosition: member.position ?? "center 25%" }} />
        </div>
      <div className="team-profile-copy">
        <p className="team-role">{member.role}</p>
        <h3>{member.name}</h3>
        {member.country && <p className="team-country">{member.country}</p>}
      </div>
    </article>
  );
}

export default function TeamSection() {
  return (
    <section className="section team-section" id="team" aria-labelledby="team-title">
      <div className="container">
        <div className="team-heading"><h2 id="team-title">Our team</h2><p>The people behind Echo of Palestine.</p></div>
        <div className="team-roster">
          <Profile member={president} featured />
          {members.map(member => <Profile key={member.name} member={member} />)}
        </div>
      </div>
    </section>
  );
}
