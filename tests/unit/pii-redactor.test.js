// PII Redactor Unit Tests

const { detectPII, redactPII } = require("../../backend/utils/pii-patterns");

describe("PII Detection & Redaction", () => {
  describe("detectPII", () => {
    it("should detect email addresses", () => {
      const text = "Contact me at john.doe@example.com for more info";
      const detected = detectPII(text);
      expect(detected.length).toBeGreaterThan(0);
      expect(detected[0].type).toBe("Email Address");
    });

    it("should detect phone numbers", () => {
      const text = "Call me at (123) 456-7890 anytime";
      const detected = detectPII(text);
      expect(detected.some((d) => d.type === "Phone Number")).toBe(true);
    });

    it("should detect SSN", () => {
      const text = "SSN: 123-45-6789";
      const detected = detectPII(text);
      expect(detected.some((d) => d.type === "Social Security Number")).toBe(true);
    });

    it("should detect date of birth", () => {
      const text = "Born on 01/15/1990";
      const detected = detectPII(text);
      expect(detected.some((d) => d.type === "Date of Birth")).toBe(true);
    });

    it("should return empty array for clean text", () => {
      const text = "Senior Software Engineer with 5 years of experience in Node.js and React";
      const detected = detectPII(text);
      expect(detected.length).toBe(0);
    });
  });

  describe("redactPII", () => {
    it("should redact email addresses", () => {
      const text = "john.doe@example.com";
      const redacted = redactPII(text);
      expect(redacted).not.toContain("@");
      expect(redacted).toContain("[REDACTED]");
    });

    it("should redact phone numbers", () => {
      const text = "(123) 456-7890";
      const redacted = redactPII(text);
      expect(redacted).not.toContain("123");
      expect(redacted).toContain("[REDACTED]");
    });

    it("should preserve non-PII text", () => {
      const text = "Senior Software Engineer with 5 years of experience";
      const redacted = redactPII(text);
      expect(redacted).toContain("Senior Software Engineer");
      expect(redacted).toContain("5 years");
    });

    it("should redact multiple PII items", () => {
      const text = "John Doe, john@example.com, 555-1234, 01/15/1990";
      const redacted = redactPII(text);
      expect(redacted.match(/\[REDACTED\]/g).length).toBeGreaterThan(2);
    });
  });
});
