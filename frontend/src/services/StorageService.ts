import { Storage } from "aws-amplify";
import { v4 as uuidv4 } from "uuid";

type UploadDatasetResult = {
  s3Keys: {
    raw: string;
    json: string;
  };
};

type ValidFileTypes = {
  [key: string]: string;
};

/**
 * Access Level `public` does not mean the S3 bucket is publicly accessible.
 * It just means that all valid and authenticated users in Badger will have
 * access to the uploaded datasets regardless of who uploaded it originally.
 *
 * Docs: https://docs.amplify.aws/lib/storage/configureaccess/q/platform/js
 */
const accessLevel = "public";
const serverSideEncryption = "aws:kms";
const rawFileTypes: ValidFileTypes = {
  "text/csv": ".csv",
};

async function downloadDataset(filename: string, title: string): Promise<File> {
  const data: any = await Storage.get(filename, {
    download: true,
    level: accessLevel,
    serverSideEncryption,
  });
  if (!data || !data.Body) {
    throw new Error("The filename is invalid");
  }
  data.Body.name = `${title}.csv`;
  return data.Body as File;
}

async function uploadDataset(
  rawFile: File,
  jsonFile: string
): Promise<UploadDatasetResult> {
  const mimeType = rawFile.type;
  const extension = rawFileTypes[mimeType as keyof ValidFileTypes];
  if (!extension) {
    throw new Error("Raw file is not an accepted format");
  }

  const s3Key = uuidv4();
  const rawS3Key = s3Key.concat(extension);
  await Storage.put(rawS3Key, rawFile, {
    level: accessLevel,
    /**
     * ContentDisposition metadata allows the original filename
     * to be preserved on the S3 object for future downloads.
     */
    contentDisposition: `attachment; filename="${rawFile.name}"`,
    contentType: mimeType,
    serverSideEncryption,
  });

  const jsonS3Key = s3Key.concat(".json");
  await Storage.put(jsonS3Key, jsonFile, {
    level: accessLevel,
    contentType: "application/json",
    serverSideEncryption,
  });

  return {
    s3Keys: {
      raw: rawS3Key,
      json: jsonS3Key,
    },
  };
}

export default {
  downloadDataset,
  uploadDataset,
};