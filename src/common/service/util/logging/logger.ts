import rootLogger, { Logger, LogLevel } from 'loglevel';

// ----- Types

export interface ILemonLogger extends rootLogger.Logger {}
/**
 * Possible log level descriptors, may be string, lower or upper case, or number.
 */
export type ILogLevel = keyof LogLevel;

// ----- Loggers

/** Returns root logger. */
export function getRootLogger(): ILemonLogger {
  return rootLogger;
}

/** Create new or return existing named logger */
export function getLogger(name: string): ILemonLogger {
  return rootLogger.getLogger(name);
}

// ----- Log level

/** Set default logging level. Lower levels are not logged. */
export function setDefaultLevel(level: ILogLevel): void {
  rootLogger.setDefaultLevel(level);
}

/** Get current logging level */
export function getLevel(): ILogLevel[keyof ILogLevel] {
  return rootLogger.getLevel();
}

// ----- Plugins

/**
 * Add logger plugin.
 * Plugins are applied to logger ie. to logger's default factory method.
 * Multiple logins can be applied as they will create function composition applying each plugin's tranfromation to desired log message.
 */
export function addLoggerPlugin(applyFunction: (logger: Logger) => void) {
  applyFunction(rootLogger);
}
