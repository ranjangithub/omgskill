import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getUser } from "@/lib/db";
import { hasAnyAdminAccess } from "@/lib/admin";
import { PinEntry } from "@/components/admin/PinEntry";
import { getAdminPin } from "@/lib/admin-auth";

interface Props {
  searchParams: Promise<{ next?: string }>;
}

export default async function AdminUnlockPage({ searchParams }: Props) {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const dbUser = getUser(userId);
  if (!dbUser?.onboarded) redirect("/onboarding");

  if (!hasAnyAdminAccess(userId)) redirect("/dashboard");

  const { next } = await searchParams;
  const redirectTo = next && next.startsWith("/dashboard/admin") ? next : "/dashboard/admin";

  // In dev: if ADMIN_PIN is not set, allow bypass without entering digits
  const noPinRequired = process.env.NODE_ENV !== "production" && !getAdminPin();

  return (
    <div className="flex min-h-dvh items-center justify-center bg-slate-900 px-4">
      <PinEntry redirectTo={redirectTo} noPinRequired={noPinRequired} />
    </div>
  );
}
