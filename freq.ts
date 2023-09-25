// Reference frequency for A4
const A4_FREQUENCY = 440.0;

// Musical notes in an octave
const notes = [
  "C",
  "C#",
  "D",
  "D#",
  "E",
  "F",
  "F#",
  "G",
  "G#",
  "A",
  "A#",
  "B",
] as const;

type MusicalNote = (typeof notes)[number];

export type Note = {
  note: MusicalNote;
  octave: number;
  frequency: number;
};
// Calculates the key number relative to A4
function calculateKeyNumber(note: MusicalNote, octave: number): number {
  const keyNumber = notes.indexOf(note);
  return keyNumber - 9 + (octave - 4) * 12;
}

/**
 * Given a musical note and its octave, this function returns its frequency.
 * @param note Musical note (e.g., "A", "C#", "G")
 * @param octave Octave number
 * @returns Frequency in Hz
 */
export function frequencyForNote(note: MusicalNote, octave: number): number {
  const keyNumber = calculateKeyNumber(note, octave);
  return A4_FREQUENCY * Math.pow(2, keyNumber / 12);
}

/**
 * Given a frequency, this function returns the closest musical note.
 * @param frequency Frequency in Hz
 * @returns Closest musical note and its details
 */
export function closestNoteToFrequency(frequency: number): Note {
  const closestNoteNumber = Math.round(
    12 * Math.log2(frequency / A4_FREQUENCY)
  );
  const closestNoteIndex = (closestNoteNumber + 9) % 12;
  const note = notes[(closestNoteIndex + 12) % 12];
  const octave = Math.floor((closestNoteNumber + 9) / 12) + 4;
  const noteFrequency = frequencyForNote(note, octave);

  return {
    note,
    octave,
    frequency: noteFrequency,
  };
}

/**
 * Calculates the difference in cents between two frequencies.
 * @param frequency1 First frequency in Hz
 * @param frequency2 Second frequency in Hz
 * @returns Difference in cents
 */
export function differenceInCents(
  frequency1: number,
  frequency2: number
): number {
  return 1200 * Math.log2(frequency2 / frequency1);
}
