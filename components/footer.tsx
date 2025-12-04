import { Paperclip, Phone, AlertCircle } from 'lucide-react';

export function Footer() {
  return (
    <footer className="relative overflow-hidden rounded-2xl border border-gray-200 bg-gradient-to-br from-gray-50 to-gray-100/50 p-6 shadow-lg dark:border-gray-800 dark:from-gray-900 dark:to-gray-800/50 sm:rounded-3xl sm:p-8">
      <div className="relative flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between lg:gap-8">
        {/* Data Source Section */}
        <div className="flex flex-1 items-start gap-3 sm:gap-4">
          <div className="shrink-0 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 p-2.5 shadow-md dark:from-blue-600 dark:to-blue-700 sm:p-3">
            <Paperclip className="h-4 w-4 text-white sm:h-5 sm:w-5" aria-hidden="true" />
          </div>
          <div className="space-y-1">
            <p className="text-sm leading-relaxed text-gray-700 dark:text-gray-300 sm:text-base">
              <span className="font-bold text-gray-900 dark:text-white">Sumber data resmi:</span>{' '}
              BPBD Kabupaten Tapanuli Tengah dan laporan posko tanggap darurat terpadu.
            </p>
          </div>
        </div>

        {/* Emergency Call Center Section */}
        <div className="flex flex-col gap-3 rounded-xl border border-red-200 bg-gradient-to-br from-red-50 to-orange-50 p-4 shadow-md dark:border-red-900 dark:from-red-950/50 dark:to-orange-950/50 sm:min-w-[280px] sm:p-5">
          <div className="flex items-center gap-2">
            <div className="rounded-full bg-red-100 p-1.5 dark:bg-red-900/50">
              <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400" aria-hidden="true" />
            </div>
            <p className="text-xs font-bold uppercase tracking-wider text-red-700 dark:text-red-400 sm:text-sm">
              Call Center Darurat BPBD
            </p>
          </div>

          <a
            href="tel:081290900222"
            className="group inline-flex items-center gap-2.5 rounded-lg bg-white/80 px-4 py-3 shadow-sm transition-all hover:scale-[1.02] hover:shadow-md dark:bg-gray-900/80 sm:gap-3"
          >
            <div className="rounded-full bg-red-100 p-2 transition-colors group-hover:bg-red-200 dark:bg-red-900/50 dark:group-hover:bg-red-900">
              <Phone
                className="h-4 w-4 text-red-600 transition-transform group-hover:rotate-12 dark:text-red-400 sm:h-5 sm:w-5"
                aria-hidden="true"
              />
            </div>
            <span className="text-lg font-extrabold text-red-700 dark:text-red-400 sm:text-xl">
              0812-9090-0222
            </span>
          </a>

          <p className="text-xs text-gray-600 dark:text-gray-400 sm:text-sm">
            Tersedia 24 jam untuk laporan keadaan darurat.
          </p>
        </div>
      </div>
    </footer>
  );
}
