# Parents Chinese-specific configuration
# This file contains all the settings needed for the parents Chinese version

# Database configuration
PARENTS_CHINESE_DATABASE_URL = "postgresql://postgres:NBem0YTOfN94yKqFSw5F@mwms-instance.c320aqgmywbc.us-east-2.rds.amazonaws.com:5432/parents_chinese_db?sslmode=require"

# CORS origins for parents Chinese
PARENTS_CHINESE_CORS_ORIGINS = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "https://myworldmysay.com",
    "https://www.myworldmysay.com",
    "https://api.myworldmysay.com",
    "https://teen.myworldmysay.com",
    "https://parents.myworldmysay.com",
    "https://www.parents.myworldmysay.com",
    "https://parents-chinese.myworldmysay.com",
    "https://www.parents-chinese.myworldmysay.com"
]

# API base URL for parents Chinese frontend
PARENTS_CHINESE_API_BASE = "https://api.parents-chinese.myworldmysay.com"

print("Parents Chinese configuration loaded successfully!")
