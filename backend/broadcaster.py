import asyncio
import logging
from typing import Dict, Set

logger = logging.getLogger("backend")

class Broadcaster:
    """
    Manages SSE subscriptions and broadcasts events to active clients.
    """
    def __init__(self):
        self.subscribers: Dict[str, Set[asyncio.Queue]] = {}

    def subscribe(self, session_id: str) -> asyncio.Queue:
        """Adds a new subscriber for a session and returns its queue."""
        queue = asyncio.Queue()
        if session_id not in self.subscribers:
            self.subscribers[session_id] = set()
        self.subscribers[session_id].add(queue)
        logger.debug(f"Subscribed queue to session {session_id}. Active: {len(self.subscribers[session_id])}")
        return queue

    def unsubscribe(self, session_id: str, queue: asyncio.Queue):
        """Removes a subscriber queue from a session."""
        if session_id in self.subscribers:
            self.subscribers[session_id].discard(queue)
            if not self.subscribers[session_id]:
                del self.subscribers[session_id]
            logger.debug(f"Unsubscribed queue from session {session_id}")

    async def broadcast(self, session_id: str, event_type: str, data: any):
        """Pushes data to all active queues for a session."""
        if session_id in self.subscribers:
            logger.debug(f"Broadcasting {event_type} to {len(self.subscribers[session_id])} subscribers for {session_id}")
            # Create a copy to avoid "Set changed size during iteration" errors
            for queue in list(self.subscribers[session_id]):
                await queue.put({"event": event_type, "data": data})

# Singleton instance
broadcaster = Broadcaster()
