"use client";

import { FormError, FormSuccess } from "@/components/form-message";
import { FileWithPreview, ImageCropper } from "@/components/image-cropper";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { GeneralSettings_Profile } from "@/schemas/settings";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Session } from "next-auth";
import { useCallback, useState } from "react";
import { FileWithPath, useDropzone } from "react-dropzone";
import { useForm } from "react-hook-form";
import { z } from "zod";

function ProfilePictureUpdate({
  className,
  name,
  image,
}: {
  className?: string;
  name: string;
  image: string;
}) {
  const { toast } = useToast();

  const [selectedFile, setSelectedFile] = useState<FileWithPreview | null>(
    null,
  );
  const [isDialogOpen, setDialogOpen] = useState(false);

  const [croppedImage, setCroppedImage] = useState<string>("");

  const accept = {
    "image/*": [],
  };

  const onDrop = useCallback(
    (acceptedFiles: FileWithPath[]) => {
      const file = acceptedFiles[0];
      if (!file) {
        toast({
          variant: "destructive",
          title: "Something went wrong",
          description: "Selected image is too large!",
        });
        return;
      }

      const fileWithPreview = Object.assign(file, {
        preview: URL.createObjectURL(file),
      });

      setSelectedFile(fileWithPreview);
      setDialogOpen(true);
    },
    [toast],
  );

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept,
    multiple: false,
  });

  // TODO: Implement image upload and database update
  console.log("Content cropped image URL: ", croppedImage);

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-3 p-2",
        className,
      )}
    >
      {selectedFile ? (
        <ImageCropper
          dialogOpen={isDialogOpen}
          setDialogOpenAction={setDialogOpen}
          selectedFile={selectedFile}
          setSelectedFileAction={setSelectedFile}
          setCroppedImageAction={setCroppedImage}
        />
      ) : (
        <Avatar
          {...getRootProps()}
          className="size-36 cursor-pointer ring-2 ring-slate-200 ring-offset-2"
        >
          <input {...getInputProps()} />
          <AvatarImage src={image} alt="Profile picture" />
          <AvatarFallback>
            {name
              .split(" ")
              .map((n) => n[0])
              .join("")
              .toUpperCase()}
          </AvatarFallback>
        </Avatar>
      )}
      {croppedImage && <Button>Upload</Button>}
    </div>
  );
}

function ProfileInformationUpdateForm({
  name,
  email,
}: {
  name: string;
  email: string;
}) {
  const [success, setSuccess] = useState<string>("");
  const [error, setError] = useState<string>("");

  const {
    mutate: server_ProfileInformationUpdateAction,
    isPending: server_ProfileInformationUpdateIsPending,
  } = useMutation({
    mutationFn: async (values: z.infer<typeof GeneralSettings_Profile>) => {
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
  });

  const form = useForm<z.infer<typeof GeneralSettings_Profile>>({
    resolver: zodResolver(GeneralSettings_Profile),
    defaultValues: {
      name: name || "",
      email: email || "",
    },
  });

  const onSubmit = async (values: z.infer<typeof GeneralSettings_Profile>) => {
    server_ProfileInformationUpdateAction(values);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  disabled={server_ProfileInformationUpdateIsPending}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  type="email"
                  disabled={server_ProfileInformationUpdateIsPending}
                />
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
          disabled={server_ProfileInformationUpdateIsPending}
        >
          Save changes
        </Button>
      </form>
    </Form>
  );
}

export function GeneralSettings({ session }: { session: Session }) {
  const user_Name = session.user.name || "";
  const user_Email = session.user.email || "";
  const user_Image = session.user.image || "";

  return (
    <Card>
      <CardHeader>
        <CardTitle>General settings</CardTitle>
        <CardDescription>
          Manage your account settings and profile information.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ProfilePictureUpdate name={user_Name} image={user_Image} />
        <hr className="mx-auto my-4 border-gray-800 dark:border-white" />
        <ProfileInformationUpdateForm name={user_Name} email={user_Email} />
      </CardContent>
      <CardFooter></CardFooter>
    </Card>
  );
}
