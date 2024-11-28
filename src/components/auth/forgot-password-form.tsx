"use client";

import { FormError, FormSuccess } from "@/components/form-message";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { ForgotPasswordSchema } from "@/schemas/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

interface ForgotPasswordFormProps {
  className?: string;
}

export function ForgotPasswordForm({ className }: ForgotPasswordFormProps) {
  const [success, setSuccess] = useState<string>("");
  const [error, setError] = useState<string>("");

  const {
    mutate: server_ForgotPasswordAction,
    isPending: server_ForgotPasswordIsPending,
  } = useMutation({
    mutationFn: async (values: z.infer<typeof ForgotPasswordSchema>) => {
      console.log(values);
    },
    onMutate: () => {
      setSuccess("");
      setError("");
    },
    onSuccess: () => {
      setSuccess("Password reset email sent! Please check your inbox.");
    },
    onError: () => {
      setError("An unexpected error occurred. Please try again.");
    },
  });

  const form = useForm<z.infer<typeof ForgotPasswordSchema>>({
    resolver: zodResolver(ForgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof ForgotPasswordSchema>) => {
    server_ForgotPasswordAction(values);
  };

  return (
    <div className={cn("flex flex-col justify-center gap-1 p-4", className)}>
      <div className="space-y-2 text-left">
        <h1 className="text-3xl">Reset Your Password</h1>
        <p className="">
          Type in your email and we&#39;ll send you a link to reset your
          password
        </p>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="w-full">
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="you@example.com"
                      {...field}
                      type="email"
                      disabled={server_ForgotPasswordIsPending}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormSuccess message={success} />
            <FormError message={error} />
            <Button
              className="w-full"
              variant="default"
              type="submit"
              disabled={server_ForgotPasswordIsPending}
            >
              Register
            </Button>
          </div>
        </form>
      </Form>
      <div className="mt-1 gap-1 text-center text-sm font-medium">
        <span>Already have an account? </span>
        <Link href="/auth/sign-in" className="underline">
          Sign in
        </Link>
      </div>
    </div>
  );
}
