// Workflow Engine Unit Tests

const { MATCH_SCORE_THRESHOLD } = require("../../backend/services/workflow-engine");

describe("Workflow Engine Logic", () => {
  describe("Match Score Threshold", () => {
    it("should have threshold of 70%", () => {
      expect(MATCH_SCORE_THRESHOLD).toBe(70);
    });

    it("should classify score >= 70 as matched", () => {
      const score = 75;
      expect(score >= MATCH_SCORE_THRESHOLD).toBe(true);
    });

    it("should classify score < 70 as not matched", () => {
      const score = 65;
      expect(score >= MATCH_SCORE_THRESHOLD).toBe(false);
    });
  });

  describe("Decision Logic", () => {
    it("should follow INTERVIEW path when matched", () => {
      const score = 85;
      const isMatched = score >= MATCH_SCORE_THRESHOLD;
      expect(isMatched).toBe(true);
      expect(isMatched ? "INTERVIEW" : "REJECTION").toBe("INTERVIEW");
    });

    it("should follow REJECTION path when not matched", () => {
      const score = 45;
      const isMatched = score >= MATCH_SCORE_THRESHOLD;
      expect(isMatched).toBe(false);
      expect(isMatched ? "INTERVIEW" : "REJECTION").toBe("REJECTION");
    });

    it("should handle edge case: score exactly at threshold", () => {
      const score = 70;
      const isMatched = score >= MATCH_SCORE_THRESHOLD;
      expect(isMatched).toBe(true);
    });
  });
});
