import { GeneralSettings } from "@/components/profile/general-settings";
import Auth from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function Settings() {
  const session = await Auth();

  if (!session) {
    redirect("/");
  }

  return (
    <div className="mx-auto max-w-4xl">
      <div className="grid gap-6">
        <GeneralSettings session={session} />
      </div>
    </div>
  );
}
