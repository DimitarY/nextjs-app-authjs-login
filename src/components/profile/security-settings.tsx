"use client";

import { FormError, FormSuccess } from "@/components/form-message";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { SecuritySettings_Password } from "@/schemas/settings";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { z } from "zod";

function PasswordUpdateForm() {
  const [success, setSuccess] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [passwordVisible, setPasswordVisible] = useState<boolean>(false);

  useEffect(() => {
    let successTimer: NodeJS.Timeout | undefined;
    let errorTimer: NodeJS.Timeout | undefined;

    if (success) {
      successTimer = setTimeout(() => {
        setSuccess("");
      }, 5000);
    }

    if (error) {
      errorTimer = setTimeout(() => {
        setError("");
      }, 5000);
    }

    // Cleanup both timers
    return () => {
      if (successTimer) clearTimeout(successTimer);
      if (errorTimer) clearTimeout(errorTimer);
    };
  }, [success, error]);

  const {
    mutate: server_PasswordUpdateAction,
    isPending: server_PasswordUpdateIsPending,
  } = useMutation({
    mutationFn: async (values: z.infer<typeof SecuritySettings_Password>) => {
      // Simulate API call (replace with actual API request logic)
      console.log(values);
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({ success: true });
        }, 1000);
      });
    },
    onMutate: () => {
      setSuccess("");
      setError("");
    },
    onSuccess: () => {
      setSuccess("Profile information updated successfully");
    },
    onError: () => {
      setError("An unexpected error occurred. Please try again.");
    },
    onSettled: () => {
      form.setValue("currentPassword", "");
      form.setValue("newPassword", "");
      setPasswordVisible(false);
    },
  });

  const form = useForm<z.infer<typeof SecuritySettings_Password>>({
    resolver: zodResolver(SecuritySettings_Password),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
    },
  });

  const onSubmit = async (
    values: z.infer<typeof SecuritySettings_Password>,
  ) => {
    server_PasswordUpdateAction(values);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="currentPassword"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input
                  {...field}
                  type="password"
                  disabled={server_PasswordUpdateIsPending}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="newPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>New Password</FormLabel>
              {/*TODO: Add password strength meter*/}
              <FormControl>
                <div className="relative">
                  <Input
                    {...field}
                    type={passwordVisible ? "text" : "password"}
                    disabled={server_PasswordUpdateIsPending}
                  />
                  <button
                    type="button"
                    onClick={() => setPasswordVisible(!passwordVisible)}
                    className="absolute right-2 top-2 pr-1 text-gray-500"
                  >
                    {passwordVisible ? (
                      <FaEyeSlash className="h-5 w-5" />
                    ) : (
                      <FaEye className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormSuccess message={success} />
        <FormError message={error} />
        <Button
          variant="default"
          type="submit"
          disabled={server_PasswordUpdateIsPending}
        >
          Update password
        </Button>
      </form>
    </Form>
  );
}

export function SecuritySettings() {
  const {
    mutate: server_LogoutFromAllDevicesAction,
    isPending: server_LogoutFromAllDevicesIsPending,
  } = useMutation({
    mutationFn: async () => {
      // Simulate API call (replace with actual API request logic)
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({ success: true });
        }, 1000);
      });
    },
    onSuccess: () => {
      toast({
        title: "Success!",
        description: "Successfully logged out from all devices.",
      });
    },
    onError: () => {
      toast({
        title: "Error!",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    },
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Security</CardTitle>
        <CardDescription>Manage your security preferences</CardDescription>
      </CardHeader>
      <CardContent>
        <PasswordUpdateForm />
        <hr className="mx-auto my-4 border-gray-800 dark:border-white" />
        <div className="flex items-center justify-between">
          <div>
            <p className="text-base font-medium">Logout</p>
            <p className="text-sm text-muted-foreground">
              Logout from all devices
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              server_LogoutFromAllDevicesAction();
            }}
            disabled={server_LogoutFromAllDevicesIsPending}
          >
            Logout from all devices
          </Button>
        </div>
      </CardContent>
      <CardFooter></CardFooter>
    </Card>
  );
}
