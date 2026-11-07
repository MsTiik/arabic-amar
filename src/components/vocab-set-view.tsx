"use client";

import { Fragment, useEffect, useState } from "react";
import { ChevronDown, Eye, EyeOff, MessageSquareText, X } from "lucide-react";

import { ArabicText } from "@/components/arabic-text";
import { SpeakerButton } from "@/components/speaker-button";
import {
  VOCAB_SET_FORM_LABELS,
  sentenceArabic,
  type LevelTwoVocabTheme,
  type VocabSetForm,
  type VocabSetSentence,
  type VocabSetToken,
  type VocabSetWord,
  type VocabSetWordKind,
} from "@/data/level-two-vocab-sets";
import { cn } from "@/lib/cn";

const KIND_LABELS: Record<VocabSetWordKind, { one: string; many: string }> = {
  noun: { one: "Noun", many: "Nouns" },
  adjective: { one: "Adjective", many: "Adjectives" },
  verb: { one: "Verb", many: "Verbs" },
  preposition: { one: "Preposition", many: "Prepositions" },
};

type KindFilter = "all" | VocabSetWordKind;

interface SelectedToken {
  key: string;
  token: VocabSetToken;
}

export function VocabSetView({ theme }: { theme: LevelTwoVocabTheme }) {
  const [setSlug, setSetSlug] = useState(theme.sets[0].slug);
  const set = theme.sets.find((entry) => entry.slug === setSlug) ?? theme.sets[0];
  const [filter, setFilter] = useState<KindFilter>("all");
  const [showTransliteration, setShowTransliteration] = useState(true);
  const [showEnglish, setShowEnglish] = useState(true);
  const [selected, setSelected] = useState<SelectedToken | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);
  // Example sentences stay folded until asked for, to keep the cards short.
  const [openSentences, setOpenSentences] = useState<Readonly<Record<string, boolean>>>({});

  useEffect(() => {
    if (!sheetOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setSheetOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [sheetOpen]);

  const kinds = (Object.keys(KIND_LABELS) as VocabSetWordKind[]).filter((kind) =>
    set.words.some((word) => word.kind === kind),
  );
  const words = set.words.filter((word) => filter === "all" || word.kind === filter);
  const allOpen = words.length > 0 && words.every((word) => openSentences[word.id]);
  const toggleAllSentences = () =>
    setOpenSentences(allOpen ? {} : Object.fromEntries(words.map((word) => [word.id, true])));

  function chooseSet(slug: string) {
    setSetSlug(slug);
    setFilter("all");
    setSelected(null);
    setSheetOpen(false);
    setOpenSentences({});
  }

  function selectToken(key: string, token: VocabSetToken) {
    setSelected({ key, token });
    // Touch screens cannot hover, so a tap opens the meaning in a sheet.
    if (window.matchMedia("(hover: none)").matches) setSheetOpen(true);
  }

  return (
    <div className="space-y-3">
      {theme.sets.length > 1 ? (
        <div className="-mx-4 overflow-x-auto px-4 sm:mx-0 sm:px-0">
          <div className="segmented" role="group" aria-label={`${theme.title} word sets`}>
            {theme.sets.map((entry) => (
              <FilterButton key={entry.slug} active={entry.slug === set.slug} onClick={() => chooseSet(entry.slug)}>
                <span className="whitespace-nowrap">{entry.title}</span>
              </FilterButton>
            ))}
          </div>
        </div>
      ) : null}

      <div className="surface space-y-3 p-3 sm:p-4">
        <div>
          <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
            <h2 className="text-lg font-semibold">{set.title}</h2>
            <ArabicText variant="inline" className="text-xl text-foreground-soft">
              {set.titleArabic}
            </ArabicText>
            <span className="text-sm tabular-nums text-muted-foreground">{set.words.length} words</span>
          </div>
          <p className="mt-0.5 text-sm text-muted-foreground">{set.description}</p>
        </div>

        <div className="flex flex-col gap-2 border-t border-hairline pt-3 lg:flex-row lg:flex-wrap lg:items-center lg:justify-between">
          <div className="-mx-3 overflow-x-auto px-3 sm:mx-0 sm:px-0">
            <div className="segmented" role="group" aria-label="Show word types">
              <FilterButton active={filter === "all"} onClick={() => setFilter("all")}>
                All {set.words.length}
              </FilterButton>
              {kinds.map((kind) => (
                <FilterButton key={kind} active={filter === kind} onClick={() => setFilter(kind)}>
                  {KIND_LABELS[kind].many} {set.words.filter((word) => word.kind === kind).length}
                </FilterButton>
              ))}
            </div>
          </div>
          <div className="flex flex-wrap gap-1.5" role="group" aria-label="Display options">
            <ToggleButton pressed={allOpen} onClick={toggleAllSentences} icon={MessageSquareText}>
              All sentences
            </ToggleButton>
            <ToggleButton pressed={showTransliteration} onClick={() => setShowTransliteration((value) => !value)}>
              Transliteration
            </ToggleButton>
            <ToggleButton pressed={showEnglish} onClick={() => setShowEnglish((value) => !value)}>
              English
            </ToggleButton>
          </div>
        </div>

        <nav aria-label="Words in this set" className="border-t border-hairline pt-3">
          <ul className="-mx-3 flex gap-1.5 overflow-x-auto px-3 pb-1 sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0 sm:pb-0">
            {words.map((word) => (
              <li key={word.id} className="shrink-0">
                <a
                  href={`#word-${word.id}`}
                  className="tile flex items-baseline gap-2 px-2.5 py-1 text-sm transition-colors hover:border-primary/40 focus-ring"
                >
                  <ArabicText variant="inline" className="text-lg leading-none text-accent-rose">
                    {word.headword.arabic}
                  </ArabicText>
                  <span lang="ar-Latn" className="text-xs italic text-foreground-soft">
                    {word.headword.transliteration}
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      <p className="text-xs text-muted-foreground sm:text-sm">
        Open a card&rsquo;s sentences, then{" "}
        <span className="hidden [@media(hover:hover)]:inline">hover over</span>
        <span className="[@media(hover:hover)]:hidden">tap</span> any Arabic word to see its meaning. Words in{" "}
        <span className="font-semibold text-accent-rose">red</span>
        {" are the card’s word."}
      </p>

      <div className="grid items-start gap-3 lg:grid-cols-2">
        {words.map((word) => (
          <WordCard
            key={word.id}
            word={word}
            showTransliteration={showTransliteration}
            showEnglish={showEnglish}
            sentencesOpen={Boolean(openSentences[word.id])}
            onToggleSentences={() => setOpenSentences((current) => ({ ...current, [word.id]: !current[word.id] }))}
            selectedKey={selected?.key}
            onSelectToken={selectToken}
          />
        ))}
      </div>

      {sheetOpen && selected ? (
        <div
          role="dialog"
          aria-label="Word meaning"
          className="fixed inset-x-0 bottom-[calc(4.25rem+env(safe-area-inset-bottom))] z-40 px-3 pb-2 md:bottom-4"
        >
          <div className="mx-auto flex max-w-md items-center gap-3 tile p-4 shadow-xl">
            <ArabicText variant="display" className="shrink-0 text-3xl leading-snug text-accent-rose">
              {selected.token.arabic}
            </ArabicText>
            <div className="min-w-0 flex-1">
              <p lang="ar-Latn" className="text-sm italic text-foreground-soft">
                {selected.token.transliteration}
              </p>
              <p className="text-base font-semibold">{selected.token.english}</p>
            </div>
            <SpeakerButton arabic={selected.token.arabic} label={selected.token.english} size="sm" />
            <button
              type="button"
              className="icon-btn"
              aria-label="Close word meaning"
              onClick={() => setSheetOpen(false)}
            >
              <X className="h-4 w-4" aria-hidden />
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function FilterButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className="segmented-item text-sm tabular-nums"
    >
      {children}
    </button>
  );
}

function ToggleButton({
  pressed,
  onClick,
  icon,
  children,
}: {
  pressed: boolean;
  onClick: () => void;
  icon?: typeof Eye;
  children: React.ReactNode;
}) {
  const Icon = icon ?? (pressed ? Eye : EyeOff);
  return (
    <button
      type="button"
      aria-pressed={pressed}
      onClick={onClick}
      className={cn(
        "btn btn-sm",
        pressed ? "btn-secondary" : "btn-ghost text-muted-foreground",
        !pressed && !icon && "line-through",
      )}
    >
      <Icon className="h-4 w-4" aria-hidden />
      {children}
    </button>
  );
}

/** Forms sit side by side even on phones: two or three across. */
const FORM_GRID_COLUMNS: Record<number, string> = {
  1: "grid-cols-1",
  2: "grid-cols-2",
  3: "grid-cols-3",
  4: "grid-cols-2 sm:grid-cols-4",
  5: "grid-cols-3",
  6: "grid-cols-3",
};

function WordCard({
  word,
  showTransliteration,
  showEnglish,
  sentencesOpen,
  onToggleSentences,
  selectedKey,
  onSelectToken,
}: {
  word: VocabSetWord;
  showTransliteration: boolean;
  showEnglish: boolean;
  sentencesOpen: boolean;
  onToggleSentences: () => void;
  selectedKey?: string;
  onSelectToken: (key: string, token: VocabSetToken) => void;
}) {
  const headingId = `word-${word.id}-heading`;
  return (
    <article
      id={`word-${word.id}`}
      aria-labelledby={headingId}
      className="surface scroll-mt-24 p-3 sm:p-4"
    >
      <header className="flex items-start justify-between gap-3 border-b-2 border-accent-rose/60 pb-2">
        <div className="min-w-0 pt-1">
          <h3 id={headingId} className="text-lg font-semibold leading-snug">
            <span lang="ar-Latn">{word.headword.transliteration}</span>
            {showEnglish ? (
              <span className="font-normal text-muted-foreground"> · {word.headword.english}</span>
            ) : null}
          </h3>
          <div className="mt-1 flex items-center gap-2">
            <span className="chip text-xs">{KIND_LABELS[word.kind].one}</span>
            <SpeakerButton
              arabic={word.headword.arabic}
              label={word.headword.english}
              size="sm"
            />
          </div>
        </div>
        <ArabicText
          variant="display"
          as="p"
          className="shrink-0 text-[2.1rem] leading-tight text-accent-rose sm:text-[2.6rem]"
        >
          {word.headword.arabic}
        </ArabicText>
      </header>

      <dl
        dir="rtl"
        className={cn(
          "mt-3 grid gap-1.5",
          FORM_GRID_COLUMNS[word.forms.length] ?? "grid-cols-3",
        )}
      >
        {word.forms.map((form) => (
          <FormCell
            key={form.role}
            form={form}
            showTransliteration={showTransliteration}
            showEnglish={showEnglish}
          />
        ))}
      </dl>

      <section className="mt-3" aria-label={`Example sentences for ${word.headword.transliteration}`}>
        <button
          type="button"
          onClick={onToggleSentences}
          aria-expanded={sentencesOpen}
          className="flex w-full items-center gap-2 rounded-[10px] border border-dashed border-hairline-strong px-3 py-1.5 text-left text-xs font-semibold text-muted-foreground transition-colors hover:border-accent-rose/50 hover:text-foreground focus-ring"
        >
          <MessageSquareText className="h-3.5 w-3.5 text-accent-rose" aria-hidden />
          <span className="flex-1">
            {sentencesOpen ? "Hide" : "Show"} {word.sentences.length} example{" "}
            {word.sentences.length === 1 ? "sentence" : "sentences"}{" "}
            <span lang="ar" className="font-arabic text-sm font-normal">· الجُمَل</span>
          </span>
          <ChevronDown className={cn("h-4 w-4 transition-transform", sentencesOpen && "rotate-180")} aria-hidden />
        </button>
        {sentencesOpen ? (
          <ol className="mt-1 divide-y divide-dashed divide-hairline">
            {word.sentences.map((sentence) => (
              <li key={sentence.id} className="py-2">
                <GlossedSentence sentence={sentence} selectedKey={selectedKey} onSelectToken={onSelectToken} />
                {showTransliteration || showEnglish ? (
                  <p className="text-right text-sm leading-snug">
                    {showTransliteration ? (
                      <span lang="ar-Latn" className="block italic text-foreground-soft">{sentence.transliteration}</span>
                    ) : null}
                    {showEnglish ? <span className="block text-muted-foreground">{sentence.english}</span> : null}
                  </p>
                ) : null}
              </li>
            ))}
          </ol>
        ) : null}
      </section>
    </article>
  );
}

function FormCell({
  form,
  showTransliteration,
  showEnglish,
}: {
  form: VocabSetForm;
  showTransliteration: boolean;
  showEnglish: boolean;
}) {
  const label = VOCAB_SET_FORM_LABELS[form.role];
  return (
    <div
      dir="ltr"
      className="flex min-w-0 flex-col items-center gap-0.5 rounded-lg border border-hairline bg-background-soft/50 px-1.5 py-1.5 text-center sm:px-2 sm:py-2"
    >
      <dt className="leading-tight">
        <span lang="ar" dir="rtl" className="font-arabic text-xs font-semibold text-accent-rose sm:text-sm">
          {label.arabic}
        </span>
        <span className="ml-1 text-[0.6rem] font-medium uppercase tracking-wider text-muted-foreground sm:ml-0 sm:block sm:text-[0.65rem]">
          {label.english}
        </span>
      </dt>
      <dd className="w-full min-w-0">
        <ArabicText className="text-[1.3rem] leading-snug sm:text-[1.55rem]">
          {form.items.map((item) => item.arabic).join("، ")}
        </ArabicText>
        {showTransliteration || showEnglish ? (
          <p className="text-xs leading-snug">
            {showTransliteration ? (
              <span lang="ar-Latn" className="block italic text-foreground-soft">
                {form.items.map((item) => item.transliteration).join(", ")}
              </span>
            ) : null}
            {showEnglish ? (
              <span className="block text-muted-foreground">{form.items.map((item) => item.english).join(", ")}</span>
            ) : null}
          </p>
        ) : null}
      </dd>
    </div>
  );
}

function GlossedSentence({
  sentence,
  selectedKey,
  onSelectToken,
}: {
  sentence: VocabSetSentence;
  selectedKey?: string;
  onSelectToken: (key: string, token: VocabSetToken) => void;
}) {
  return (
    <p
      lang="ar"
      dir="rtl"
      className="font-arabic text-[1.35rem] leading-[2.1] sm:text-[1.55rem]"
      aria-label={sentenceArabic(sentence)}
    >
      {sentence.tokens.map((token, index) => {
        const key = `${sentence.id}-${index}`;
        return (
          <Fragment key={key}>
            <span className="group relative inline-block">
              <button
                type="button"
                onClick={() => onSelectToken(key, token)}
                aria-label={`${token.arabic}: ${token.transliteration}, ${token.english}`}
                className={cn(
                  "rounded-md px-0.5 underline decoration-foreground/25 decoration-dotted decoration-1 underline-offset-[0.55em] transition-colors hover:bg-primary-soft focus-ring",
                  token.focus && "text-accent-rose",
                  selectedKey === key && "bg-primary-soft",
                )}
              >
                {token.arabic}
              </button>
              {token.punctuationAfter}
              <span
                aria-hidden
                dir="ltr"
                className="pointer-events-none absolute bottom-[calc(100%-0.25rem)] left-1/2 z-30 hidden w-max max-w-[14rem] -translate-x-1/2 tile bg-card px-3 py-1.5 text-center font-sans shadow-lg group-hover:block [@media(hover:hover)]:group-focus-within:block"
              >
                <span lang="ar-Latn" className="block text-xs italic leading-snug text-foreground-soft">
                  {token.transliteration}
                </span>
                <span className="block text-xs font-semibold leading-snug text-foreground">
                  {token.english}
                </span>
              </span>
            </span>{" "}
          </Fragment>
        );
      })}
    </p>
  );
}
