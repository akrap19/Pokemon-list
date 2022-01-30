
/** Controled access to global variables (eg. window or document in a web browser) */
export class Globals {

  static get global(): any {
    return Globals.window;
  }

  static get window(): any {
    return window;
  }

  static get document(): any {
    return Globals.window ? Globals.window.document : undefined;
  }

}
