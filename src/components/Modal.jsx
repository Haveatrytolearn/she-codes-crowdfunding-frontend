import Button from "./Button";
import "./Modal.css";


function Modal({
    isOpen,
    title,
    message,
    type = "success",
    confirmText = "OK",
    cancelText = "",
    onConfirm,
    onClose,
    onCancel,
    isProcessing = false,
}) {
    if (!isOpen) return null;

    return (
        <div className="app-modal-overlay" onClick={isProcessing ? undefined : onClose}>
            <div
                className={`app-modal app-modal--${type}`}
                onClick={(e) => e.stopPropagation()}
            >
                <h3 className="app-modal-title">{title}</h3>

                <p className="app-modal-text">
                    {Array.isArray(message)
                        ? message.map((line, index) => (
                              <span key={index} className="app-modal-line">
                                  {line}
                              </span>
                          ))
                        : message}
                </p>

                <div className="app-modal-actions">
                    {cancelText && (
                        <Button
                            type="button"
                            variant="secondary"
                            className="app-modal-button"
                            onClick={onCancel || onClose}
                            disabled={isProcessing}
                        >
                            {cancelText}
                        </Button>
                    )}

                    <Button
                        type="button"
                        variant="primary"
                        className="app-modal-button"
                        onClick={onConfirm || onClose}
                        disabled={isProcessing}
                    >
                        {confirmText}
                    </Button>
                </div>
            </div>
        </div>
    );
}

export default Modal;