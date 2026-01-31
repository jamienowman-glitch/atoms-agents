
import boto3
import os
from botocore.exceptions import ClientError

class StorageService:
    def __init__(self):
        # boto3 automatically looks for credentials in:
        # 1. Environment Variables (AWS_ACCESS_KEY_ID, etc.)
        # 2. ~/.aws/credentials (Shell)
        # 3. IAM Role (if on EC2/CloudRun)
        self.s3_client = boto3.client('s3')
        # Bucket from Architecture Map
        self.bucket_name = "northstar-media-dev"

    def get_presigned_url(self, object_name: str, file_type: str, expiration=3600):
        """Generate a presigned URL to share an S3 object."""
        try:
            response = self.s3_client.generate_presigned_post(
                Bucket=self.bucket_name,
                Key=object_name,
                Fields={"Content-Type": file_type},
                Conditions=[
                    {"bucket": self.bucket_name},
                    ["starts-with", "$key", object_name],
                    {"Content-Type": file_type}
                ],
                ExpiresIn=expiration
            )
            return response
        except ClientError as e:
            print(f"S3 Error: {e}")
            return None
