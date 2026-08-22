import prisma from "@/lib/prisma";
import { createClient } from "@/utils/supabase/server";
import PostFormClient from "./PostFormClient";

export const dynamic = "force-dynamic";

export default async function QuickPostPage() {
  let userEmail: string | null = null;
  let userCompany: {
    id: string;
    name: string;
    location: string;
    logoUrl: string | null;
    about: string | null;
    email: string | null;
  } | null = null;

  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      userEmail = user.email ?? null;
      const company = await prisma.company.findFirst({
        where: {
          OR: [
            { authUserId: user.id },
            ...(user.email ? [{ email: user.email }] : []),
          ],
        },
      });

      if (company) {
        userCompany = {
          id: company.id,
          name: company.name,
          location: company.location,
          logoUrl: company.logoUrl,
          about: company.about,
          email: company.email,
        };
      }
    }
  } catch (error) {
    console.error("Failed to fetch user session in post page:", error);
  }

  return (
    <PostFormClient
      initialEmail={userEmail}
      initialCompany={userCompany}
    />
  );
}

