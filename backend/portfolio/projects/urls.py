from rest_framework.routers import DefaultRouter
from .views import ProjectViewSet, TechnologyViewSet

router = DefaultRouter()
router.register("projects", ProjectViewSet)
router.register("technologies", TechnologyViewSet)
urlpatterns = router.urls
