import { PracticeClient } from "@/components/practice-client";
import { getSiteContent } from "@/lib/content";
import { getStudyContent } from "@/lib/study-cards";

export const metadata = { title: "Practice" };

export default function PracticePage() {
  const content = getSiteContent();
  const study = getStudyContent(content);
  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-8 sm:py-10">
      <PracticeClient
        vocab={study.vocab}
        topics={study.topics}
        lessons={content.lessons}
        rules={content.rules}
      />
    </div>
  );
}
