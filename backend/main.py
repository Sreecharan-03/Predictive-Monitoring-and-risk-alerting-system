from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import task1, task2, task3, task4, task5, task6

def create_app():
    """Create and configure FastAPI app"""
    app = FastAPI(
        title="Predictive Analytics and Risk Alerting System",
        description="API for AI-powered risk prediction and analytics across multiple domains",
        version="1.0.0",
        docs_url="/docs",
        redoc_url="/redoc",
        openapi_url="/openapi.json"
    )
    
    # Add CORS middleware
    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],  # Allow all origins
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )
    
    # Include routers
    app.include_router(task1.router, prefix="/api/predict")
    app.include_router(task2.router, prefix="/api/predict")
    app.include_router(task3.router, prefix="/api/predict")
    app.include_router(task4.router, prefix="/api/predict")
    app.include_router(task5.router, prefix="/api/predict")
    app.include_router(task6.router, prefix="/api/predict")
    # evaluation router
    from app.routes import eval as eval_router
    app.include_router(eval_router.router, prefix="/api")
    
    # Health check endpoint
    @app.get("/health")
    async def health():
        return {"status": "healthy", "message": "API is running"}
    
    @app.get("/")
    async def root():
        return {
            "message": "Predictive Analytics and Risk Alerting System",
            "version": "1.0.0",
            "docs": "/docs"
        }

    @app.get("/api/status/models")
    async def models_status():
        """Return a small model status summary for the frontend built from TASKS_CONFIG."""
        from app.config import TASKS_CONFIG

        models = []
        for key, cfg in TASKS_CONFIG.items():
            models.append({
                "id": key,
                "name": cfg.get('name', key),
                "available": True,
                "description": cfg.get('description', '')
            })

        return {"count": len(models), "models": models}
    
    return app

app = create_app()
