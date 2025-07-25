from fastapi import FastAPI, HTTPException, Depends, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel, Field
from typing import Optional, List
import os
import uuid
import base64
from datetime import datetime, timedelta
from pymongo import MongoClient
from dotenv import load_dotenv
import json

# Load environment variables
load_dotenv()

app = FastAPI(title="FitSnap API", version="1.0.0")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# MongoDB connection
MONGO_URL = os.getenv("MONGO_URL", "mongodb://localhost:27017/fitsnap")
client = MongoClient(MONGO_URL)
db = client.fitsnap

# Security
security = HTTPBearer()

# Pydantic models
class User(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    email: str
    name: str
    created_at: datetime = Field(default_factory=datetime.utcnow)

class UserCreate(BaseModel):
    email: str
    name: str
    password: str

class UserLogin(BaseModel):
    email: str
    password: str

class BodyMeasurements(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    chest: Optional[float] = None
    waist: Optional[float] = None
    hips: Optional[float] = None
    height: Optional[float] = None
    weight: Optional[float] = None
    shoulder_width: Optional[float] = None
    arm_length: Optional[float] = None
    leg_length: Optional[float] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)

class Brand(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    logo_url: Optional[str] = None
    size_chart: dict = {}
    categories: List[str] = []

class SizeRecommendation(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    brand: str
    category: str
    recommended_size: str
    confidence: float
    created_at: datetime = Field(default_factory=datetime.utcnow)

# API Routes

@app.get("/api/health")
async def health_check():
    return {"status": "healthy", "timestamp": datetime.utcnow()}

# User management routes
@app.post("/api/users/register")
async def register_user(user: UserCreate):
    """Register a new user - placeholder for now"""
    # Check if user exists
    existing_user = db.users.find_one({"email": user.email})
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    # Create user (in production, hash password)
    user_data = {
        "id": str(uuid.uuid4()),
        "email": user.email,
        "name": user.name,
        "password": user.password,  # In production, hash this
        "created_at": datetime.utcnow()
    }
    
    db.users.insert_one(user_data)
    return {"message": "User registered successfully", "user_id": user_data["id"]}

@app.post("/api/users/login")
async def login_user(user: UserLogin):
    """Login user - placeholder for now"""
    # Find user
    db_user = db.users.find_one({"email": user.email})
    if not db_user or db_user["password"] != user.password:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    return {
        "message": "Login successful",
        "user": {
            "id": db_user["id"],
            "email": db_user["email"],
            "name": db_user["name"]
        },
        "token": f"dummy-token-{db_user['id']}"  # Placeholder token
    }

@app.get("/api/users/{user_id}")
async def get_user(user_id: str):
    """Get user profile"""
    user = db.users.find_one({"id": user_id})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Remove password from response
    user.pop("password", None)
    user.pop("_id", None)
    return user

# Body measurements routes
@app.post("/api/measurements/upload")
async def upload_body_images(
    front_image: UploadFile = File(...),
    side_image: UploadFile = File(...),
    user_id: str = "demo-user"  # In production, get from auth token
):
    """Upload body images for measurement analysis - placeholder"""
    
    # Read and encode images to base64
    front_content = await front_image.read()
    side_content = await side_image.read()
    
    front_b64 = base64.b64encode(front_content).decode('utf-8')
    side_b64 = base64.b64encode(side_content).decode('utf-8')
    
    # Store upload record
    upload_data = {
        "id": str(uuid.uuid4()),
        "user_id": user_id,
        "front_image": front_b64,
        "side_image": side_b64,
        "status": "processing",
        "created_at": datetime.utcnow()
    }
    
    db.image_uploads.insert_one(upload_data)
    
    # Simulate processing and generate placeholder measurements
    measurements = {
        "id": str(uuid.uuid4()),
        "user_id": user_id,
        "chest": 96.5,
        "waist": 81.3,
        "hips": 102.1,
        "height": 175.0,
        "weight": 70.0,
        "shoulder_width": 42.0,
        "arm_length": 61.0,
        "leg_length": 84.0,
        "created_at": datetime.utcnow().isoformat()
    }
    
    db.measurements.insert_one(measurements)
    
    return {
        "message": "Images uploaded and processed successfully",
        "upload_id": upload_data["id"],
        "measurements": measurements
    }

@app.get("/api/measurements/{user_id}")
async def get_user_measurements(user_id: str):
    """Get user's body measurements"""
    measurements = list(db.measurements.find({"user_id": user_id}))
    
    # Remove MongoDB _id from results
    for measurement in measurements:
        measurement.pop("_id", None)
    
    if not measurements:
        # Return placeholder measurements if none exist
        placeholder = {
            "id": str(uuid.uuid4()),
            "user_id": user_id,
            "chest": 96.5,
            "waist": 81.3,
            "hips": 102.1,
            "height": 175.0,
            "weight": 70.0,
            "shoulder_width": 42.0,
            "arm_length": 61.0,
            "leg_length": 84.0,
            "created_at": datetime.utcnow()
        }
        return [placeholder]
    
    return measurements

# Size recommendations
@app.get("/api/recommendations/{user_id}")
async def get_size_recommendations(user_id: str):
    """Get size recommendations for user"""
    recommendations = list(db.recommendations.find({"user_id": user_id}))
    
    # Remove MongoDB _id from results
    for rec in recommendations:
        rec.pop("_id", None)
    
    if not recommendations:
        # Return placeholder recommendations
        placeholder_recs = [
            {
                "id": str(uuid.uuid4()),
                "user_id": user_id,
                "brand": "Zara",
                "category": "Shirts",
                "recommended_size": "M",
                "confidence": 0.92,
                "created_at": datetime.utcnow()
            },
            {
                "id": str(uuid.uuid4()),
                "user_id": user_id,
                "brand": "H&M",
                "category": "Jeans",
                "recommended_size": "32",
                "confidence": 0.88,
                "created_at": datetime.utcnow()
            },
            {
                "id": str(uuid.uuid4()),
                "user_id": user_id,
                "brand": "Nike",
                "category": "T-Shirts",
                "recommended_size": "L",
                "confidence": 0.85,
                "created_at": datetime.utcnow()
            }
        ]
        return placeholder_recs
    
    return recommendations

# Brands routes
@app.get("/api/brands")
async def get_brands():
    """Get all supported brands"""
    brands = list(db.brands.find())
    
    # Remove MongoDB _id from results
    for brand in brands:
        brand.pop("_id", None)
    
    if not brands:
        # Return placeholder brands
        placeholder_brands = [
            {
                "id": str(uuid.uuid4()),
                "name": "Zara",
                "logo_url": "https://via.placeholder.com/100x50/000000/FFFFFF?text=ZARA",
                "categories": ["Shirts", "Jeans", "Dresses", "Jackets"],
                "size_chart": {"XS": "34", "S": "36", "M": "38", "L": "40", "XL": "42"}
            },
            {
                "id": str(uuid.uuid4()),
                "name": "H&M",
                "logo_url": "https://via.placeholder.com/100x50/E50000/FFFFFF?text=H%26M",
                "categories": ["T-Shirts", "Jeans", "Dresses", "Jackets"],
                "size_chart": {"XS": "32", "S": "34", "M": "36", "L": "38", "XL": "40"}
            },
            {
                "id": str(uuid.uuid4()),
                "name": "Nike",
                "logo_url": "https://via.placeholder.com/100x50/000000/FFFFFF?text=NIKE",
                "categories": ["T-Shirts", "Shorts", "Athletic Wear"],
                "size_chart": {"XS": "XS", "S": "S", "M": "M", "L": "L", "XL": "XL"}
            },
            {
                "id": str(uuid.uuid4()),
                "name": "Adidas",
                "logo_url": "https://via.placeholder.com/100x50/000000/FFFFFF?text=ADIDAS",
                "categories": ["T-Shirts", "Shorts", "Athletic Wear"],
                "size_chart": {"XS": "XS", "S": "S", "M": "M", "L": "L", "XL": "XL"}
            }
        ]
        return placeholder_brands
    
    return brands

@app.get("/api/brands/{brand_id}")
async def get_brand(brand_id: str):
    """Get specific brand details"""
    brand = db.brands.find_one({"id": brand_id})
    if not brand:
        raise HTTPException(status_code=404, detail="Brand not found")
    
    brand.pop("_id", None)
    return brand

# Virtual try-on placeholder
@app.post("/api/virtual-tryon")
async def virtual_tryon(
    user_id: str,
    item_id: str,
    brand: str
):
    """Virtual try-on - placeholder for future AI integration"""
    return {
        "message": "Virtual try-on feature coming soon!",
        "user_id": user_id,
        "item_id": item_id,
        "brand": brand,
        "preview_url": "https://via.placeholder.com/400x600/1e1e2e/ffffff?text=Virtual+Try-On+Coming+Soon"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)