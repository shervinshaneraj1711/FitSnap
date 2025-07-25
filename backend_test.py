#!/usr/bin/env python3
"""
FitSnap Backend API Test Suite
Tests all backend endpoints with comprehensive validation
"""

import requests
import json
import os
import sys
from io import BytesIO
from PIL import Image
import base64

# Get backend URL from frontend .env file
BACKEND_URL = "http://localhost:8001"
API_BASE = f"{BACKEND_URL}/api"

class FitSnapAPITester:
    def __init__(self):
        self.session = requests.Session()
        self.test_user_id = None
        self.test_user_email = None
        self.test_brand_id = None
        self.results = []
        
    def log_result(self, test_name, success, message, response_data=None):
        """Log test result"""
        status = "✅ PASS" if success else "❌ FAIL"
        print(f"{status} {test_name}: {message}")
        self.results.append({
            "test": test_name,
            "success": success,
            "message": message,
            "response_data": response_data
        })
        
    def create_test_image(self, width=400, height=600):
        """Create a test image for upload testing"""
        img = Image.new('RGB', (width, height), color='lightblue')
        img_bytes = BytesIO()
        img.save(img_bytes, format='JPEG')
        img_bytes.seek(0)
        return img_bytes
        
    def test_health_check(self):
        """Test GET /api/health"""
        try:
            response = self.session.get(f"{API_BASE}/health")
            
            if response.status_code == 200:
                data = response.json()
                if data.get("status") == "healthy":
                    self.log_result("Health Check", True, "Health endpoint working correctly", data)
                else:
                    self.log_result("Health Check", False, f"Unexpected response format: {data}")
            else:
                self.log_result("Health Check", False, f"HTTP {response.status_code}: {response.text}")
                
        except Exception as e:
            self.log_result("Health Check", False, f"Request failed: {str(e)}")
            
    def test_user_registration(self):
        """Test POST /api/users/register"""
        try:
            import time
            unique_id = str(int(time.time()))
            user_data = {
                "email": f"sarah.johnson.{unique_id}@example.com",
                "name": "Sarah Johnson",
                "password": "SecurePass123!"
            }
            
            response = self.session.post(f"{API_BASE}/users/register", json=user_data)
            
            if response.status_code == 200:
                data = response.json()
                if "user_id" in data and "message" in data:
                    self.test_user_id = data["user_id"]
                    self.test_user_email = user_data["email"]  # Store email for login test
                    self.log_result("User Registration", True, "User registered successfully", data)
                else:
                    self.log_result("User Registration", False, f"Missing required fields in response: {data}")
            else:
                self.log_result("User Registration", False, f"HTTP {response.status_code}: {response.text}")
                
        except Exception as e:
            self.log_result("User Registration", False, f"Request failed: {str(e)}")
            
    def test_duplicate_registration(self):
        """Test duplicate user registration"""
        try:
            user_data = {
                "email": f"sarah.johnson.{str(int(__import__('time').time()))}@example.com",  # Same email as before
                "name": "Sarah Johnson",
                "password": "SecurePass123!"
            }
            
            # Register first time
            self.session.post(f"{API_BASE}/users/register", json=user_data)
            
            # Try to register again with same email
            response = self.session.post(f"{API_BASE}/users/register", json=user_data)
            
            if response.status_code == 400:
                data = response.json()
                if "already registered" in data.get("detail", "").lower():
                    self.log_result("Duplicate Registration", True, "Correctly rejected duplicate email", data)
                else:
                    self.log_result("Duplicate Registration", False, f"Unexpected error message: {data}")
            else:
                self.log_result("Duplicate Registration", False, f"Should have returned 400, got {response.status_code}")
                
        except Exception as e:
            self.log_result("Duplicate Registration", False, f"Request failed: {str(e)}")
            
    def test_user_login(self):
        """Test POST /api/users/login"""
        try:
            login_data = {
                "email": "sarah.johnson@example.com",
                "password": "SecurePass123!"
            }
            
            response = self.session.post(f"{API_BASE}/users/login", json=login_data)
            
            if response.status_code == 200:
                data = response.json()
                if "user" in data and "token" in data:
                    user_info = data["user"]
                    if "id" in user_info and "email" in user_info and "name" in user_info:
                        self.log_result("User Login", True, "Login successful", data)
                    else:
                        self.log_result("User Login", False, f"Missing user fields in response: {data}")
                else:
                    self.log_result("User Login", False, f"Missing required fields in response: {data}")
            else:
                self.log_result("User Login", False, f"HTTP {response.status_code}: {response.text}")
                
        except Exception as e:
            self.log_result("User Login", False, f"Request failed: {str(e)}")
            
    def test_invalid_login(self):
        """Test login with invalid credentials"""
        try:
            login_data = {
                "email": "sarah.johnson@example.com",
                "password": "WrongPassword123!"
            }
            
            response = self.session.post(f"{API_BASE}/users/login", json=login_data)
            
            if response.status_code == 401:
                data = response.json()
                if "invalid credentials" in data.get("detail", "").lower():
                    self.log_result("Invalid Login", True, "Correctly rejected invalid credentials", data)
                else:
                    self.log_result("Invalid Login", False, f"Unexpected error message: {data}")
            else:
                self.log_result("Invalid Login", False, f"Should have returned 401, got {response.status_code}")
                
        except Exception as e:
            self.log_result("Invalid Login", False, f"Request failed: {str(e)}")
            
    def test_get_user_profile(self):
        """Test GET /api/users/{user_id}"""
        if not self.test_user_id:
            self.log_result("Get User Profile", False, "No test user ID available")
            return
            
        try:
            response = self.session.get(f"{API_BASE}/users/{self.test_user_id}")
            
            if response.status_code == 200:
                data = response.json()
                required_fields = ["id", "email", "name", "created_at"]
                if all(field in data for field in required_fields):
                    if "password" not in data:  # Password should not be in response
                        self.log_result("Get User Profile", True, "User profile retrieved successfully", data)
                    else:
                        self.log_result("Get User Profile", False, "Password field present in response (security issue)")
                else:
                    missing = [f for f in required_fields if f not in data]
                    self.log_result("Get User Profile", False, f"Missing fields: {missing}")
            else:
                self.log_result("Get User Profile", False, f"HTTP {response.status_code}: {response.text}")
                
        except Exception as e:
            self.log_result("Get User Profile", False, f"Request failed: {str(e)}")
            
    def test_get_nonexistent_user(self):
        """Test GET /api/users/{user_id} with non-existent user"""
        try:
            fake_user_id = "non-existent-user-id"
            response = self.session.get(f"{API_BASE}/users/{fake_user_id}")
            
            if response.status_code == 404:
                data = response.json()
                if "not found" in data.get("detail", "").lower():
                    self.log_result("Get Nonexistent User", True, "Correctly returned 404 for non-existent user", data)
                else:
                    self.log_result("Get Nonexistent User", False, f"Unexpected error message: {data}")
            else:
                self.log_result("Get Nonexistent User", False, f"Should have returned 404, got {response.status_code}")
                
        except Exception as e:
            self.log_result("Get Nonexistent User", False, f"Request failed: {str(e)}")
            
    def test_measurements_upload(self):
        """Test POST /api/measurements/upload"""
        try:
            # Create test images
            front_image = self.create_test_image()
            side_image = self.create_test_image()
            
            files = {
                'front_image': ('front.jpg', front_image, 'image/jpeg'),
                'side_image': ('side.jpg', side_image, 'image/jpeg')
            }
            
            response = self.session.post(f"{API_BASE}/measurements/upload", files=files)
            
            if response.status_code == 200:
                data = response.json()
                required_fields = ["message", "upload_id", "measurements"]
                if all(field in data for field in required_fields):
                    measurements = data["measurements"]
                    measurement_fields = ["chest", "waist", "hips", "height", "weight"]
                    if all(field in measurements for field in measurement_fields):
                        self.log_result("Measurements Upload", True, "Images uploaded and processed successfully", data)
                    else:
                        missing = [f for f in measurement_fields if f not in measurements]
                        self.log_result("Measurements Upload", False, f"Missing measurement fields: {missing}")
                else:
                    missing = [f for f in required_fields if f not in data]
                    self.log_result("Measurements Upload", False, f"Missing response fields: {missing}")
            else:
                self.log_result("Measurements Upload", False, f"HTTP {response.status_code}: {response.text}")
                
        except Exception as e:
            self.log_result("Measurements Upload", False, f"Request failed: {str(e)}")
            
    def test_get_user_measurements(self):
        """Test GET /api/measurements/{user_id}"""
        test_user = self.test_user_id or "demo-user"
        
        try:
            response = self.session.get(f"{API_BASE}/measurements/{test_user}")
            
            if response.status_code == 200:
                data = response.json()
                if isinstance(data, list) and len(data) > 0:
                    measurement = data[0]
                    required_fields = ["id", "user_id", "chest", "waist", "hips", "height", "weight"]
                    if all(field in measurement for field in required_fields):
                        self.log_result("Get User Measurements", True, "Measurements retrieved successfully", data)
                    else:
                        missing = [f for f in required_fields if f not in measurement]
                        self.log_result("Get User Measurements", False, f"Missing measurement fields: {missing}")
                else:
                    self.log_result("Get User Measurements", False, "Expected non-empty list of measurements")
            else:
                self.log_result("Get User Measurements", False, f"HTTP {response.status_code}: {response.text}")
                
        except Exception as e:
            self.log_result("Get User Measurements", False, f"Request failed: {str(e)}")
            
    def test_get_size_recommendations(self):
        """Test GET /api/recommendations/{user_id}"""
        test_user = self.test_user_id or "demo-user"
        
        try:
            response = self.session.get(f"{API_BASE}/recommendations/{test_user}")
            
            if response.status_code == 200:
                data = response.json()
                if isinstance(data, list) and len(data) > 0:
                    recommendation = data[0]
                    required_fields = ["id", "user_id", "brand", "category", "recommended_size", "confidence"]
                    if all(field in recommendation for field in required_fields):
                        self.log_result("Get Size Recommendations", True, "Recommendations retrieved successfully", data)
                    else:
                        missing = [f for f in required_fields if f not in recommendation]
                        self.log_result("Get Size Recommendations", False, f"Missing recommendation fields: {missing}")
                else:
                    self.log_result("Get Size Recommendations", False, "Expected non-empty list of recommendations")
            else:
                self.log_result("Get Size Recommendations", False, f"HTTP {response.status_code}: {response.text}")
                
        except Exception as e:
            self.log_result("Get Size Recommendations", False, f"Request failed: {str(e)}")
            
    def test_get_brands(self):
        """Test GET /api/brands"""
        try:
            response = self.session.get(f"{API_BASE}/brands")
            
            if response.status_code == 200:
                data = response.json()
                if isinstance(data, list) and len(data) > 0:
                    brand = data[0]
                    required_fields = ["id", "name", "categories", "size_chart"]
                    if all(field in brand for field in required_fields):
                        self.test_brand_id = brand["id"]  # Store for next test
                        self.log_result("Get Brands", True, "Brands retrieved successfully", data)
                    else:
                        missing = [f for f in required_fields if f not in brand]
                        self.log_result("Get Brands", False, f"Missing brand fields: {missing}")
                else:
                    self.log_result("Get Brands", False, "Expected non-empty list of brands")
            else:
                self.log_result("Get Brands", False, f"HTTP {response.status_code}: {response.text}")
                
        except Exception as e:
            self.log_result("Get Brands", False, f"Request failed: {str(e)}")
            
    def test_get_specific_brand(self):
        """Test GET /api/brands/{brand_id}"""
        if not self.test_brand_id:
            self.log_result("Get Specific Brand", False, "No test brand ID available")
            return
            
        try:
            response = self.session.get(f"{API_BASE}/brands/{self.test_brand_id}")
            
            if response.status_code == 200:
                data = response.json()
                required_fields = ["id", "name", "categories", "size_chart"]
                if all(field in data for field in required_fields):
                    self.log_result("Get Specific Brand", True, "Brand details retrieved successfully", data)
                else:
                    missing = [f for f in required_fields if f not in data]
                    self.log_result("Get Specific Brand", False, f"Missing brand fields: {missing}")
            else:
                self.log_result("Get Specific Brand", False, f"HTTP {response.status_code}: {response.text}")
                
        except Exception as e:
            self.log_result("Get Specific Brand", False, f"Request failed: {str(e)}")
            
    def test_get_nonexistent_brand(self):
        """Test GET /api/brands/{brand_id} with non-existent brand"""
        try:
            fake_brand_id = "non-existent-brand-id"
            response = self.session.get(f"{API_BASE}/brands/{fake_brand_id}")
            
            if response.status_code == 404:
                data = response.json()
                if "not found" in data.get("detail", "").lower():
                    self.log_result("Get Nonexistent Brand", True, "Correctly returned 404 for non-existent brand", data)
                else:
                    self.log_result("Get Nonexistent Brand", False, f"Unexpected error message: {data}")
            else:
                self.log_result("Get Nonexistent Brand", False, f"Should have returned 404, got {response.status_code}")
                
        except Exception as e:
            self.log_result("Get Nonexistent Brand", False, f"Request failed: {str(e)}")
            
    def test_virtual_tryon(self):
        """Test POST /api/virtual-tryon"""
        try:
            # Send as query parameters instead of JSON body
            params = {
                "user_id": self.test_user_id or "demo-user",
                "item_id": "shirt-001",
                "brand": "Zara"
            }
            
            response = self.session.post(f"{API_BASE}/virtual-tryon", params=params)
            
            if response.status_code == 200:
                data = response.json()
                required_fields = ["message", "user_id", "item_id", "brand", "preview_url"]
                if all(field in data for field in required_fields):
                    self.log_result("Virtual Try-On", True, "Virtual try-on placeholder working", data)
                else:
                    missing = [f for f in required_fields if f not in data]
                    self.log_result("Virtual Try-On", False, f"Missing response fields: {missing}")
            else:
                self.log_result("Virtual Try-On", False, f"HTTP {response.status_code}: {response.text}")
                
        except Exception as e:
            self.log_result("Virtual Try-On", False, f"Request failed: {str(e)}")
            
    def run_all_tests(self):
        """Run all API tests"""
        print("🚀 Starting FitSnap Backend API Tests")
        print("=" * 50)
        
        # Test sequence
        self.test_health_check()
        self.test_user_registration()
        self.test_duplicate_registration()
        self.test_user_login()
        self.test_invalid_login()
        self.test_get_user_profile()
        self.test_get_nonexistent_user()
        self.test_measurements_upload()
        self.test_get_user_measurements()
        self.test_get_size_recommendations()
        self.test_get_brands()
        self.test_get_specific_brand()
        self.test_get_nonexistent_brand()
        self.test_virtual_tryon()
        
        # Summary
        print("\n" + "=" * 50)
        print("📊 TEST SUMMARY")
        print("=" * 50)
        
        passed = sum(1 for r in self.results if r["success"])
        total = len(self.results)
        
        print(f"Total Tests: {total}")
        print(f"Passed: {passed}")
        print(f"Failed: {total - passed}")
        print(f"Success Rate: {(passed/total)*100:.1f}%")
        
        if total - passed > 0:
            print("\n❌ FAILED TESTS:")
            for result in self.results:
                if not result["success"]:
                    print(f"  - {result['test']}: {result['message']}")
        
        return passed == total

if __name__ == "__main__":
    print("FitSnap Backend API Test Suite")
    print(f"Testing backend at: {BACKEND_URL}")
    
    tester = FitSnapAPITester()
    success = tester.run_all_tests()
    
    sys.exit(0 if success else 1)