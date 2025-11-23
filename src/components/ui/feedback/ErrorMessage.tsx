import { AlertCircle } from "lucide-react";

type ErrorMessageProps = {
    message?: string;
    onRetry?: () => void;
    inline?: boolean;
};

export default function ErrorMessage({
    message = "Алдаа гарлаа",
    onRetry,
    inline = false,
}: ErrorMessageProps) {
    return (
        <div
            className={`flex items-start gap-2 rounded-md border border-red-300 bg-red-50 p-3 text-sm text-red-800 dark:border-red-500 dark:bg-red-900/20 dark:text-red-200 ${inline ? "" : "my-4"
                }`}
        >
            <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
            <div className="flex flex-col">
                <span>{message}</span>
                {onRetry && (
                    <button
                        onClick={onRetry}
                        className="mt-1 self-start text-xs font-medium text-red-600 underline hover:text-red-700 dark:text-red-300 dark:hover:text-red-200"
                    >
                        Дахин оролдох
                    </button>
                )}
            </div>
        </div>
    );
}
