from fastapi import APIRouter

api_router = APIRouter()

# ------------------------------------------------------------------------------
# API v1 Router Registration
# Endpoints will be mounted here in future phases (metrics, hosts, alerts)
# ------------------------------------------------------------------------------

@api_router.get("/status", tags=["System"])
async def get_system_status():
    """
    Get API v1 operational status.
    """
    return {
        "status": "operational",
        "version": "v1",
        "message": "InfraWatch API v1 root endpoint active."
    }
