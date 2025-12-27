hyperlinked should be moved into CTA buttons, and link each of the CTa to a specific function.
Order now should display to something about the action so the user can type.
when you click on order now, takes you to the link
Call now should be linked

create a new

## Modeling the facility_profile table according to Buiness Requirments

1. Users should be able to search for facilities around them:

   - To do this, we include the `latitude` and `longitude` fields and store them as `doublePrecision` datatype. This makes it easier for PostGIS(a Postgres extension for handling geolocation data) to search records based on the datatype:

   - We include the `location` field as a geometry datatype and, passing it `point` and `srid` to be used by PostGIS

   - Then for fast lookups we create an index on the location field, not a `hash index` or `gin index` but a `gist index` for geolocations.

   - Add this line to the generated migration file to install the postgis extension in the database:
     ```sql
      CREATE EXTENSION IF NOT EXISTS postgis;
     ```

2. Facilty Owners/Managers may have more than one facility they are managing:

   - So we create a constraint, translating this Business requirement into the Database Relationship Cardinality by giving the relationship between `user_profile` and `facility_profile` as `one-to-many` respectively. Then we create a `hash index` on the facility_profile table for fast `owner_id` lookups.

   - The Architectural Strategy
     - When a user submits the registration form:
       - Check if the email already exists in the user table.- If New: Create the User and UserProfile.
       - If Existing: Authenticate the user (or link the session) and simply add a new row to facility_profile with their existing userId.

## Image Uploads - Architectural Decisions

- To handle image uploads I looked at the most common Object Storage providers, these usually include independent providers vs integrated cloud providers:
- Business Requirement: We are storing 6 images per facility, 1000 facility = 6000 images. If we assume 5mb per image, then we have 5 x 6000 = ~30gb
  - Independent:
    - Cloudinary:
      ```sql
       Pros:
        Gold Standard for Image Storage, Excels at on-the-fly Image Optimization
       Cons:
        Can get very expensive as we scale, remember
      ```
    - ImageKit:
      ```sql
       Pros:
        Similar to Cloudinary, offering on-the-fly image processing, generous free tier for bandwidth = 20GB Bandwidth. Where Bandwidth means the total amount of data that can be transfered out of the storage, occurs when users of the app view images(browser/app downloads it to display to users)
       Cons:
        Fewer "AI" features compared to Cloudinary but still gets the job done!
      ```
  - Cloud Providers:
    - AWS S3:
      ```sql
       Pros:
        Gold Standard for Image/Video Storage, very cheap ~$0.023/GB of storage
       Cons:
        No on-the-fly optimizations, you have to define Lambda functions to pick the images and optimize them later.
      ```
    - DigitalOcean Spaces:
      ```sql
       Pros:
        A cheaper alternative to AWS for Image/Video Storage, very cheap ~$0.007/GB/month of storage. For $5/month we can get 250GB, 1TB Bandwidth. This option can be the best since we plan on moving to a VPS and you meantioned going for this provider.
       Cons:
        No on-the-fly optimizations, you have to define bakcground jobs to pick the images and optimize them later.
      ```
    - OCI Object Storage
      ```sql
      Pros:
      A cheaper alternative to AWS for Image/Video Storage, very cheap ~$0.0255 per GB/month of storage.
      Cons:
      No on-the-fly optimizations, you have to define bakcground jobs to pick the images and optimize them later.
      ```

### Decision - Going with AWS S3 + Image Kit

- We can choose a hybrid design:

  - Storage (S3): Upload to /temporary/facility_id/image_01.jpg.

  - Review (ImageKit + Admin): Admin views the images via an ImageKit proxy URL pointing to the temporary folder.

  - Approval (The "Move"): You move the files in S3 from /temporary/... to /approved/.... This is good for security and lifecycle management (you can set S3 to auto-delete anything in /temporary older than 30 days).

  ```js
    When the Admin clicks "Approve" in your Next.js app, your tRPC procedure should:
     - List objects in temporary/facility_id/.
     - CopyObject to approved/facility_id/.
     - DeleteObject from temporary/facility_id/.
     - Update the DB with the new paths.
  ```

  - Database (The Fix): Only store the File Path/Key (e.g., approved/facility_id/image_01.jpg), not the full URL.
    - We only store the file path an not the entire url of Imagekit to avoid vendor lock-in, this way we can swtich to any other provider like Cloudinary without having to apply change our database fields.

### The ImageDropZone component

1. Client side state to hold and and display it locally
2. Create Route Handler/API Endpoint to generate AWS S3 Presigned URL
3. Call route handler on the client side to create pre-signed url
4. Use Presigned url to upload image

### Using ImageKit as the Bridge to fetch media from OCI Storage

- ImageKit provided global CDN, this means our images are cached and prevents multiple trips to the OCI Storage. This means we do not hit the Bandwidth Limits faster.
- How this works:
  1. Users wants to see an image we provide the {imageKit-url}/{filePath-for-image-saved-in-our-database}
  2. The request goes to ImageKit servers, it checks to see if it has this image cached, if it has then it will serve it without touching our OCI storage instance. If it hasn't then it goes to OCI Storage, gets the image, caches it and serves it.
- We step up the trpc procedure to handle fetching the images either through ImageKit or from OCI Storage bucket it self(if we do not want to cache the images). We used batch processing to generate the image cdn url or the presigned url, this means we reduce the number of API calls from 1x6images to 1 and return an array of urls

```ts
// Usage for React Native
const { data: images } = trpc.mediaStorage.getImages.useQuery({
  paths: facility.mediaUrls, // e.g. ["approved/1.jpg", "approved/2.jpg"]
  width: 400, // Smaller width for mobile performance
});
// To display the first image:
<FastImage source={{ uri: images?.[0]?.url }} style={styles.heroImage} />;

// Usage for Next
const { data: images } = trpc.media.getImages.useQuery({
  paths: pendingFacility.mediaUrls,
  isFacility: true, // Uses Presigned URLs for the Admin Review
  width: 800,
});
```
