export const dynamic = "force-dynamic";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  CalendarDays,
  GraduationCap,
  UserRound,
} from "lucide-react";
import { getNotableRecords } from "@/lib/action/notable.action";
import Image from "next/image";

interface NotableDetailPageProps {
  params: Promise<{ id: string }>;
}

function formatDate(value: string | null | undefined): string {
  if (!value) return "Not available";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "Not available";

  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}

export default async function NotableDetailPage({
  params,
}: NotableDetailPageProps) {
  const { id } = await params;

  const result = await getNotableRecords();

  if (!result.success) {
    throw new Error(result.message || "Unable to load this profile.");
  }

  const person = (result.data ?? []).find((record) => record.id === id);

  if (!person) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <Link
          href="/notable"
          className="mb-8 inline-flex items-center gap-2 rounded-lg text-sm font-medium text-slate-600 transition hover:text-[#7A1523]"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to notable people
        </Link>

        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="h-2 bg-[#7A1523]" />

          <div className="p-6 sm:p-10">
            <div className="flex flex-col gap-7 sm:flex-row sm:items-start">
              <div className="flex h-32 w-32 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-slate-200 bg-slate-100">
                {person.photo ? (
                  <Image
                    src={person.photo}
                    alt={person.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <UserRound className="h-14 w-14 text-slate-400" />
                )}
              </div>

              <div className="min-w-0 flex-1">
                <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-[#7A1523]">
                  Albert Academy · Notable People
                </p>

                <h1 className="break-words text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                  {person.name}
                </h1>

                {person.title && (
                  <p className="mt-3 flex items-center gap-2 text-base text-slate-600">
                    <GraduationCap className="h-5 w-5 shrink-0 text-[#7A1523]" />
                    {person.title}
                  </p>
                )}

                <div className="mt-5 flex flex-wrap items-center gap-2 text-sm text-slate-500">
                  <CalendarDays className="h-4 w-4" />
                  <span>
                    Added on {formatDate(person.created_at)}
                  </span>
                </div>
              </div>
            </div>

            <div className="my-8 border-t border-slate-200" />

            <div className="grid gap-8 md:grid-cols-[minmax(0,1fr)_260px]">
              <article className="min-w-0">
                <h2 className="text-lg font-semibold text-slate-900">
                  Biography
                </h2>

                <div className="mt-4 whitespace-pre-wrap break-words text-sm leading-7 text-slate-600">
                  {person.detail?.trim() ||
                    person.description?.trim() ||
                    "No biography has been added for this profile yet."}
                </div>

                {person.description?.trim() &&
                  person.detail?.trim() &&
                  person.description.trim() !== person.detail.trim() && (
                    <section className="mt-8">
                      <h2 className="text-lg font-semibold text-slate-900">
                        Overview
                      </h2>
                      <p className="mt-4 whitespace-pre-wrap break-words text-sm leading-7 text-slate-600">
                        {person.description}
                      </p>
                    </section>
                  )}
              </article>

              <aside className="h-fit rounded-xl border border-slate-200 bg-slate-50 p-5">
                <h2 className="text-sm font-semibold text-slate-900">
                  Profile information
                </h2>

                <dl className="mt-5 space-y-4 text-sm">
                  <div>
                    <dt className="text-slate-500">Full name</dt>
                    <dd className="mt-1 break-words font-medium text-slate-800">
                      {person.name}
                    </dd>
                  </div>

                  <div>
                    <dt className="text-slate-500">Title</dt>
                    <dd className="mt-1 break-words font-medium text-slate-800">
                      {person.title || "Not specified"}
                    </dd>
                  </div>

                  <div>
                    <dt className="text-slate-500">Date added</dt>
                    <dd className="mt-1 font-medium text-slate-800">
                      {formatDate(person.created_at)}
                    </dd>
                  </div>

                  <div>
                    <dt className="text-slate-500">Last updated</dt>
                    <dd className="mt-1 font-medium text-slate-800">
                      {formatDate(person.updated_at)}
                    </dd>
                  </div>
                </dl>
              </aside>
            </div>

            <div className="mt-10 border-t border-slate-200 pt-6">
              <Link
                href="/notable"
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:border-[#7A1523] hover:text-[#7A1523]"
              >
                <ArrowLeft className="h-4 w-4" />
                Return to all notable people
              </Link>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}