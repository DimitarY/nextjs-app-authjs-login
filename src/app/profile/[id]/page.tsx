import ProfileInfo from "@/components/profile/profile-info";
import { GetUserById } from "@/db/querys";
import Auth from "@/lib/auth";
import { notFound, redirect } from "next/navigation";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function ProfileView({ params }: Props) {
  const session = await Auth();

  const resolvedParams = await params;

  if (session && session.user.id === resolvedParams.id) {
    redirect("/profile");
  }

  const user = await GetUserById(resolvedParams.id);

  if (!user) {
    notFound();
  }

  return (
    <ProfileInfo
      className="mx-auto max-w-4xl"
      name={user.name as string}
      image={user.image}
      joinedAt={user.joinedAt}
    />
  );
}
