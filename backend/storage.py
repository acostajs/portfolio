from googleapiclient.discovery import build
from googleapiclient.http import MediaIoBaseUpload
from google.oauth2.credentials import Credentials
from google.auth.transport.requests import Request
from config import settings
import io
from fastapi import UploadFile

SCOPES = ["https://www.googleapis.com/auth/drive.file"]


def get_drive_service():
    if not (
        settings.GOOGLE_REFRESH_TOKEN
        and settings.GOOGLE_CLIENT_ID
        and settings.GOOGLE_CLIENT_SECRET
    ):
        return None

    creds = Credentials(
        token=None,
        refresh_token=settings.GOOGLE_REFRESH_TOKEN,
        client_id=settings.GOOGLE_CLIENT_ID,
        client_secret=settings.GOOGLE_CLIENT_SECRET,
        token_uri=settings.GOOGLE_TOKEN_URI,
    )

    if not creds.valid:
        try:
            creds.refresh(Request())
        except Exception:
            return None

    return build("drive", "v3", credentials=creds)


async def upload_file(file: UploadFile, folder: str = "projects") -> str:
    """
    Uploads a file to Google Drive and returns a direct download link.
    Uses OAuth2 Refresh Token flow.
    """
    service = get_drive_service()
    if not service:
        raise Exception("Google Drive service not initialized")

    file_metadata = {
        "name": file.filename,
        "parents": [settings.GOOGLE_DRIVE_FOLDER_ID.strip()],
    }

    # Read file content
    content = await file.read()
    media = MediaIoBaseUpload(
        io.BytesIO(content), mimetype=file.content_type, resumable=True
    )

    try:
        # 1. Create the file
        uploaded_file = (
            service.files()
            .create(
                body=file_metadata,
                media_body=media,
                fields="id, webContentLink, webViewLink",
                supportsAllDrives=True,
            )
            .execute()
        )
        file_id = uploaded_file.get("id")

        # 2. Ensure the file is accessible (anyone with link)
        try:
            service.permissions().create(
                fileId=file_id,
                supportsAllDrives=True,
                body={"type": "anyone", "role": "reader"},
            ).execute()
        except Exception:
            pass

    except Exception as e:
        import logging

        logger = logging.getLogger("backend")
        logger.error(f"Google Drive Upload Failed: {e}")
        # Provide a more helpful error message if it's a 404
        if "File not found" in str(e):
            raise Exception(
                f"Drive Folder '{settings.GOOGLE_DRIVE_FOLDER_ID}' not found or inaccessible."
            )
        raise e

    # Direct download link format that works in <img> tags
    # We prefer the uc?id format as it's the most direct for images
    return f"https://drive.google.com/uc?id={file_id}"


def delete_file(file_url: str):
    """
    Deletes a file from Google Drive based on its URL/ID.
    """
    if not file_url:
        return

    # Extract ID from direct link: https://drive.google.com/uc?id={ID}
    import re

    match = re.search(r"id=([a-zA-Z0-9_-]+)", file_url)
    if match:
        file_id = match.group(1)
        service = get_drive_service()
        if service:
            try:
                service.files().delete(fileId=file_id, supportsAllDrives=True).execute()
                import logging

                logger = logging.getLogger("backend")
                logger.info(f"Successfully deleted file {file_id} from Drive")
            except Exception as e:
                import logging

                logger = logging.getLogger("backend")
                logger.error(f"Error deleting file from Drive: {e}")
