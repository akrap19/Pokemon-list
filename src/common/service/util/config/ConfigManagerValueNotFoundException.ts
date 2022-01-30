
/** Thrown when config value is not found in config manager. */
export class ConfigManagerValueNotFoundException extends Error {
  constructor(name: string, managerName: string) {
    super(`Config value '${name}' not found in ${managerName}.`);
  }
}
