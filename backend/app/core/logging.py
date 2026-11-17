import logging
import sys
from app.core.config import settings


def setup_logging():
    """
    Configure application standard logger.
    """
    log_level = getattr(logging, settings.LOG_LEVEL.upper(), logging.INFO)
    
    logging.basicConfig(
        level=log_level,
        format="%(asctime)s [%(levelname)s] [%(name)s]: %(message)s",
        handlers=[
            logging.StreamHandler(sys.stdout)
        ]
    )
    
    logger = logging.getLogger("infrawatch")
    logger.info(f"Logging initialized with level: {settings.LOG_LEVEL}")
    return logger


logger = setup_logging()
