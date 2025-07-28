import { useCallback, useState } from "react";

export interface ConfirmDialogOptions {
  title?: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
}

export function useConfirmDialog() {
  const [isOpen, setIsOpen] = useState(false);
  const [onConfirm, setOnConfirm] = useState<() => void>(() => {});
  const [options, setOptions] = useState<ConfirmDialogOptions>({});

  const confirm = useCallback(
    (onConfirmCallback: () => void, options?: ConfirmDialogOptions) => {
      setOptions(options || {});
      setOnConfirm(() => onConfirmCallback);
      setIsOpen(true);
    },
    []
  );

  const handleClose = () => setIsOpen(false);
  const handleConfirm = () => {
    onConfirm();
    handleClose();
  };

  return {
    isOpen,
    confirm,
    options,
    handleClose,
    handleConfirm,
  };
}
