import { ButtonLink } from "@/components/ui";

export default function NotFound() {
  return <section className="container not-found"><h1>We couldn’t find that page.</h1><p>The link may have changed. Return to Echo of Palestine to explore the movement.</p><ButtonLink href="/">Back to Home</ButtonLink></section>;
}
