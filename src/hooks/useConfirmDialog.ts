import { useCallback, useRef, useState } from "react";

export interface ConfirmDialogOptions {
  title?: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
}

export function useConfirmDialog() {
  const [isOpen, setIsOpen] = useState(false);
  const [options, setOptions] = useState<ConfirmDialogOptions>({});
  const onConfirmRef = useRef<() => void>(() => {});

  const confirm = useCallback(
    (onConfirmCallback: () => void, opts?: ConfirmDialogOptions) => {
      onConfirmRef.current = onConfirmCallback;
      setOptions(opts || {});
      setIsOpen(true);
    },
    []
  );

  const handleClose = useCallback(() => setIsOpen(false), []);

  const handleConfirm = useCallback(() => {
    onConfirmRef.current();
    setIsOpen(false);
  }, []);

  return {
    isOpen,
    confirm,
    options,
    handleClose,
    handleConfirm,
  };
}
