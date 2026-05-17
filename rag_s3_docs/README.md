# SeattleU Campus Services RAG S3 Documents

This folder is formatted for Amazon Bedrock Knowledge Bases ingestion from S3.

## What is included

- One Markdown file per Campus Services content page
- One FAQ Markdown file per section
- Optional `.metadata.json` sidecar files for section/title/source metadata

## Recommended S3 upload

```bash
aws s3 sync ./rag_s3_docs s3://YOUR_BUCKET_NAME/campus-services-kb/ --delete
```

Then in Amazon Bedrock Knowledge Bases, set the S3 data source URI or inclusion prefix to:

```text
s3://YOUR_BUCKET_NAME/campus-services-kb/
```

After upload, click **Sync** in the Knowledge Base data source.
