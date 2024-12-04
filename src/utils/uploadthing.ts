import {
  generateUploadButton,
  generateUploadDropzone,
} from "@uploadthing/react";

import { UploadRouter } from "@/uploadthing/server";

export const UploadButton = generateUploadButton<UploadRouter>();
export const UploadDropzone = generateUploadDropzone<UploadRouter>();
