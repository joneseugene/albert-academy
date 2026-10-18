import type { Database } from "@/types/database.types";
import type { createSupabaseServerClient } from "@/lib/supabase/server";

type PublicTables = Database["public"]["Tables"];

type TableName = keyof PublicTables;

type TableRow<TTable extends TableName> =
PublicTables[TTable]["Row"];

type TableInsert<TTable extends TableName> =
PublicTables[TTable]["Insert"];

type TableUpdate<TTable extends TableName> =
PublicTables[TTable]["Update"];

type SupabaseClient = Awaited<
ReturnType<typeof createSupabaseServerClient>

> ;

export function createCrud<TTable extends TableName>(
supabase: SupabaseClient,
table: TTable,
) {
return {
async findById(
id: string,
): Promise<TableRow<TTable> | null> {
const { data, error } = await supabase
.from(table)
.select("*")
.eq("id" as never, id)
.maybeSingle();


  if (error) {
    throw new Error(error.message);
  }

  return data as unknown as TableRow<TTable> | null;
},

async findMany(): Promise<TableRow<TTable>[]> {
  const { data, error } = await supabase
    .from(table)
    .select("*");

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []) as unknown as TableRow<TTable>[];
},

async insert(
  values: TableInsert<TTable>,
): Promise<TableRow<TTable>> {
  const { data, error } = await supabase
    .from(table)
    .insert(values as never)
    .select("*")
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data as unknown as TableRow<TTable>;
},

async update(
  id: string,
  values: TableUpdate<TTable>,
): Promise<TableRow<TTable>> {
  const { data, error } = await supabase
    .from(table)
    .update(values as never)
    .eq("id" as never, id)
    .select("*")
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data as unknown as TableRow<TTable>;
},

async delete(id: string) {
  const { error } = await supabase
    .from(table)
    .delete()
    .eq("id" as never, id);

  if (error) {
    throw new Error(error.message);
  }

  return {
    id,
    deleted: true as const,
  };
},


};
}
