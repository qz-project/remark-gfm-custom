/**
 * Like `Object.keys`, but ensures the result matches the literal keys of the
 * passed-in object.
 *
 * Normally, `Object.keys` returns `string[]`.
 *
 * Reference:
 * <https://gist.github.com/JosXa/a76b4e4cde1ef8ac7092a1dff670aa68#file-typed-objects-ts-L34-L40>
 * at 2026-02-10
 */
export function typedObjectKeys<const T extends object>(obj: T): (keyof typeof obj)[] {
  return Object.keys(obj) as (keyof typeof obj)[];
}
