"""
Uplokal Backend - Role-Based Access Control Middleware
========================================================
Restricts access to routes based on user roles.
"""

from typing import List, Union
from fastapi import HTTPException, status, Depends

from app.middleware.auth import get_current_user
from app.models.user import User, UserRole


class RequireRole:
    """
    Dependency for role-based access control.
    
    Usage:
        @router.get("/admin-only", dependencies=[Depends(RequireRole("admin"))])
        async def admin_route():
            ...
        
        # Multiple roles
        @router.get("/staff", dependencies=[Depends(RequireRole(["admin", "super_admin"]))])
        async def staff_route():
            ...
    """
    
    # Role hierarchy: super_admin > admin > user
    ROLE_HIERARCHY = {
        UserRole.USER: 0,
        UserRole.ADMIN: 1,
        UserRole.SUPER_ADMIN: 2
    }
    
    def __init__(
        self,
        allowed_roles: Union[str, List[str]],
        hierarchical: bool = True
    ):
        """
        Args:
            allowed_roles: Single role or list of allowed roles
            hierarchical: If True, higher roles automatically have access
        """
        if isinstance(allowed_roles, str):
            allowed_roles = [allowed_roles]
        
        self.allowed_roles = [UserRole(r) if isinstance(r, str) else r for r in allowed_roles]
        self.hierarchical = hierarchical
    
    async def __call__(self, user: User = Depends(get_current_user)) -> User:
        """Verify user has required role."""
        user_role = user.role
        
        if self.hierarchical:
            # Check if user's role level is >= minimum required
            min_required_level = min(
                self.ROLE_HIERARCHY.get(r, 0) for r in self.allowed_roles
            )
            user_level = self.ROLE_HIERARCHY.get(user_role, 0)
            
            if user_level >= min_required_level:
                return user
        else:
            # Exact role match required
            if user_role in self.allowed_roles:
                return user
        
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Insufficient permissions"
        )


# Convenience instances
require_admin = RequireRole([UserRole.ADMIN, UserRole.SUPER_ADMIN])
require_super_admin = RequireRole([UserRole.SUPER_ADMIN])


def require_role(role: Union[str, List[str]]) -> RequireRole:
    """
    Factory function for role requirements.
    
    Usage:
        @router.get("/admin", dependencies=[Depends(require_role("admin"))])
    """
    return RequireRole(role)


async def is_admin(user: User = Depends(get_current_user)) -> bool:
    """Check if current user is an admin."""
    return user.role in [UserRole.ADMIN, UserRole.SUPER_ADMIN]


async def is_super_admin(user: User = Depends(get_current_user)) -> bool:
    """Check if current user is a super admin."""
    return user.role == UserRole.SUPER_ADMIN


async def is_owner_or_admin(
    resource_owner_id: int,
    user: User = Depends(get_current_user)
) -> bool:
    """
    Check if user owns the resource or is an admin.
    
    Useful for CRUD operations where owners and admins have access.
    """
    if user.role in [UserRole.ADMIN, UserRole.SUPER_ADMIN]:
        return True
    return user.id == resource_owner_id
