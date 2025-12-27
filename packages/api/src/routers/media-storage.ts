import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { GetObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import { protectedProcedure, router } from "../trpc";
import z from "zod";
import { s3Client } from "../s3Client";

export const storageRouter = router({
  getPresignedUploadUrl: protectedProcedure
    .input(
      z.object({
        // The pending_id from the client
        uniqueKey: z.string(),
        fileType: z.string(),
        fileSize: z.number(),
      })
    )
    .mutation(async ({ input }) => {
      const { fileType, uniqueKey, fileSize } = input;

      const command = new PutObjectCommand({
        Bucket: process.env.OCI_BUCKET_NAME,
        Key: uniqueKey,
        ContentType: fileType,
        // ContentLength: fileSize,
      });

      const url = await getSignedUrl(s3Client, command, { expiresIn: 3600 });

      return { url, uniqueKey };
    }),

  // get image from OCI bucket, no caching until it's approved developed for facility approval
  getImageUrl: protectedProcedure
    .input(
      z.object({
        paths: z.array(z.string()),
        isFacility: z.boolean().default(false),
        width: z.number().default(600),
      })
    )
    .query(async ({ input }) => {
      const { paths, isFacility, width } = input;
      const cdnUrl = process.env.IMAGE_BASE_URL;
      const baseUrl = cdnUrl?.endsWith("/") ? cdnUrl : `${cdnUrl}/`;

      // Process all paths in parallel
      const results = await Promise.all(
        paths.map(async (path) => {
          if (isFacility) {
            // Private/Admin Path: Generate Presigned URL
            const command = new GetObjectCommand({
              Bucket: process.env.OCI_BUCKET_NAME,
              Key: path,
            });

            const url = await getSignedUrl(s3Client, command, {
              expiresIn: 900,
            });
            return { path, url };
          }

          // Public/CDN Path: Generate Optimized URL
          return {
            path,
            url: `${baseUrl}tr:w-${width},q-70,f-auto/${path}`,
          };
        })
      );

      return results; // Returns Array<{ path: string, url: string }>
    }),
});
