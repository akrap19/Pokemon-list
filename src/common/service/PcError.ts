/**
 * Error base class that should be used for all other custom errors.
 * It manually sets message and name properties. Name property is set from:
 *  - name argument or
 *  - constructor.name if it's available, or
 *  - "PcError"
 */
export default class PcError {
  name: string;
  message: string;
  stack?: string;

  constructor(message: string, name?: string) {
    this.message = message;
    this.name = name || (this.constructor as any).name || "PcError";
    this.stack = new Error().stack;
  }
}
