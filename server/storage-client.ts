import { Client } from "@replit/object-storage";

export const BUCKET_ID = "replit-objstore-1602003e-c497-4744-9460-73f4bbb787b9";

export const storageClient = new Client({
  bucketId: BUCKET_ID
});
