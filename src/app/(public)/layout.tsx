
import type { ReactNode } from "react";

import { SchoolChatbot } from "@/components/shared/SchoolChatBot";

export default function PublicLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <>
      {children}
      <SchoolChatbot />
    </>
  );
}
