# Estimate fundamental frequency

Fundamental frequency detection with (a slightly modified version of) the [YIN Algorithm](http://audition.ens.fr/adc/pdf/2002_JASA_YIN.pdf).
The difference is that it does not use the global threshold if no local minimum is found.

A demo with the microphone as input can be found at https://www.amefi.no/projects/tuner.

## Installation

```bash
npm install estimate-fundamental-frequency
```

## Usage

```typescript
import { estimateFundamentalFrequency } from "estimate-fundamental-frequency";

const data = new Float32Array(1024);

const sampleRate = 44100;
const frequency = 440;

for (let i = 0; i < data.length; i++) {
  data[i] = Math.sin((2 * Math.PI * frequency * i) / sampleRate);
}

const estimatedFrequency = estimateFundamentalFrequency(data, 44100);
```

## License

MIT
