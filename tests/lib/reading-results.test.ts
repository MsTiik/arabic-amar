import { describe, expect, it } from "vitest";

import { parseReadingResults, scoreReading } from "@/lib/reading-results";

describe("reading results", () => {
  it("keeps only valid marks from stored JSON", () => {
    const parsed = parseReadingResults(
      JSON.stringify({ "khalids-house": { a: "right", b: "wrong", c: "maybe" }, bad: [1] }),
    );
    expect(parsed).toEqual({ "khalids-house": { a: "right", b: "wrong" } });
    expect(parseReadingResults("not json")).toEqual({});
    expect(parseReadingResults(null)).toEqual({});
  });

  it("scores only the reading's current questions", () => {
    expect(scoreReading({ a: "right", b: "wrong", old: "right" }, ["a", "b", "c"])).toEqual({
      right: 1,
      answered: 2,
      total: 3,
    });
    expect(scoreReading(undefined, ["a"])).toEqual({ right: 0, answered: 0, total: 1 });
  });
});
