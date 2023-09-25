type NumericArray = number[] | Float32Array | Float64Array | Int32Array;

// Compute the difference for each lag value in the data
function computeDifference(data: NumericArray): number[] {
  const halfDataLength = Math.floor(data.length * 0.5);
  const result = new Array(halfDataLength);
  for (let lag = 0; lag <= halfDataLength; lag++) {
    let squaredDifference = 0;
    for (let index = 0; index < halfDataLength; index++) {
      const delta = data[index] - data[index + lag];
      squaredDifference += delta * delta;
    }
    result[lag] = squaredDifference;
  }
  return result;
}

// Compute the cumulative mean normalized difference
function computeCumulativeMeanNormalizedDifference(
  diff: NumericArray
): NumericArray {
  const result = new Array(diff.length);
  for (let lag = 0; lag < diff.length; lag++) {
    let sum = 0;
    for (let index = 0; index <= lag; index++) {
      sum += diff[index];
    }
    result[lag] = diff[lag] / (sum / lag);
  }
  return result;
}

// Find the first lag below the given threshold
function findFirstBelowThreshold(
  diff: NumericArray,
  threshold: number
): number | null {
  const firstBelowThreshold = diff.findIndex((value) => value < threshold);
  return firstBelowThreshold === -1 ? null : firstBelowThreshold;
}

// Find the best local estimate for the lag
function findBestLocalEstimate(data: NumericArray, lag: number): number | null {
  for (let index = lag + 1; index < data.length; index++) {
    if (data[index] >= data[index - 1]) {
      return index - 1;
    }
  }
  return null;
}

// Interpolate the diff array around the lag
function performInterpolation(diff: NumericArray, lag: number): number {
  const prev = lag < 1 ? lag : lag - 1;
  const next = lag + 1 < diff.length ? lag + 1 : lag;

  const valPrev = diff[prev];
  const valLag = diff[lag];
  const valNext = diff[next];

  const delta = (valNext - valPrev) / (next - prev);
  return lag + delta / (2 * valLag - valPrev - valNext);
}

/**
 * Estimates the fundamental frequency of a given time-domain signal.
 *
 * @remarks
 * The function is based on the YIN algorithm described in the paper
 * "YIN, a fundamental frequency estimator for speech and music" by
 * Alain de Cheveigné and Hideki Kawahara.
 * http://audition.ens.fr/adc/pdf/2002_JASA_YIN.pdf
 * With a notable exception that it does not use the global minimum
 * if no local minimum is found.
 *
 * @param data - The input data representing the time-domain signal.
 * Should be an array of numeric values.
 *
 * @param sampleRate - The sample rate of the input data in Hz.
 *
 * @param threshold - Optional. The threshold value used in the frequency
 * estimation algorithm. Default is 0.1.
 *
 * @returns The estimated fundamental frequency in Hz. Returns `null` if
 * the fundamental frequency cannot be estimated.
 *
 * @example
 * ```typescript
 * const data = new Float32Array(1024);
 * const sampleRate = 44100;
 * const frequency = 440;
 * for (let i = 0; i < data.length; i++) {
 *  data[i] = Math.sin((2 * Math.PI * frequency * i) / sampleRate);
 * }
 * const frequency = estimateFundamentalFrequency(data, 44100);
 * ```
 */
export function estimateFundamentalFrequency(
  data: NumericArray,
  sampleRate: number,
  threshold: number = 0.1
): number | null {
  const diff = computeDifference(data);
  const cmnd = computeCumulativeMeanNormalizedDifference(diff);
  const tau = findFirstBelowThreshold(cmnd, threshold);

  if (tau === null) {
    return null;
  }

  const bestEstimate = findBestLocalEstimate(cmnd, tau);
  if (bestEstimate === null) {
    return null;
  }

  const interpolatedLag = performInterpolation(diff, bestEstimate);
  return sampleRate / interpolatedLag;
}
