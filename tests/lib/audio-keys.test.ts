import { describe, expect, test } from "vitest";

import { audioManifestKey } from "../../src/lib/audio-keys";

describe("audioManifestKey", () => {
  test("strips tashkeel without removing tatweel or Arabic signs", () => {
    expect(audioManifestKey("فَـ")).toBe("فـ");
    expect(audioManifestKey("حُجْرَة / حُجُر")).toBe("حجرة / حجر");
    expect(audioManifestKey("هٰذَا")).toBe("هذا");
  });
});
