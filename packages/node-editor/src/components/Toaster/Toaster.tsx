import React from "react";
import styles from "./Toaster.module.css";
import { toastActions } from "../../reducers";

type ToasterProps = {
  toasts: readonly toast[];
  dispatchToasts: React.Dispatch<toastActions>;
};

export const Toaster: React.FC<ToasterProps> = ({
  toasts = [],
  dispatchToasts,
}) => {
  const setHeight = React.useCallback(
    (id, height) => {
      dispatchToasts({
        type: "SET_HEIGHT",
        id,
        height,
      });
    },
    [dispatchToasts]
  );

  const startExit = React.useCallback(
    (id) => {
      dispatchToasts({
        type: "SET_EXITING",
        id,
      });
    },
    [dispatchToasts]
  );

  const removeToast = React.useCallback(
    (id) => {
      dispatchToasts({
        type: "REMOVE_TOAST",
        id,
      });
    },
    [dispatchToasts]
  );

  return (
    <div className={styles.toaster}>
      {toasts.map((toast, i) => {
        return (
          <Toast
            toast={toast}
            onHeightReceived={setHeight}
            onExitRequested={startExit}
            onRemoveRequested={removeToast}
            y={toasts.slice(0, i + 1).reduce((y, t) => t.height + y + 5, 0)}
            key={toast.id}
            {...toast}
          />
        );
      })}
    </div>
  );
};

export type toastType = "warning" | "info" | "danger" | "success";
export type toast = {
  readonly id: string;
  readonly title: string;
  readonly message: string;
  readonly duration: number;
  readonly height: number;
  readonly type: toastType;
  readonly exiting?: boolean;
};

type ToastProps = {
  toast: toast;
  y: number;
  onHeightReceived: (id: string, height: number) => void;
  onExitRequested: (id: string) => void;
  onRemoveRequested: (id: string) => void;
};

const Toast: React.FC<ToastProps> = ({
  toast,
  y,
  onHeightReceived,
  onExitRequested,
  onRemoveRequested,
}) => {
  const [paused, setPaused] = React.useState(false);
  const wrapper = React.useRef<HTMLDivElement>(null);
  const timer = React.useRef<any>();

  const stopTimer = React.useCallback(() => {
    setPaused(true);
    clearTimeout(timer.current);
  }, []);

  const resumeTimer = React.useCallback(() => {
    setPaused(false);
    timer.current = setTimeout(() => onExitRequested(toast.id), toast.duration);
  }, [toast.id, toast.duration, onExitRequested]);

  React.useLayoutEffect(() => {
    const height = wrapper?.current?.getBoundingClientRect().height;
    onHeightReceived(toast.id, height!);
  }, [onHeightReceived, toast.id]);

  React.useEffect(() => {
    resumeTimer();
    return stopTimer;
  }, [resumeTimer, stopTimer]);

  const handleAnimationEnd = () => {
    if (toast.exiting) {
      onRemoveRequested(toast.id);
    }
  };

  return (
    <div
      ref={wrapper}
      className={styles.toast}
      data-type={toast.type}
      style={{ transform: `translateY(-${y}px)` }}
      data-exiting={toast.exiting}
      onAnimationEnd={handleAnimationEnd}
      onMouseEnter={stopTimer}
      onMouseLeave={resumeTimer}
      role="alert"
    >
      {toast.title ? <span className={styles.title}>{toast.title}</span> : null}
      <p>{toast.message}</p>
      {!paused && (
        <div
          className={styles.timer}
          style={{ animationDuration: `${toast.duration}ms` }}
          onAnimationEnd={(e) => e.stopPropagation()}
        />
      )}
      <button
        className={styles.exitButton}
        onClick={() => {
          stopTimer();
          onExitRequested(toast.id);
        }}
      >
        ✕
      </button>
    </div>
  );
};
