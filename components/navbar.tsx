import Link from "next/link";
import Image from "next/image";

export default function Navbar({ isGameOpen, setIsGameOpen }: { isGameOpen: boolean, setIsGameOpen: (open: boolean) => void }) {
  return (
    <nav className="w-full flex justify-center border-b border-[#232733] h-16 bg-[#1B2028]">
      <div className="w-full max-w-5xl flex justify-between items-center p-3 px-5 text-sm">
        <div className="flex gap-5 items-center font-semibold">
          <Link href="/" className="text-[#36D399] font-bold text-lg flex items-center gap-2 text-">
            <Image src="/images/logo.png" alt="Logo" width={30} height={30} className="rounded-full" />
            ReelsFiend
          </Link>
        </div>
        <div className="flex items-center gap-4">
          {/* Subway Surfers Toggle Button */}
          <button
            onClick={() => setIsGameOpen(!isGameOpen)}
            className="px-4 py-2 rounded-full font-bold shadow border border-[#36D399] bg-transparent text-[#36D399] hover:bg-[#36D399] hover:text-[#181C23] transition-colors focus:outline-none focus:ring-2 focus:ring-[#36D399] focus:ring-offset-2"
          >
            🚇 {isGameOpen ? 'Close' : 'Weak attention span?'}
          </button>
          <Link
            href="/protected"
            className="px-6 py-2 rounded-full font-bold shadow border border-[#36D399] bg-[#36D399] text-[#181C23] hover:bg-transparent hover:text-[#36D399] transition-colors focus:outline-none focus:ring-2 focus:ring-[#36D399] focus:ring-offset-2"
          >
            Enter Dashboard
          </Link>
        </div>
      </div>
    </nav>
  );
}
