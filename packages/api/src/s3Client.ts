import { S3Client } from "@aws-sdk/client-s3";

console.log(
  process.env.OCI_REGION,
  process.env.OCI_ENDPOINT,
  process.env.OCI_ACCESS_KEY_ID,
  process.env.OCI_SECRET_ACCESS_KEY
);
export const s3Client = new S3Client({
  region: process.env.OCI_REGION,
  endpoint: process.env.OCI_ENDPOINT,
  forcePathStyle: true,
  credentials: {
    accessKeyId: process.env.OCI_ACCESS_KEY_ID as string,
    secretAccessKey: process.env.OCI_SECRET_ACCESS_KEY as string,
  },
});
