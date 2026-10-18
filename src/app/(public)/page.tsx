import type { Metadata } from "next";

import { SiteFooter } from "@/components/layout/public/site-footer";
import { SiteHeader } from "@/components/layout/public/site-header";
import { AboutSection } from "@/features/public/about-section";
import { ContactSection } from "@/features/public/contact-section";
import { DidYouKnowSection } from "@/features/public/did-you-know-section";
import { HeroSection } from "@/features/public/hero-section";
import { HistorySection } from "@/features/public/history-section";
import { MediaSection } from "@/features/public/media-section";
import { PeopleSection } from "@/features/public/people-section";
import { SchoolSongSection } from "@/features/public/school-song-section";
import { getRandomPublishedDidYouKnowRecord } from "@/lib/service/did.you.know.service";
import { getRandomMediaRecords } from "@/lib/service/media.service";
import { PHOTO_BUCKETS, createPhotoStorage } from "@/lib/supabase/photo-storage";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getRandomAcademicRecords } from "@/lib/service/academic.service";
import { AcademicResourcesSection } from "@/features/public/academic-section";
import { ScrollToTop } from "@/components/layout/public/scroll-to-top";

export const metadata: Metadata = {
  title: "Albert Academy",
  description:
    "Albert Academy — a distinguished institution in Sierra Leone, preserving heritage and preparing generations for the future.",
};

export default async function HomePage() {
  const supabase = await createSupabaseServerClient();
  const photoStorage = createPhotoStorage(supabase);
  const fact = await getRandomPublishedDidYouKnowRecord();

  // Media
  const mediaRecords = await getRandomMediaRecords(4);
  const media = mediaRecords.map((record) => {
    const photo = record.photo?.trim() ?? "";

    return {
      id: record.id,
      name: record.name,
      photoUrl: !photo
        ? null
        : /^https?:\/\//i.test(photo)
          ? photo
          : photoStorage.getPublicUrl(PHOTO_BUCKETS.media, photo),
    };
  });

  // Academic Resources
  const academicRecords = await getRandomAcademicRecords(4);
  const academicResources = academicRecords.map((record) => {
  const photo = record.photo?.trim() ?? "";

  return {
    id: record.id,
    name: record.name,
    link: record.link?.trim() || null,
    photoUrl: !photo
      ? null
      : /^https?:\/\//i.test(photo)
        ? photo
        : photoStorage.getPublicUrl(PHOTO_BUCKETS.academic, photo),
  };
});

  return (
    <main className="min-h-dvh bg-background">
      <SiteHeader />
      <HeroSection />
      <AboutSection />
      <DidYouKnowSection facts={fact ? [fact] : []} />
      <HistorySection />
      <PeopleSection />
      <SchoolSongSection />
      <AcademicResourcesSection resources={academicResources} />
      <MediaSection media={media} />
      <ContactSection />
      <SiteFooter />
      <ScrollToTop />
    </main>
  );
}
