"use client";

import { Fragment, useEffect, useState } from "react";
import { Eye, EyeOff, X } from "lucide-react";

import { ArabicText } from "@/components/arabic-text";
import { SpeakerButton } from "@/components/speaker-button";
import {
  VOCAB_SET_FORM_LABELS,
  sentenceArabic,
  type LevelTwoVocabSet,
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

export function VocabSetView({ set }: { set: LevelTwoVocabSet }) {
  const [filter, setFilter] = useState<KindFilter>("all");
  const [showTransliteration, setShowTransliteration] = useState(true);
  const [showEnglish, setShowEnglish] = useState(true);
  const [selected, setSelected] = useState<SelectedToken | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);

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

  function selectToken(key: string, token: VocabSetToken) {
    setSelected({ key, token });
    // Touch screens cannot hover, so a tap opens the meaning in a sheet.
    if (window.matchMedia("(hover: none)").matches) setSheetOpen(true);
  }

  return (
    <div className="space-y-5">
      <div className="surface flex flex-col gap-3 p-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between sm:p-4">
        <div className="segmented" role="group" aria-label="Show word types">
          <FilterButton active={filter === "all"} onClick={() => setFilter("all")}>
            All {set.words.length}
          </FilterButton>
          {kinds.map((kind) => (
            <FilterButton key={kind} active={filter === kind} onClick={() => setFilter(kind)}>
              {KIND_LABELS[kind].many}{" "}
              {set.words.filter((word) => word.kind === kind).length}
            </FilterButton>
          ))}
        </div>
        <div className="flex flex-wrap gap-2" role="group" aria-label="Display options">
          <ToggleButton
            pressed={showTransliteration}
            onClick={() => setShowTransliteration((value) => !value)}
          >
            Transliteration
          </ToggleButton>
          <ToggleButton pressed={showEnglish} onClick={() => setShowEnglish((value) => !value)}>
            English
          </ToggleButton>
        </div>
      </div>

      <nav aria-label="Words in this set">
        <ul className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0">
          {words.map((word) => (
            <li key={word.id} className="shrink-0">
              <a
                href={`#word-${word.id}`}
                className="tile flex items-baseline gap-2 px-3 py-1.5 text-sm transition-colors hover:border-primary/40 focus-ring"
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

      <p className="text-sm text-muted-foreground">
        <span className="hidden [@media(hover:hover)]:inline">Hover over</span>
        <span className="[@media(hover:hover)]:hidden">Tap</span> any Arabic word in a sentence
        to see its transliteration and meaning. Words in{" "}
        <span className="font-semibold text-accent-rose">red</span>{" "}
        are the card&rsquo;s word.
      </p>

      <div className="grid items-start gap-4 lg:grid-cols-2">
        {words.map((word) => (
          <WordCard
            key={word.id}
            word={word}
            showTransliteration={showTransliteration}
            showEnglish={showEnglish}
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
  children,
}: {
  pressed: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  const Icon = pressed ? Eye : EyeOff;
  return (
    <button
      type="button"
      aria-pressed={pressed}
      onClick={onClick}
      className={cn(
        "btn btn-sm",
        pressed ? "btn-secondary" : "btn-ghost text-muted-foreground line-through",
      )}
    >
      <Icon className="h-4 w-4" aria-hidden />
      {children}
    </button>
  );
}

const FORM_GRID_COLUMNS: Record<number, string> = {
  1: "sm:grid-cols-1",
  2: "sm:grid-cols-2",
  3: "sm:grid-cols-3",
  4: "sm:grid-cols-2",
};

function WordCard({
  word,
  showTransliteration,
  showEnglish,
  selectedKey,
  onSelectToken,
}: {
  word: VocabSetWord;
  showTransliteration: boolean;
  showEnglish: boolean;
  selectedKey?: string;
  onSelectToken: (key: string, token: VocabSetToken) => void;
}) {
  const headingId = `word-${word.id}-heading`;
  return (
    <article
      id={`word-${word.id}`}
      aria-labelledby={headingId}
      className="surface scroll-mt-24 p-4 sm:p-6"
    >
      <header className="flex items-start justify-between gap-3 border-b-2 border-accent-rose/70 pb-3">
        <div className="min-w-0 pt-1">
          <h3 id={headingId} className="text-lg font-semibold leading-snug">
            <span lang="ar-Latn">{word.headword.transliteration}</span>
            {showEnglish ? (
              <span className="font-normal text-muted-foreground"> · {word.headword.english}</span>
            ) : null}
          </h3>
          <div className="mt-1.5 flex items-center gap-2">
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
          className="shrink-0 text-[2.25rem] leading-tight text-accent-rose sm:text-5xl"
        >
          {word.headword.arabic}
        </ArabicText>
      </header>

      <dl
        dir="rtl"
        className={cn(
          "mt-4 grid grid-cols-1 gap-1.5 sm:gap-2",
          FORM_GRID_COLUMNS[word.forms.length] ?? "sm:grid-cols-3",
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

      <section className="mt-5" aria-label={`Example sentences for ${word.headword.transliteration}`}>
        <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Sentences ·{" "}
          <span lang="ar" className="font-arabic text-sm normal-case">
            الجُمَل
          </span>
        </h4>
        <ol className="mt-2 divide-y divide-dashed divide-hairline border-t border-dashed border-hairline">
          {word.sentences.map((sentence) => (
            <li key={sentence.id} className="py-3">
              <GlossedSentence
                sentence={sentence}
                selectedKey={selectedKey}
                onSelectToken={onSelectToken}
              />
              {showTransliteration ? (
                <p lang="ar-Latn" className="mt-1 text-right text-sm italic text-foreground-soft">
                  {sentence.transliteration}
                </p>
              ) : null}
              {showEnglish ? (
                <p className="text-right text-sm text-muted-foreground">{sentence.english}</p>
              ) : null}
            </li>
          ))}
        </ol>
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
      className="flex min-w-0 items-center gap-3 rounded-lg border border-hairline bg-background-soft/50 px-3 py-2 sm:flex-col sm:gap-1.5 sm:px-2 sm:py-3 sm:text-center"
    >
      <dt className="w-20 shrink-0 sm:w-auto">
        <span lang="ar" dir="rtl" className="block text-left font-arabic text-sm font-semibold text-accent-rose sm:text-center">
          {label.arabic}
        </span>
        <span className="block text-[0.65rem] font-medium uppercase tracking-wider text-muted-foreground">
          {label.english}
        </span>
      </dt>
      <dd className="min-w-0 flex-1 text-right sm:w-full sm:text-center">
        <ArabicText className="text-[1.6rem] leading-snug sm:text-[1.75rem]">
          {form.items.map((item) => item.arabic).join("، ")}
        </ArabicText>
        {showTransliteration || showEnglish ? (
          <p className="text-sm leading-snug">
            {showTransliteration ? (
              <span lang="ar-Latn" className="italic text-foreground-soft sm:block">
                {form.items.map((item) => item.transliteration).join(", ")}
              </span>
            ) : null}
            {showTransliteration && showEnglish ? (
              <span className="text-muted-foreground sm:hidden" aria-hidden>
                {" · "}
              </span>
            ) : null}
            {showEnglish ? (
              <span className="text-muted-foreground sm:block sm:text-xs">
                {form.items.map((item) => item.english).join(", ")}
              </span>
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
      className="font-arabic text-[1.45rem] leading-[2.2] sm:text-[1.7rem]"
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
