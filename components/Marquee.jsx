import { Marquee } from "@/components/ui/marquee";
import { cn } from "@/lib/utils";

const reviews = [
  {
    name: "Sophia",
    username: "@sophia",
    body: "This platform makes blogging so easy! The AI suggestions save me hours every week.",
    img: "https://randomuser.me/api/portraits/women/44.jpg",
  },
  {
    name: "Liam",
    username: "@liam",
    body: "I love the clean design and dark mode. Writing feels smooth and distraction-free.",
    img: "https://randomuser.me/api/portraits/men/32.jpg",
  },
  {
    name: "Ava",
    username: "@ava",
    body: "The SEO insights are super helpful. My blogs started ranking higher within days!",
    img: "https://randomuser.me/api/portraits/women/65.jpg",
  },
  {
    name: "Ethan",
    username: "@ethan",
    body: "Bookmarking and saving drafts across devices makes my workflow so much better.",
    img: "https://randomuser.me/api/portraits/men/41.jpg",
  },
  {
    name: "Mia",
    username: "@mia",
    body: "I tried the AI title generator — wow! It gave me creative headlines I hadn’t even thought of.",
    img: "https://randomuser.me/api/portraits/women/12.jpg",
  },
  {
    name: "Noah",
    username: "@noah",
    body: "As a team, we love the collaboration tools. Reviewing and publishing blogs together is seamless.",
    img: "https://randomuser.me/api/portraits/men/54.jpg",
  },
];


const firstRow = reviews.slice(0, reviews.length / 2);
const secondRow = reviews.slice(reviews.length / 2);

const ReviewCard = ({ img, name, username, body }) => {
  return (
    <figure
      className={cn(
        "relative h-full w-64 cursor-pointer overflow-hidden rounded-xl border p-4",
        "border-gray-950/[.1] bg-gray-950/[.01] hover:bg-gray-950/[.05]",
        "dark:border-gray-50/[.1] dark:bg-gray-50/[.10] dark:hover:bg-gray-50/[.15]",
      )}
    >
      <div className="flex flex-row items-center gap-2">
        <img className="rounded-full" width="32" height="32" alt="" src={img} />
        <div className="flex flex-col">
          <figcaption className="text-sm font-medium dark:text-white">
            {name}
          </figcaption>
          <p className="text-xs font-medium dark:text-white/40">{username}</p>
        </div>
      </div>
      <blockquote className="mt-2 text-sm">{body}</blockquote>
    </figure>
  );
};

export function MarqueeDemo() {
  return (
    <div className="my-12 relative flex max-w-7xl mx-auto flex-col items-center justify-center overflow-hidden dark:bg-gray-900">
      <Marquee pauseOnHover className="[--duration:20s]">
        {firstRow.map((review) => (
          <ReviewCard key={review.username} {...review} />
        ))}
      </Marquee>
      <Marquee reverse pauseOnHover className="[--duration:20s]">
        {secondRow.map((review) => (
          <ReviewCard key={review.username} {...review} />
        ))}
      </Marquee>
      <div className="pointer-events-none absolute inset-y-0 left-0 w-1/4 bg-gradient-to-r from-background"></div>
      <div className="pointer-events-none absolute inset-y-0 right-0 w-1/4 bg-gradient-to-l from-background"></div>
    </div>
  );
}