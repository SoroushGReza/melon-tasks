from rest_framework import permissions


# Check if a user is owner of object or if request is read-only
class IsOwnerOrReadOnly(permissions.BasePermission):
    # Override method to determine permission
    def has_object_permission(self, request, view, obj):
        # Allow read-only methods for any user
        if request.method in permissions.SAFE_METHODS:
            return True
        return obj.owner == request.user
