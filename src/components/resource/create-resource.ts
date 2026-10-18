import type { ResourceDefinition } from "@/components/resource/types";

export function createResource<TData>(
  definition: ResourceDefinition<TData>,
): ResourceDefinition<TData> {
  return definition;
}