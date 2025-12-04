'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent } from '@/components/ui/card';
import { Search, ArrowLeft, MapPin } from 'lucide-react';
import { EvacueeData } from '@/interfaces/DisasterData';
import { Footer } from './footer';
import { Button } from '@/components/ui/button';
import { Header } from './header';

interface EvacueesProps {
  initialData: EvacueeData[];
  lastUpdate: any;
}

export function Evacuees({ initialData, lastUpdate }: EvacueesProps) {
  const [data] = useState<EvacueeData[]>(initialData);
  const [searchTerm, setSearchTerm] = useState('');
  const [locationFilter, setLocationFilter] = useState('all');
  const [page, setPage] = useState(1);
  const pageSize = 50;
  const router = useRouter();

  const locationOptions = useMemo(() => {
    const unique = new Set<string>();
    data.forEach((item) => {
      if (item.location) {
        unique.add(item.location.trim());
      }
    });
    return Array.from(unique).sort((a, b) => a.localeCompare(b, 'id'));
  }, [data]);

  // Filter data based on search term and location
  const filteredData = useMemo(() => {
    const search = searchTerm.toLowerCase();

    return data.filter((item) => {
      const name = (item.name ?? '').toLowerCase();
      const location = (item.location ?? '').toLowerCase();

      const matchesSearch = !searchTerm || name.includes(search) || location.includes(search);

      const matchesLocation =
        locationFilter === 'all' || location.toLowerCase() === locationFilter.toLowerCase();

      return matchesSearch && matchesLocation;
    });
  }, [data, searchTerm, locationFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredData.length / pageSize));

  const paginatedData = useMemo(() => {
    const currentPage = Math.min(page, totalPages);
    const start = (currentPage - 1) * pageSize;
    return filteredData.slice(start, start + pageSize);
  }, [filteredData, page, pageSize, totalPages]);

  const lastUpdateDate = lastUpdate && lastUpdate[0] && lastUpdate[0][1];

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950">
      <div className="container mx-auto max-w-7xl py-8 px-4 md:px-6 lg:px-8">
        <div className="flex flex-col gap-6 md:gap-8">
          <Button
            variant="ghost"
            onClick={() => router.push('/')}
            className="w-fit gap-2 px-0 text-sm font-medium text-muted-foreground hover:text-foreground"
            aria-label="Kembali ke halaman utama"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden />
            Kembali ke beranda
          </Button>

          <Header lastUpdateDate={lastUpdateDate} showActions={false} title="Daftar Pengungsi" />

          {/* Search */}
          <section
            aria-labelledby="search-evacuees-title"
            className="space-y-4 rounded-xl border-2 border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 p-5 md:p-6"
          >
            <div className="flex flex-col gap-2">
              <p
                id="search-evacuees-title"
                className="text-base font-bold text-slate-900 dark:text-slate-100"
              >
                🔍 Cari Data Pengungsi
              </p>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Gunakan kolom pencarian atau filter lokasi untuk mempersempit daftar.
              </p>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label htmlFor="evacuees-search" className="sr-only">
                  Masukkan kata kunci pencarian
                </label>
                <div className="relative">
                  <Search
                    className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"
                    aria-hidden
                  />
                  <Input
                    id="evacuees-search"
                    placeholder="Cari nama atau lokasi pengungsian"
                    value={searchTerm}
                    onChange={(e) => {
                      setSearchTerm(e.target.value);
                      setPage(1);
                    }}
                    className="h-12 rounded-xl border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 pl-12 text-base focus-visible:ring-2 focus-visible:ring-amber-500"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="location-filter" className="sr-only">
                  Filter berdasarkan lokasi
                </label>
                <div className="relative">
                  <MapPin
                    className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none"
                    aria-hidden
                  />
                  <select
                    id="location-filter"
                    value={locationFilter}
                    onChange={(e) => {
                      setLocationFilter(e.target.value);
                      setPage(1);
                    }}
                    className="w-full h-12 rounded-xl border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 pl-12 pr-10 text-base font-medium text-slate-900 dark:text-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 appearance-none cursor-pointer"
                    style={{
                      backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
                      backgroundPosition: 'right 0.75rem center',
                      backgroundRepeat: 'no-repeat',
                      backgroundSize: '1.5em 1.5em',
                    }}
                  >
                    <option value="all">Semua Lokasi</option>
                    {locationOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
            <div
              className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-950 px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-800 w-fit"
              aria-live="polite"
            >
              <span className="text-amber-600 dark:text-amber-500">{filteredData.length}</span>
              <span>dari</span>
              <span className="text-amber-600 dark:text-amber-500">{data.length}</span>
              <span>pengungsi ditampilkan</span>
            </div>
          </section>

          <div className="overflow-hidden rounded-xl border-2 border-slate-200 dark:border-slate-800 shadow-lg bg-white dark:bg-slate-950">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-slate-100 dark:bg-slate-900">
                  <TableRow className="border-b-2 border-slate-300 dark:border-slate-700">
                    <TableHead className="w-16 py-4 px-4 font-bold text-slate-700 dark:text-slate-300">
                      NO
                    </TableHead>
                    <TableHead className="min-w-[200px] py-4 px-4 font-bold text-slate-700 dark:text-slate-300">
                      NAMA
                    </TableHead>
                    <TableHead className="min-w-[200px] py-4 px-4 font-bold text-slate-700 dark:text-slate-300">
                      LOKASI
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedData.map((item, index) => (
                    <TableRow
                      key={item.id}
                      className={`text-[13px] transition-colors hover:bg-slate-50 dark:hover:bg-slate-900/50 ${index % 2 === 0 ? 'bg-white dark:bg-slate-950' : 'bg-slate-50/30 dark:bg-slate-900/30'}`}
                    >
                      <TableCell className="font-bold text-slate-500 dark:text-slate-400 py-3.5 px-4">
                        {(page - 1) * pageSize + index + 1}
                      </TableCell>
                      <TableCell className="font-semibold py-3.5 px-4 text-slate-900 dark:text-slate-100">
                        {item.name}
                      </TableCell>
                      <TableCell className="py-3.5 px-4 text-slate-700 dark:text-slate-300">
                        {item.location}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-800">
            <div className="text-sm font-medium text-slate-700 dark:text-slate-300">
              Menampilkan{' '}
              <span className="font-bold text-amber-600 dark:text-amber-500">
                {filteredData.length === 0 ? 0 : (page - 1) * pageSize + 1}
              </span>{' '}
              -{' '}
              <span className="font-bold text-amber-600 dark:text-amber-500">
                {Math.min(page * pageSize, filteredData.length)}
              </span>{' '}
              dari{' '}
              <span className="font-bold text-amber-600 dark:text-amber-500">
                {filteredData.length}
              </span>{' '}
              pengungsi
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1}
                className="rounded-lg font-semibold"
              >
                Sebelumnya
              </Button>
              <span className="text-sm font-bold text-slate-700 dark:text-slate-300 px-3">
                Halaman {page} / {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page >= totalPages}
                className="rounded-lg font-semibold"
              >
                Selanjutnya
              </Button>
            </div>
          </div>

          <Footer />

          {filteredData.length === 0 && (
            <div className="rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 p-8 text-center">
              <p className="text-lg font-semibold text-slate-700 dark:text-slate-300">
                Tidak ada data yang sesuai dengan pencarian
              </p>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
                Coba gunakan kata kunci lain.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
