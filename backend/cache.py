import logging
from typing import Optional, Tuple, Sequence
from sqlmodel import Session, select, col, desc
from database import engine
from models import ChatTriggerResponse

logger = logging.getLogger("backend")

# --- Global Cache ---
_TRIGGER_CACHE: Optional[Sequence[ChatTriggerResponse]] = None
_FLAT_TRIGGER_MAP: Optional[dict] = None


def get_cached_triggers() -> Tuple[Sequence[ChatTriggerResponse], dict]:
    """Returns cached triggers and a flat map for O(1) lookups."""
    global _TRIGGER_CACHE, _FLAT_TRIGGER_MAP
    if _TRIGGER_CACHE is None:
        logger.info("Populating ChatTrigger cache...")
        try:
            with Session(engine) as session:
                # Order by Priority (DESC) then ID (ASC) to respect manual overrides
                results = session.exec(
                    select(ChatTriggerResponse).order_by(
                        desc(col(ChatTriggerResponse.priority)), col(ChatTriggerResponse.id)
                    )
                ).all()
                _TRIGGER_CACHE = results
                _FLAT_TRIGGER_MAP = {}
                for item in results:
                    for t in item.triggers:
                        t_lower = t.lower()
                        # Only map the first occurrence to preserve priority
                        if t_lower not in _FLAT_TRIGGER_MAP:
                            _FLAT_TRIGGER_MAP[t_lower] = item
        except Exception as e:
            logger.error(f"Failed to populate trigger cache: {e}")
            return [], {}

    return _TRIGGER_CACHE or [], _FLAT_TRIGGER_MAP or {}


def clear_trigger_cache():
    """Invalidates the trigger cache."""
    global _TRIGGER_CACHE, _FLAT_TRIGGER_MAP
    _TRIGGER_CACHE = None
    _FLAT_TRIGGER_MAP = None
    logger.info("ChatTrigger cache cleared")
