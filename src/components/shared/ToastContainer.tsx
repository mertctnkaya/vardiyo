import { useToastStore } from '../../store/useToastStore';

export default function ToastContainer() {
  const { toasts, removeToast } = useToastStore();

  return (
    <div className="toast toast-top toast-center z-[99999] w-full max-w-sm px-4 mt-safe-top transition-all pointer-events-none">
      {toasts.map((toast) => {
        let alertClass = 'alert-info bg-indigo-900/90 text-indigo-100 border-indigo-500/50';
        let icon = (
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-current shrink-0 w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
        );

        if (toast.type === 'success') {
          alertClass = 'alert-success bg-emerald-900/90 text-emerald-100 border-emerald-500/50';
          icon = (
            <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          );
        } else if (toast.type === 'error') {
          alertClass = 'alert-error bg-red-900/90 text-red-100 border-red-500/50';
          icon = (
            <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          );
        } else if (toast.type === 'warning') {
          alertClass = 'alert-warning bg-amber-900/90 text-amber-100 border-amber-500/50';
          icon = (
            <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
          );
        }

        return (
          <div
            key={toast.id}
            className={`alert ${alertClass} shadow-2xl backdrop-blur-md border animate-fade-in pointer-events-auto flex justify-between cursor-pointer`}
            onClick={() => removeToast(toast.id)}
          >
            <div className="flex items-center gap-3">
              {icon}
              <span className="font-semibold text-sm">{toast.message}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

