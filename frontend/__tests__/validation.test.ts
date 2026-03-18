import {
  validateLatitude,
  validateLongitude,
  validateCity,
  validateWeatherForm,
  isFormValid,
} from "@/utils/validation";

describe("validateLatitude", () => {
  it("returns undefined for valid latitude", () => {
    expect(validateLatitude("52.52")).toBeUndefined();
  });

  it("returns error for empty string", () => {
    expect(validateLatitude("")).toBe("Latitude is required");
  });

  it("returns error for non-numeric value", () => {
    expect(validateLatitude("abc")).toBe("Latitude must be a number");
  });

  it("returns error for out of range value", () => {
    expect(validateLatitude("91")).toBe("Latitude must be between -90 and 90");
    expect(validateLatitude("-91")).toBe(
      "Latitude must be between -90 and 90"
    );
  });

  it("accepts boundary values", () => {
    expect(validateLatitude("90")).toBeUndefined();
    expect(validateLatitude("-90")).toBeUndefined();
  });
});

describe("validateLongitude", () => {
  it("returns undefined for valid longitude", () => {
    expect(validateLongitude("13.405")).toBeUndefined();
  });

  it("returns error for empty string", () => {
    expect(validateLongitude("")).toBe("Longitude is required");
  });

  it("returns error for out of range value", () => {
    expect(validateLongitude("181")).toBe(
      "Longitude must be between -180 and 180"
    );
  });

  it("accepts boundary values", () => {
    expect(validateLongitude("180")).toBeUndefined();
    expect(validateLongitude("-180")).toBeUndefined();
  });
});

describe("validateCity", () => {
  it("returns undefined for valid city", () => {
    expect(validateCity("Berlin")).toBeUndefined();
  });

  it("returns error for empty string", () => {
    expect(validateCity("")).toBe("City name is required");
  });

  it("returns error for whitespace-only string", () => {
    expect(validateCity("   ")).toBe("City name is required");
  });
});

describe("validateWeatherForm", () => {
  it("validates coordinates mode", () => {
    const errors = validateWeatherForm({
      mode: "coordinates",
      latitude: "",
      longitude: "",
      city: "",
      country: "",
    });
    expect(errors.latitude).toBeDefined();
    expect(errors.longitude).toBeDefined();
    expect(errors.city).toBeUndefined();
  });

  it("validates city mode", () => {
    const errors = validateWeatherForm({
      mode: "city",
      latitude: "",
      longitude: "",
      city: "",
      country: "",
    });
    expect(errors.city).toBeDefined();
    expect(errors.latitude).toBeUndefined();
    expect(errors.longitude).toBeUndefined();
  });
});

describe("isFormValid", () => {
  it("returns true when no errors", () => {
    expect(isFormValid({})).toBe(true);
  });

  it("returns false when errors exist", () => {
    expect(isFormValid({ latitude: "required" })).toBe(false);
  });
});
