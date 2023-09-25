import { describe, expect, it } from "@jest/globals";
import { estimateFundamentalFrequency } from "./estimate-fundamental-frequency";

describe("estimateFundamentalFrequency", () => {
  it("should return the correct frequency", () => {
    const data = new Float32Array(1024);
    const sampleRate = 44100;
    const frequency = 440;

    for (let i = 0; i < data.length; i++) {
      data[i] = Math.sin((2 * Math.PI * frequency * i) / sampleRate);
    }

    const estimatedFrequency = estimateFundamentalFrequency(data, 44100);

    expect(estimatedFrequency).toBeCloseTo(frequency);
  });

  it("should return null if the frequency cannot be estimated", () => {
    const data = new Float32Array(1024);

    // Fill data with some noise
    for (let i = 0; i < data.length; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const estimatedFrequency = estimateFundamentalFrequency(data, 44100);

    expect(estimatedFrequency).toBeNull();
  });
});
