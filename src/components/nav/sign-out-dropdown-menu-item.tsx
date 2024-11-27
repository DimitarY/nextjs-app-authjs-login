"use client";

import { Icons } from "@/components/icons";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { signOut } from "next-auth/react";

export default function SignOutDropdownMenuItem() {
  return (
    <DropdownMenuItem
      onClick={() => signOut()}
      className="cursor-pointer gap-2"
    >
      <Icons.logOut />
      <span>Sign out</span>
    </DropdownMenuItem>
  );
}
