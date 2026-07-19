import Link from "next/link";

const SOCIALS = [
  {
    name: "Website",
    href: "https://nexasoul.vercel.app/",
    label: "🌐 nexasoul.club",
    color: "bg-electric-blue",
  },
  {
    name: "Instagram",
    href: "https://www.instagram.com/nexasoul_25/",
    label: "📸 @nexasoul",
    color: "bg-hot-pink",
  },
  {
    name: "LinkedIn",
    href: "https://linkedin.com/company/nexasoul",
    label: "💼 NexaSoul",
    color: "bg-mint",
  },
  {
    name: "WhatsApp",
    href: "https://chat.whatsapp.com/LsqljE6IVEjIBGSB04wpHq",
    label: "💬 Join the Squad",
    color: "bg-sun-yellow",
  },
];

export default function Footer() {
  return (
    <footer className="border-t-4 border-ink bg-cream mt-auto">
      <div className="pattern-dots py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-8">
            <p className="sticker bg-coral text-white text-lg mb-2 inline-block">
              STAY CONNECTED — NO GHOSTING
            </p>
            <h3
              className="text-3xl font-black mt-4"
              style={{ fontFamily: "var(--font-fraunces)" }}
            >
              NexaSoul Socials
            </h3>
            <p className="text-ink/90 mt-2 font-medium">
              Frontend × Full Stack. Weekly online. Always unhinged (in a good way).
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {SOCIALS.map((social) => (
              <Link
                key={social.name}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className={`${social.color} brutal-border brutal-hover p-4 text-center font-bold block`}
              >
                <span className="block text-xs uppercase tracking-widest opacity-70 mb-1">
                  {social.name}
                </span>
                <span className="text-lg">{social.label}</span>
              </Link>
            ))}
          </div>

          <div className="brutal-border bg-white p-6 text-center">
            <p className="font-black text-xl mb-1" style={{ fontFamily: "var(--font-fraunces)" }}>
              SRUJANA — सृजन — CREATION
            </p>
            <p className="text-sm text-ink/60">
              © {new Date().getFullYear()} NexaSoul Technical Club. Built different. Deployed loud.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
