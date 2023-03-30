export interface ModalProps {
    show: boolean;
    setShow: (show: boolean) => void;
    onClose?: () => void;
}

export const Modal: React.FC<React.PropsWithChildren<ModalProps>> = props => {
    const { show, children } = props;

    return (
        <div className={cx("modal", { "modal-open": show })}>
            <div className="modal-box">{children}</div>
        </div>
    );
};
