from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.core.logging import logger
from app.api.v1.router import api_router


def create_application() -> FastAPI:
    """
    Application factory for InfraWatch FastAPI Service.
    """
    application = FastAPI(
        title=settings.PROJECT_NAME,
        version=settings.VERSION,
        openapi_url=f"{settings.API_V1_STR}/openapi.json",
        docs_url="/docs",
        redoc_url="/redoc",
    )

    # Set up CORS middleware
    application.add_middleware(
        CORSMiddleware,
        allow_origins=settings.BACKEND_CORS_ORIGINS,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    # Mount API v1 router
    application.include_router(api_router, prefix=settings.API_V1_STR)

    return application


app = create_application()


@app.on_event("startup")
async def startup_event():
    logger.info("Starting up InfraWatch Backend Service...")
    logger.info(f"Target Prometheus URL configured at: {settings.PROMETHEUS_URL}")


@app.on_event("shutdown")
async def shutdown_event():
    logger.info("Shutting down InfraWatch Backend Service...")


@app.get("/health", tags=["Health"])
async def health_check():
    """
    Standard health check endpoint for container orchestrators and load balancers.
    """
    return {
        "status": "healthy",
        "service": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "environment": settings.ENVIRONMENT
    }


@app.get("/", tags=["Root"])
async def root():
    """
    Root endpoint directing to API documentation.
    """
    return {
        "message": f"Welcome to {settings.PROJECT_NAME}",
        "docs": "/docs",
        "health": "/health",
        "api_v1": settings.API_V1_STR
    }
