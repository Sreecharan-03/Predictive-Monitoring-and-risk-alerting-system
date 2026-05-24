import uvicorn
import os

if __name__ == "__main__":
    # Configuration
    HOST = os.getenv("HOST", "0.0.0.0")
    PORT = int(os.getenv("PORT", 8001))
    RELOAD = os.getenv("RELOAD", "False") == "True"
    
    # Run server
    uvicorn.run(
        "main:app",
        host=HOST,
        port=PORT,
        reload=RELOAD,
        log_level="info"
    )
