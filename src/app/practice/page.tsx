import { PracticeClient } from "@/components/practice-client";
import { getSiteContent } from "@/lib/content";

export const metadata = { title: "Practice" };

export default function PracticePage() {
  const content = getSiteContent();
  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-8 sm:py-10">
      <PracticeClient
        vocab={content.vocab}
        topics={content.topics}
        lessons={content.lessons}
      />
    </div>
  );
}
