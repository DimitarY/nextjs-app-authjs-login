"use client";

import { Icons } from "@/components/icons";
import SignOutDropdownMenuItem from "@/components/nav/sign-out-dropdown-menu-item";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SheetClose } from "@/components/ui/sheet";
import { UserRole } from "@/db/schema/enumerated";
import { useIsMobile } from "@/hooks/use-is-mobile";
import { Session } from "next-auth";
import Link from "next/link";

export function AccountNav({ session }: { session: Session }) {
  const isMobile = useIsMobile();

  if (session) {
    const userName = session.user.name as string;
    const profileImage = session.user?.image as string;

    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon">
            <Avatar>
              <AvatarImage src={profileImage} alt={userName} />
              <AvatarFallback>
                {userName
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56">
          <DropdownMenuLabel>Welcome {session.user.name}</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem asChild>
              {isMobile ? (
                <SheetClose asChild>
                  <Link href="/profile" className="flex gap-2">
                    <Icons.user />
                    <span>Profile</span>
                  </Link>
                </SheetClose>
              ) : (
                <Link href="/profile" className="flex gap-2">
                  <Icons.user />
                  <span>Profile</span>
                </Link>
              )}
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              {isMobile ? (
                <SheetClose asChild>
                  <Link href="/profile/settings" className="flex gap-2">
                    <Icons.settings />
                    <span>Settings</span>
                  </Link>
                </SheetClose>
              ) : (
                <Link href="/profile/settings" className="flex gap-2">
                  <Icons.settings />
                  <span>Settings</span>
                </Link>
              )}
            </DropdownMenuItem>
          </DropdownMenuGroup>
          {session.user?.role === UserRole.Administrator && (
            <DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                {isMobile ? (
                  <SheetClose asChild>
                    <Link href="/dashboard" className="flex gap-2">
                      <Icons.dashboard />
                      <span>Admin panel</span>
                    </Link>
                  </SheetClose>
                ) : (
                  <Link href="/dashboard" className="flex gap-2">
                    <Icons.dashboard />
                    <span>Admin panel</span>
                  </Link>
                )}
              </DropdownMenuItem>
            </DropdownMenuGroup>
          )}
          {session.user?.role === UserRole.Moderator && (
            <DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                {isMobile ? (
                  <SheetClose asChild>
                    <Link href="/dashboard" className="flex gap-2">
                      <Icons.dashboard />
                      <span>Control panel</span>
                    </Link>
                  </SheetClose>
                ) : (
                  <Link href="/dashboard" className="flex gap-2">
                    <Icons.dashboard />
                    <span>Control panel</span>
                  </Link>
                )}
              </DropdownMenuItem>
            </DropdownMenuGroup>
          )}
          <DropdownMenuSeparator />
          <SignOutDropdownMenuItem />
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }
}
