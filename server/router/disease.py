from fastapi import APIRouter, UploadFile, File, HTTPException
from gradio_client import Client, handle_file
import shutil
import uuid
import os

router = APIRouter(prefix="/predict", tags=["Prediction"])

@router.post("/disease")
async def predict_disease(file: UploadFile = File(...)):
    try:
        # Create a unique filename in a temp folder
        temp_dir = "temp_uploads"
        os.makedirs(temp_dir, exist_ok=True)
        temp_path = os.path.join(temp_dir, f"{uuid.uuid4()}_{file.filename}")

        # Save the uploaded file
        with open(temp_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        # Call the Hugging Face model
        client = Client("biswa000/rice")
        result = client.predict(
            img=handle_file(temp_path),
            api_name="/predict"
        )

        # Clean up temp file
        os.remove(temp_path)

        return {"prediction": result}
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Prediction failed: {str(e)}")
