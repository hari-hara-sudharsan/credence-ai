from enum import Enum

class GovernanceRole(str, Enum):
    SUPER_ADMIN = "SUPER_ADMIN"
    ORACLE_OPERATOR = "ORACLE_OPERATOR"
    PROTOCOL_ADMIN = "PROTOCOL_ADMIN"
    AUDITOR = "AUDITOR"
    READ_ONLY = "READ_ONLY"

class RBACService:
    def __init__(self):
        # In-memory simple storage mapping actors to roles
        # In production this might read from database
        self.roles_db = {
            "0x5bb83e60a7a05a0e1b077b66412a26306e334208": GovernanceRole.SUPER_ADMIN,
        }

    def has_permission(self, actor: str, action: str) -> bool:
        """
        Check if actor address is whitelisted for the designated action.
        """
        actor_lower = actor.lower()
        role = self.roles_db.get(actor_lower, GovernanceRole.READ_ONLY)

        if role == GovernanceRole.SUPER_ADMIN:
            return True

        if action in ["APPROVE_ORACLE", "REVOKE_ORACLE", "PAUSE_ORACLE"]:
            return role == GovernanceRole.ORACLE_OPERATOR
        
        if action in ["APPROVE_POLICY", "REVOKE_POLICY", "DISABLE_POLICY"]:
            return role == GovernanceRole.PROTOCOL_ADMIN

        if action in ["VIEW_AUDIT_LOGS"]:
            return role in [GovernanceRole.AUDITOR, GovernanceRole.SUPER_ADMIN]

        return False

    def assign_role(self, actor: str, role: str) -> bool:
        actor_lower = actor.lower()
        if role in GovernanceRole.__members__:
            self.roles_db[actor_lower] = GovernanceRole(role)
            return True
        return False

    def revoke_role(self, actor: str) -> bool:
        actor_lower = actor.lower()
        if actor_lower in self.roles_db:
            del self.roles_db[actor_lower]
            return True
        return False

    def list_roles(self) -> list:
        return [
            {"actor": k, "role": v.value}
            for k, v in self.roles_db.items()
        ]
