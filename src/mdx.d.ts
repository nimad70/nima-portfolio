/**
 * MDX modules export a `metadata` object alongside the default component.
 * Typed as `unknown` on purpose — it is validated by a Zod schema at load
 * (src/content/schema.ts), and a structural type here would let an unchecked
 * shape through while looking safe.
 */
declare module "*.mdx" {
  import type { ComponentType } from "react";
  export const metadata: unknown;
  const Component: ComponentType;
  export default Component;
}
