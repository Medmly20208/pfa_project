from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import pickle
import numpy as np
from fastapi.middleware.cors import CORSMiddleware



# Load the saved model
model_path = "model.pkl"
with open(model_path, 'rb') as f:
    model = pickle.load(f)
# Initialize FastAPI app
app = FastAPI()
# Allow CORS from your frontend (localhost:5173)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173","localhost:5173","https://pfaproject.netlify.app","pfaproject.netlify.app"],  # or use ["*"] to allow all origins (not recommended for production)
    allow_credentials=True,
    allow_methods=["*"],  # allows all methods (GET, POST, etc.)
    allow_headers=["*"],  # allows all headers
)

# Define request body structure using Pydantic
class PredictionRequest(BaseModel):
    # List of features for prediction
    features: list[float]




# Root endpoint to check if the service is running
@app.get("/")
def read_root():
    return {"message": "Model Deployment API is running!"}
# Prediction endpoint
@app.post("/predict")
def predict(request: PredictionRequest):
    try:
   
       features = np.array(request.features).reshape(1, -1)
       # Perform prediction using the loaded model
       prediction = model.predict(features)
       # Return the prediction result
       return {"prediction": int(prediction[0])}
    except Exception as e:
      
        raise HTTPException(status_code=400,detail=str(e))