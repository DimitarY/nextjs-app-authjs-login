import { DeleteAccount } from "@/components/profile/delete-account";
import { GeneralSettings } from "@/components/profile/general-settings";
import { ProfilePictureCard } from "@/components/profile/profile-picture";
import { SecuritySettings } from "@/components/profile/security-settings";
import Auth from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function Settings() {
  const session = await Auth();

  if (!session) {
    redirect("/");
  }

  const allowMagicLink = session.user.allowMagicLink;
  const magicLinkEnabled = session.user.useMagicLink;
  const hasPassword = session.user.hash;
  const accounts = session.user.accounts;
  const emailVerified = session.user.emailVerified != null;

  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-5">
      <ProfilePictureCard user={session.user} />
      <GeneralSettings user={session.user} />
      <SecuritySettings
        MagicLinkEnable={magicLinkEnabled}
        MagicLinkAllow={allowMagicLink}
        UsePassword={hasPassword}
        Accounts={accounts}
        EmailVerified={emailVerified}
      />
      <DeleteAccount />
    </div>
  );
}
