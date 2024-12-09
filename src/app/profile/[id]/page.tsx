import ProfileInfo from "@/components/profile/profile-info";
import { GetUserById } from "@/db/querys";
import { notFound } from "next/navigation";

type Props = {
  params: { id: string };
};

export default async function ProfileView({ params }: Props) {
  const user = await GetUserById(params.id);

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
