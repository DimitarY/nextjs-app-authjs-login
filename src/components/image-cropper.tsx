// This code is modified version of https://github.com/sujjeee/shadcn-image-cropper

"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { CropIcon, Trash2Icon } from "lucide-react";
import {
  Dispatch,
  SetStateAction,
  useRef,
  useState,
  type SyntheticEvent,
} from "react";
import { FileWithPath } from "react-dropzone";
import ReactCrop, {
  centerCrop,
  makeAspectCrop,
  type Crop,
  type PixelCrop,
} from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";

export type FileWithPreview = FileWithPath & {
  preview: string;
};

interface ImageCropperProps {
  dialogOpen: boolean;
  setDialogOpenAction: Dispatch<SetStateAction<boolean>>;
  selectedFile: FileWithPreview | null;
  setSelectedFileAction: Dispatch<SetStateAction<FileWithPreview | null>>;
  setCroppedImageAction: Dispatch<SetStateAction<string>>;
}

export function ImageCropper({
  dialogOpen,
  setDialogOpenAction,
  selectedFile,
  setSelectedFileAction,
  setCroppedImageAction,
}: ImageCropperProps) {
  const aspect = 1;

  const imgRef = useRef<HTMLImageElement | null>(null);

  const [crop, setCrop] = useState<Crop>();
  const [croppedImageUrl, setCroppedImageUrl] = useState<string>("");
  const [croppedImage, setCroppedImage] = useState<string>("");

  function onImageLoad(e: SyntheticEvent<HTMLImageElement>) {
    if (aspect) {
      const { width, height } = e.currentTarget;
      setCrop(centerAspectCrop(width, height, aspect));
    }
  }

  async function onCropComplete(crop: PixelCrop) {
    if (imgRef.current && crop.width && crop.height) {
      try {
        const croppedBlob = await getCroppedImg(imgRef.current, crop);
        setCroppedImageUrl(URL.createObjectURL(croppedBlob));
      } catch (error) {
        console.error("Error cropping the image:", error);
      }
    }
  }

  function getCroppedImg(
    image: HTMLImageElement,
    crop: PixelCrop,
  ): Promise<Blob> {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement("canvas");
      const scaleX = image.naturalWidth / image.width;
      const scaleY = image.naturalHeight / image.height;

      canvas.width = crop.width * scaleX;
      canvas.height = crop.height * scaleY;

      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.imageSmoothingEnabled = false;

        ctx.drawImage(
          image,
          crop.x * scaleX,
          crop.y * scaleY,
          crop.width * scaleX,
          crop.height * scaleY,
          0,
          0,
          crop.width * scaleX,
          crop.height * scaleY,
        );

        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve(blob);
            } else {
              reject(new Error("Canvas to Blob conversion failed."));
            }
          },
          "image/png",
          1.0,
        );
      } else {
        reject(new Error("Failed to get canvas context."));
      }
    });
  }

  async function onCancel() {
    try {
      setCroppedImageAction("");
      setSelectedFileAction(null);
    } catch (error) {
      console.error("Image cropper: ", error);
    }
  }

  async function onCrop() {
    try {
      setCroppedImage(croppedImageUrl);
      setCroppedImageAction(croppedImageUrl);
      setDialogOpenAction(false);
    } catch (error) {
      console.error("Image cropper: ", error);
    }
  }

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpenAction}>
      <DialogTrigger>
        <Avatar className="size-36 cursor-pointer ring-2 ring-slate-200 ring-offset-2">
          <AvatarImage
            src={croppedImage ? croppedImage : selectedFile?.preview}
            alt="Profile image"
          />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
      </DialogTrigger>
      <DialogContent className="flex max-h-[90vh] w-[600px] max-w-[90vw] flex-col gap-0 p-4">
        <div className="flex-grow overflow-auto p-6">
          <ReactCrop
            crop={crop}
            onChange={(_, percentCrop) => setCrop(percentCrop)}
            onComplete={(c) => onCropComplete(c)}
            aspect={aspect}
            className="w-full"
          >
            <Avatar className="size-full rounded-none">
              <AvatarImage
                ref={imgRef}
                className="aspect-auto size-full rounded-none object-contain"
                alt="Image Cropper Shell"
                src={selectedFile?.preview}
                onLoad={onImageLoad}
              />
              <AvatarFallback className="size-full min-h-[460px] rounded-none">
                Loading...
              </AvatarFallback>
            </Avatar>
          </ReactCrop>
        </div>
        <DialogFooter className="flex shrink-0 flex-row justify-end space-x-2 p-6 pt-2">
          <DialogClose asChild>
            <Button
              size={"sm"}
              type="reset"
              className="w-fit"
              variant={"outline"}
              onClick={onCancel}
            >
              <Trash2Icon className="mr-1.5 size-4" />
              Cancel
            </Button>
          </DialogClose>
          <Button type="submit" size={"sm"} className="w-fit" onClick={onCrop}>
            <CropIcon className="mr-1.5 size-4" />
            Crop
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// Helper function to center the crop
export function centerAspectCrop(
  mediaWidth: number,
  mediaHeight: number,
  aspect: number,
): Crop {
  return centerCrop(
    makeAspectCrop(
      {
        unit: "%",
        width: 50,
        height: 50,
      },
      aspect,
      mediaWidth,
      mediaHeight,
    ),
    mediaWidth,
    mediaHeight,
  );
}
