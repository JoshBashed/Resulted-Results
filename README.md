# `@resulted/results`

[![npm version](https://img.shields.io/npm/v/@resulted/results.svg)](https://www.npmjs.com/package/@resulted/results)
[![JSR](https://jsr.io/badges/@resulted/results)](https://jsr.io/@resulted/results)
[![ISC License](https://img.shields.io/badge/license-ISC-blue.svg)](LICENSE.md)

A TypeScript library for handling results and errors in a functional programming style.

## Installation

NPM:
```bash
npm install @resulted/results
yarn add @resulted/results
pnpm add @resulted/results
```

JSR:
```bash
deno add jsr:@resulted/results
pnpm add jsr:@resulted/results
```

## Usage

```typescript
import { Result } from '@resulted/results';

function divide(a: number, b: number): Result<number, 'ZeroDivisionError'> {
    if (b === 0) {
        return Result.err('ZeroDivisionError');
    }
    return Result.ok(a / b);
}

function doMath(): Result<number, 'DivisionError'> {
    const randomNum = Math.floor(Math.random() * 10);
    return divide(10, randomNum).mapErr(() => 'DivisionError');
}

function main() {
    const result = doMath();
    if (result.isOk()) {
        console.log('Result:', result.value);
    } else {
        console.error('Error:', result.error);
    }
}
```

## Contributing

Contributions are welcome! This project uses [pnpm](https://pnpm.io/) as its package manager.

### Setup

```bash
git clone https://github.com/resulted-io/results.git
cd results
pnpm install
```

### Scripts

- `pnpm run build`: Build CJS and ESM outputs
- `pnpm run typecheck`: Run TypeScript type checking
- `pnpm run lint`: Run Biome linter
- `pnpm run format`: Auto-fix lint and formatting issues

### Submitting Changes

1. Fork the repository and create a feature branch.
2. Make your changes and ensure `pnpm run lint` and `pnpm run typecheck` pass.
3. Open a pull request with a clear description of your changes.

## License

This project is licensed under the ISC License. See [LICENSE.md](LICENSE.md) for details.
