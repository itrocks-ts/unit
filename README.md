[![npm version](https://img.shields.io/npm/v/@itrocks/unit?logo=npm)](https://www.npmjs.org/package/@itrocks/unit)
[![npm downloads](https://img.shields.io/npm/dm/@itrocks/unit)](https://www.npmjs.org/package/@itrocks/unit)
[![GitHub](https://img.shields.io/github/last-commit/itrocks-ts/unit?color=2dba4e&label=commit&logo=github)](https://github.com/itrocks-ts/unit)
[![issues](https://img.shields.io/github/issues/itrocks-ts/unit)](https://github.com/itrocks-ts/unit/issues)
[![discord](https://img.shields.io/discord/1314141024020467782?color=7289da&label=discord&logo=discord&logoColor=white)](https://25.re/ditr)

# unit

Associates a custom unit with a class property.

*This documentation was written by an artificial intelligence and may contain errors or approximations.
It has not yet been fully reviewed by a human. If anything seems unclear or incomplete,
please feel free to contact the author of this package.*

## Installation

```bash
npm i @itrocks/unit
```

## Usage

`@itrocks/unit` provides:

- a property decorator `@Unit()` to declare the unit of a class property (for
  example minutes, %, kg, km, …), and
- a helper function `unitOf()` to read that unit at runtime.

The decorator itself does not format or validate values. Instead, it stores a
simple unit label (a string) as metadata so that other parts of your
application (or the it.rocks framework) can display it consistently in
generated UIs, reports, exports, etc.

### Minimal example

```ts
import { Unit } from '@itrocks/unit'

class Movie {
  // Runtime expressed in minutes
  @Unit('min')
  runtime?: number
}
```

Here, any UI or formatting layer that understands the `@Unit()` metadata can
display `runtime` with the `min` suffix, for example `"120 min"`.

### Complete example with runtime lookup

In a typical it.rocks project, higher-level components automatically use this
metadata. The following example shows how you can consume it manually in a
standalone TypeScript application:

```ts
import type { ObjectOrType } from '@itrocks/class-type'
import { Unit, unitOf }    from '@itrocks/unit'

class SensorReading {
  @Unit('°C')
  temperature = 0

  @Unit('%')
  humidity = 0
}

function formatWithUnit<T extends object>(
  value: number,
  target: ObjectOrType<T>,
  property: keyof T
): string {
  const unit = unitOf(target, property)
  return unit ? `${value} ${unit}` : String(value)
}

const reading = new SensorReading()
reading.temperature = 21.5
reading.humidity    = 45

// "21.5 °C"
const t = formatWithUnit(reading.temperature, SensorReading, 'temperature')

// "45 %"
const h = formatWithUnit(reading.humidity, SensorReading, 'humidity')
```

In real applications, you will usually rely on helpers provided by other
`@itrocks/*` packages, which already integrate `unitOf` when rendering forms
and outputs.

## API

### `Unit(value: string): PropertyDecorator`

Associates a unit label with a class property.

The `Unit` function is a decorator factory: you call it with a unit string and
apply the result to a property.

#### Parameters

- `value: string` – The unit to associate with the property, for example
  `'min'`, `'%'`, `'kg'`, `'km'`, `'€'`, `'m²'`, etc.

#### Returns

- A property decorator that stores the provided unit in metadata for the
  decorated property.

#### Usage notes

- It is typically used on numeric properties, but it can technically be
  applied to any property type.
- The decorator only stores a label; it does not perform unit conversion or
  numeric validation.

### `unitOf<T extends object>(target: ObjectOrType<T>, property: KeyOf<T>): string | undefined`

Reads the unit label associated with a property decorated by `@Unit()`.

#### Parameters

- `target: ObjectOrType<T>` – The class constructor or an instance whose
  property you want to inspect.
- `property: KeyOf<T>` – The name of the property for which to retrieve the
  unit.

#### Returns

- `string` – The unit label associated with the property, if one was defined
  with `@Unit()`.
- `undefined` – If the property is not decorated or has no unit metadata.

#### Example

```ts
const unit = unitOf(SensorReading, 'temperature') // "°C"
```

## Typical use cases

- Displaying physical quantities with their units in tables, forms or charts
  (temperature in `°C`, distance in `km`, weight in `kg`, etc.).
- Marking duration fields (for example `runtime` in `min`, delays in `ms`,
  lead time in `days`).
- Attaching percentage units to ratio fields (`%` for completion rate,
  success rate, discount, occupancy, …).
- Tagging business-specific measurements such as `points`, `credits`, or
  `tokens` so that front-end components can render consistent labels.
- Sharing a single source of truth for units across the backend and frontend,
  avoiding hard-coded strings scattered throughout the codebase.
