export enum DialogActionTypesEnum {
  FETCH_LIST = "fetchList",
}

export interface IDialogSearchParams {
  action?: string;
  type?: string;
  id?: string;
  reference?: string;
}

export default class DialogActionsURLHelper {
  static createDialogParams = (search: string): IDialogSearchParams => {
    const searchParams = new URLSearchParams(search);

    return {
      action: searchParams.get("action") || undefined,
      type: searchParams.get("type") || undefined,
      id: searchParams.get("id") || undefined,
      reference: searchParams.get("reference") || undefined,
    };
  };

  static createUrlParams = (searchParams: IDialogSearchParams): string => {
    const search: URLSearchParams = new URLSearchParams();

    if (searchParams.action) {
      search.set("action", searchParams.action);
    }
    if (searchParams.type) {
      search.set("type", searchParams.type);
    }
    if (searchParams.id) {
      search.set("id", searchParams.id);
    }
    if (searchParams.reference) {
      search.set("reference", searchParams.reference);
    }

    return search.toString();
  };
}
