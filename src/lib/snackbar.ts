type SnackbarPayload = {
    message: string;
    severity?: "success" | "error" | "warning" | "info";
};

const snackbarEvent = new EventTarget();

export function dispatchSnackbar(payload: SnackbarPayload) {
    snackbarEvent.dispatchEvent(new CustomEvent("show-snackbar", { detail: payload }));
}

export function listenSnackbar(callback: (payload: SnackbarPayload) => void) {
    const handler = (event: Event) => {
        const customEvent = event as CustomEvent<SnackbarPayload>;
        callback(customEvent.detail);
    };

    snackbarEvent.addEventListener("show-snackbar", handler);

    return () => {
        snackbarEvent.removeEventListener("show-snackbar", handler);
    };
}
