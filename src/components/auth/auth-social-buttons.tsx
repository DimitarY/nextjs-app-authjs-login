import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { FcGoogle } from "react-icons/fc";
import { VscGithubAlt } from "react-icons/vsc";

interface MessageProps {
  className?: string;
}

export function AuthSocialButtons({ className }: MessageProps) {
  const onClick = (provider: "google" | "github") => {
    console.log(provider);
  };

  return (
    <div className={cn("grid w-full items-center gap-2", className)}>
      <Button
        size="lg"
        className="w-full rounded-md border border-gray-300 bg-white text-black hover:bg-gray-100 dark:border-gray-600 dark:bg-white dark:text-black dark:hover:bg-gray-100"
        variant="link"
        onClick={() => onClick("google")}
      >
        <FcGoogle className="h-5 w-5" />
      </Button>
      <Button
        size="lg"
        className="w-full rounded-md border border-gray-300 bg-white text-black hover:bg-gray-100 dark:border-gray-600 dark:bg-black dark:text-white dark:hover:bg-gray-800"
        variant="link"
        onClick={() => onClick("github")}
      >
        <VscGithubAlt className="h-5 w-5" />
      </Button>
    </div>
  );
}
