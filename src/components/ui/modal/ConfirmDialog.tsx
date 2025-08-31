import React from "react";
import Modal from "@/components/modal/BasicModal";
import Button from "@/components/ui/button/Button";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
}

export default function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title = "Устгах уу?",
  description = "Энэ мэдээллийг устгахдаа итгэлтэй байна уу?",
  confirmText = "Тийм",
  cancelText = "Үгүй",
}: Props) {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="p-6 text-center">
        <h3 className="text-lg font-medium text-white">{title}</h3>
        <p className="text-sm text-white mt-2">{description}</p>
        <div className="mt-6 flex justify-center gap-4">
          <Button variant="outline" onClick={onClose}>
            {cancelText}
          </Button>
          <Button variant="primary" onClick={onConfirm} className="bg-red-500">
            {confirmText}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
