import pytest
from unittest.mock import MagicMock, patch
from fastapi import UploadFile
import io
import storage


@pytest.mark.asyncio
async def test_upload_file_mocked():
    # Mock Drive Service
    mock_service = MagicMock()
    mock_files = MagicMock()
    mock_create = MagicMock()

    mock_service.files.return_value = mock_files
    mock_files.create.return_value = mock_create
    mock_create.execute.return_value = {
        "id": "test_drive_id",
        "webContentLink": "https://drive.google.com/uc?id=test_drive_id&export=download",
    }

    # Mock UploadFile
    content = b"fake image content"
    from starlette.datastructures import Headers

    file = UploadFile(
        filename="test.png",
        file=io.BytesIO(content),
        headers=Headers({"content-type": "image/png"}),
    )

    with patch("storage.get_drive_service", return_value=mock_service):
        url = await storage.upload_file(file, folder="projects")

        assert "id=test_drive_id" in url
        mock_files.create.assert_called_once()
        # Verify it was called with parents and supportsAllDrives
        args, kwargs = mock_files.create.call_args
        assert "parents" in kwargs["body"]
        assert kwargs["supportsAllDrives"] is True


@pytest.mark.asyncio
async def test_delete_file_mocked():
    mock_service = MagicMock()
    mock_files = MagicMock()
    mock_delete = MagicMock()

    mock_service.files.return_value = mock_files
    mock_files.delete.return_value = mock_delete

    file_url = "https://drive.google.com/uc?id=test_drive_id&export=download"

    with patch("storage.get_drive_service", return_value=mock_service):
        storage.delete_file(file_url)

        mock_files.delete.assert_called_with(
            fileId="test_drive_id", supportsAllDrives=True
        )
        mock_delete.execute.assert_called_once()
