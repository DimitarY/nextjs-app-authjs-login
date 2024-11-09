import { SignUpForm } from "@/components/auth/signup-form";

export default function Signup() {
  return (
    <div className="mx-6 mt-2 flex flex-row items-center justify-center gap-2">
      <SignUpForm className="rounded-lg bg-gradient-to-br from-slate-200 to-slate-300 p-4 dark:from-zinc-800 dark:to-zinc-900 dark:text-white" />
    </div>
  );
}
