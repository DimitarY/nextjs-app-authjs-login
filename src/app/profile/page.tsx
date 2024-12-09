import ProfileInfo from "@/components/profile/profile-info";
import Auth from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function Settings() {
  const session = await Auth();

  if (!session) {
    redirect("/");
  }

  return (
    <ProfileInfo
      className="mx-auto max-w-4xl"
      name={session.user.name as string}
      image={session.user.image}
      joinedAt={session.user.joinedAt}
      selfView={true}
    />
  );
}
