 
 
import type { UploadRouter } from "@/server/api/routers";
import {
  generateUploadButton,
  generateUploadDropzone,
} from "@uploadthing/react";

export const UploadButton = generateUploadButton<UploadRouter>();
export const UploadDropzone = generateUploadDropzone<UploadRouter>();
