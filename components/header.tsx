'use client';

import { PhoneCall, AlertCircle } from 'lucide-react';
import { Button } from './ui/button';
import { useRouter } from 'next/navigation';

interface HeaderProps {
  lastUpdateDate: string | null;
  showActions?: boolean;
  title: string;
}

export function Header({ lastUpdateDate, showActions = false, title }: HeaderProps) {
  const router = useRouter();

  const handleNavigateToVictims = () => {
    router.push('/daftar-korban');
  };

  return (
    <header className="relative overflow-hidden">
      <div className="relative mx-auto max-w-5xl">
        {/* Top Badge */}
        <div className="mb-6 flex justify-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-red-200 bg-white/80 px-4 py-2 shadow-sm backdrop-blur-sm dark:border-red-800 dark:bg-gray-900/80">
            <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
            <span className="text-xs font-semibold uppercase tracking-wider text-red-700 dark:text-red-300">
              Informasi Resmi
            </span>
            <span className="rounded-full bg-orange-500 px-3 py-1 text-xs font-bold text-white shadow-md">
              BPBD Tapanuli Tengah
            </span>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex flex-col items-center gap-6 text-center">
          {/* Logo with enhanced styling */}
          <div className="relative">
            <img
              src="/logo-tapteng.png"
              alt="Logo BPBD Kabupaten Tapanuli Tengah"
              className="relative h-24 w-auto drop-shadow-lg transition-transform hover:scale-105 sm:h-28 lg:h-32"
              loading="lazy"
            />
          </div>

          {/* Title Section */}
          <div className="space-y-3">
            <h1 className="bg-gradient-to-r from-red-700 via-orange-600 to-red-700 bg-clip-text text-2xl font-extrabold tracking-tight text-transparent dark:from-red-400 dark:via-orange-400 dark:to-red-400 sm:text-3xl lg:text-4xl">
              {title}
            </h1>

            {/* Update Info */}
            <div className="mx-auto flex max-w-full flex-col items-center gap-1.5 rounded-lg border border-gray-200 bg-white/60 px-4 py-2.5 backdrop-blur-sm dark:border-gray-700 dark:bg-gray-900/60 sm:inline-flex sm:flex-row sm:gap-2 sm:px-5 sm:py-3">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <div className="h-2 w-2 shrink-0 animate-pulse rounded-full bg-green-500" />
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Update terakhir: <span className="hidden sm:inline"></span>
                </p>
              </div>
              <span className="text-sm font-bold text-gray-900 dark:text-white">
                {lastUpdateDate ?? 'Tanggal tidak tersedia'}
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          {showActions && (
            <div className="mt-2 flex w-full flex-col gap-3 sm:flex-row sm:items-center sm:justify-center">
              <Button
                variant="secondary"
                onClick={handleNavigateToVictims}
                className="group relative overflow-hidden shadow-md transition-all hover:shadow-lg sm:min-w-[220px]"
              >
                <span className="relative z-10 flex items-center gap-2">
                  Lihat daftar korban meninggal
                </span>
              </Button>

              <Button
                variant="destructive"
                asChild
                className="group relative overflow-hidden shadow-md transition-all hover:shadow-lg sm:min-w-[220px]"
              >
                <a href="tel:081290900222" aria-label="Hubungi call center darurat">
                  <PhoneCall className="h-4 w-4 transition-transform group-hover:rotate-12" />
                  Hubungi BPBD TapTeng
                </a>
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
