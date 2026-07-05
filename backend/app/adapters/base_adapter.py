from abc import ABC, abstractmethod

class ProtocolAdapter(ABC):
    @abstractmethod
    def adapt(self, profile: dict) -> dict:
        """
        Transforms the consolidated Protocol Profile into protocol-specific data structures.
        """
        pass

    @abstractmethod
    def get_protocol_name(self) -> str:
        """
        Returns the name of the protocol (e.g., LENDING, INSURANCE, RWA, DAO, INSTITUTIONAL).
        """
        pass

    @abstractmethod
    def get_supported_features(self) -> list:
        """
        Returns a list of parameters or features mapped by the adapter.
        """
        pass
