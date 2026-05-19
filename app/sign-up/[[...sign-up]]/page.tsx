import { SignUp } from "@clerk/nextjs";
import { Zap } from "lucide-react";
import Link from "next/link";

export default function SignUpPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-950 px-4">
      <Link href="/" className="mb-8 flex items-center gap-2">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600">
          <Zap className="h-5 w-5 text-white" />
        </div>
        <span className="text-xl font-black text-white">omgskill<span className="text-indigo-400">.ai</span></span>
      </Link>
      <SignUp forceRedirectUrl="/onboarding" />
    </div>
  );
}
