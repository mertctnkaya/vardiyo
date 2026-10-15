export default function PageLoader() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] w-full gap-4 animate-fade-in">
      <div className="relative flex items-center justify-center">
        {/* Ambient glow behind spinner */}
        <div className="absolute w-16 h-16 bg-indigo-600/20 rounded-full blur-xl animate-pulse"></div>
        <span className="loading loading-spinner loading-lg text-indigo-500 relative z-10"></span>
      </div>
      <p className="text-xs font-medium text-base-content/40 tracking-wider uppercase animate-pulse">
        Yükleniyor...
      </p>
    </div>
  );
}

