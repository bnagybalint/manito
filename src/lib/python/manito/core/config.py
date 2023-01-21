import ruamel.yaml as yaml

from pathlib import Path

Config = dict

class ConfigLoader:
    """Software configuration loader
    """

    def __init__(self) -> None:
        pass

    @staticmethod
    def load(config_path: Path) -> Config:
        with open(config_path, "r") as fp:
            y = yaml.YAML(typ="safe").load(fp)

        return y


