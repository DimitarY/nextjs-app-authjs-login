"use client";

import { cn } from "@/lib/utils";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

enum Error {
  Configuration = "Configuration",
  OAuthAccountNotLinked = "OAuthAccountNotLinked",
}

const errorMap = {
  [Error.Configuration]: (
    <p>
      There is a problem with the authentication attempt. Please contact us if
      this error persists.
    </p>
  ),
  [Error.OAuthAccountNotLinked]: (
    <p>
      An account with the same email address already exists. Please sign in with
      that email or linked provider.
    </p>
  ),
};

interface AuthErrorMessageProps {
  className?: string;
}

function AuthError({ className }: AuthErrorMessageProps) {
  const search = useSearchParams();
  const error = search.get("error") as Error;

  if (error != null) {
    return (
      <div
        className={cn(
          "flex w-full flex-col items-center justify-center",
          className,
        )}
      >
        <div className="flex w-full max-w-sm flex-col items-center justify-center rounded-lg border border-gray-200 bg-destructive p-6 text-center text-destructive">
          <h5 className="mb-2 flex flex-row items-center justify-center gap-2 text-xl font-bold tracking-tight text-gray-900 dark:text-white">
            Something went wrong
          </h5>
          <div className="font-normal text-gray-700 dark:text-gray-400">
            {errorMap[error] || "Please contact us if this error persists."}
          </div>
        </div>
      </div>
    );
  } else {
    return null;
  }
}

export function AuthErrorMessage({ className }: AuthErrorMessageProps) {
  return (
    <Suspense>
      <AuthError className={className} />
    </Suspense>
  );
}
