
import "server-only";

import { createClient } from "@supabase/supabase-js";

import { clientEnv } from "@/lib/env";
import type { Database } from "@/types/database.types";

const supabase = createClient<Database>(
  clientEnv.NEXT_PUBLIC_SUPABASE_URL,
  clientEnv.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
  },
);

const NO_MATCH_MESSAGE =
  "No matching information was found in the public school records.";

type KnowledgeSource =
  | "school_info"
  | "notable"
  | "past_leadership"
  | "staff"
  | "academic"
  | "did_you_know";

const SOURCE_DETAILS: Record<
  KnowledgeSource,
  { label: string; path: string }
> = {
  school_info: {
    label: "School information",
    path: "/history",
  },
  notable: {
    label: "Notable people and alumni",
    path: "/alumni",
  },
  past_leadership: {
    label: "Past school leadership",
    path: "/history",
  },
  staff: {
    label: "School staff",
    path: "/about",
  },
  academic: {
    label: "Academic information",
    path: "/academics",
  },
  did_you_know: {
    label: "Published school facts",
    path: "/did-you-know",
  },
};

export async function getSchoolKnowledge(
  question: string,
): Promise<string> {
  const query = question.trim();

  if (!query) {
    return NO_MATCH_MESSAGE;
  }

  const { data, error } = await supabase.rpc(
    "search_school_knowledge",
    {
      p_query: query,
      p_limit: 5,
    },
  );

  if (error) {
    console.error(
      "School knowledge retrieval failed:",
      error.message,
    );

    throw new Error("Unable to retrieve public school knowledge.");
  }

  const records = data ?? [];

  if (records.length === 0) {
    return NO_MATCH_MESSAGE;
  }

  return records
    .map((record) => {
      const sourceType = record.source_type as KnowledgeSource;

      const details =
        SOURCE_DETAILS[sourceType] ?? {
          label: "School records",
          path: "/",
        };

      return [
        `Source: ${details.label}`,
        `Title: ${record.title}`,
        `Page: ${details.path}`,
        record.content,
      ].join("\n");
    })
    .join("\n\n---\n\n")
    .slice(0, 12_000);
}

export { NO_MATCH_MESSAGE };
