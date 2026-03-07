export default function Loading() {
 return (
 <div className="flex items-center justify-center min-h-[60vh] px-4">
 <div className="flex flex-col items-center gap-4">
 {/* Pulsing Loading Spinner */}
 <div className="relative flex h-10 w-10">
 <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-400 opacity-20"></span>
 <span className="relative inline-flex rounded-full h-10 w-10 border-2 border-brand-500 border-t-transparent animate-spin"></span>
 </div>
 <p className="text-sm font-medium text-foreground0 animate-pulse delay-75">
 Loading content...
 </p>
 </div>
 </div>
 )
}
