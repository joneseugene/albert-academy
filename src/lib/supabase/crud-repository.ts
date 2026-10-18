import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database.types";

type PublicTables = Database["public"]["Tables"];

type TableName = keyof PublicTables;

type TableRow<TTable extends TableName> =
  PublicTables[TTable]["Row"];

type TableInsert<TTable extends TableName> =
  PublicTables[TTable]["Insert"];

type TableUpdate<TTable extends TableName> =
  PublicTables[TTable]["Update"];

export class CrudRepository<TTable extends TableName> {
  constructor(
    protected readonly client: SupabaseClient<Database>,
    protected readonly table: TTable,
  ) {}

  async findById(
    id: string,
  ): Promise<TableRow<TTable> | null> {
    const { data, error } = await this.client
      .from(this.table)
      .select("*")
      .eq("id" as never, id)
      .maybeSingle();

    if (error) {
      throw new Error(error.message);
    }

    return data as unknown as TableRow<TTable> | null;
  }

  async findMany(): Promise<TableRow<TTable>[]> {
    const { data, error } = await this.client
      .from(this.table)
      .select("*");

    if (error) {
      throw new Error(error.message);
    }

    return (data ?? []) as unknown as TableRow<TTable>[];
  }

  async insert(
    values: TableInsert<TTable>,
  ): Promise<TableRow<TTable>> {
    const { data, error } = await this.client
      .from(this.table)
      .insert(values as never)
      .select("*")
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return data as unknown as TableRow<TTable>;
  }

  async update(
    id: string,
    values: TableUpdate<TTable>,
  ): Promise<TableRow<TTable>> {
    const { data, error } = await this.client
      .from(this.table)
      .update(values as never)
      .eq("id" as never, id)
      .select("*")
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return data as unknown as TableRow<TTable>;
  }

  async delete(id: string) {
    const { error } = await this.client
      .from(this.table)
      .delete()
      .eq("id" as never, id);

    if (error) {
      throw new Error(error.message);
    }

    return {
      id,
      deleted: true,
    };
  }
}