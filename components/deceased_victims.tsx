'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableCaption,
} from '@/components/ui/table';
import { Card, CardContent } from '@/components/ui/card';
import { Search, AlertTriangle, ArrowLeft, FileText } from 'lucide-react';
import { DeceasedData } from '@/interfaces/DisasterData';
import { Footer } from './footer';
import { Button } from './ui/button';
import { Header } from './header';

interface DeceasedVictimsProps {
  initialData: DeceasedData[];
  lastUpdate: any;
}

export function DeceasedVictims({ initialData, lastUpdate }: DeceasedVictimsProps) {
  const [data] = useState<DeceasedData[]>(initialData);
  const [searchTerm, setSearchTerm] = useState('');
  const [descriptionFilter, setDescriptionFilter] = useState('all');
  const router = useRouter();

  const descriptionOptions = useMemo(() => {
    const unique = new Set<string>();
    data.forEach((item) => {
      if (item.description) {
        unique.add(item.description.trim());
      }
    });
    return Array.from(unique).sort((a, b) => a.localeCompare(b, 'id'));
  }, [data]);

  // Filter data based on search term and description
  const filteredData = useMemo(() => {
    const search = searchTerm.toLowerCase();

    return data.filter((item) => {
      const normalizedDescription = (item.description ?? '').toString().trim().toLowerCase();
      const matchesSearch =
        !searchTerm ||
        item.name.toLowerCase().includes(search) ||
        (item.no ?? '').toString().includes(search) ||
        item.umur.toString().includes(search) ||
        item.alamat.toString().includes(search) ||
        normalizedDescription.includes(search);

      const matchesDescription =
        descriptionFilter === 'all' || normalizedDescription === descriptionFilter;

      return matchesSearch && matchesDescription;
    });
  }, [data, searchTerm, descriptionFilter]);

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

          <Header
            lastUpdateDate={lastUpdateDate}
            showActions={false}
            title="Daftar Korban Meninggal"
          />

          {/* Search */}
          <section
            aria-labelledby="search-title"
            className="space-y-4 rounded-xl border-2 border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 p-5 md:p-6"
          >
            <div className="flex flex-col gap-2">
              <p
                id="search-title"
                className="text-base font-bold text-slate-900 dark:text-slate-100"
              >
                🔍 Cari Data Korban
              </p>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Gunakan kolom pencarian atau filter keterangan untuk mempersempit daftar.
              </p>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label htmlFor="victims-search" className="sr-only">
                  Masukkan kata kunci pencarian
                </label>
                <div className="relative">
                  <Search
                    className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"
                    aria-hidden
                  />
                  <Input
                    id="victims-search"
                    placeholder="Cari nama, nomor urut, usia, alamat, atau keterangan"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="h-12 rounded-xl border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 pl-12 text-base focus-visible:ring-2 focus-visible:ring-red-500"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="description-filter" className="sr-only">
                  Filter berdasarkan keterangan
                </label>
                <div className="relative">
                  <FileText
                    className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none"
                    aria-hidden
                  />
                  <select
                    id="description-filter"
                    value={descriptionFilter}
                    onChange={(e) => setDescriptionFilter(e.target.value)}
                    className="w-full h-12 rounded-xl border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 pl-12 pr-10 text-base font-medium text-slate-900 dark:text-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 appearance-none cursor-pointer"
                    style={{
                      backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
                      backgroundPosition: 'right 0.75rem center',
                      backgroundRepeat: 'no-repeat',
                      backgroundSize: '1.5em 1.5em',
                    }}
                  >
                    <option value="all">Semua Keterangan</option>
                    {descriptionOptions.map((option) => (
                      <option key={option} value={option.toLowerCase()}>
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
              <span className="text-red-600 dark:text-red-500">{filteredData.length}</span>
              <span>dari</span>
              <span className="text-red-600 dark:text-red-500">{data.length}</span>
              <span>korban ditampilkan</span>
            </div>
          </section>

          {/* Data Table */}
          <section aria-live="polite" className="space-y-4">
            <div className="overflow-hidden rounded-xl border-2 border-slate-200 dark:border-slate-800 shadow-lg bg-white dark:bg-slate-950">
              <div className="p-0">
                {data.length === 0 ? (
                  <div className="flex flex-col items-center justify-center gap-2 py-12 text-center text-muted-foreground">
                    <AlertTriangle className="h-8 w-8" aria-hidden />
                    <p className="font-semibold">Data korban belum tersedia.</p>
                    <p className="text-sm">Mohon periksa kembali nanti.</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader className="bg-slate-100 dark:bg-slate-900 text-xs uppercase tracking-wider">
                        <TableRow className="border-b-2 border-slate-300 dark:border-slate-700">
                          <TableHead className="w-20 py-4 px-4 font-bold text-slate-700 dark:text-slate-300">
                            No
                          </TableHead>
                          <TableHead className="min-w-[180px] py-4 px-4 font-bold text-slate-700 dark:text-slate-300">
                            Nama
                          </TableHead>
                          <TableHead className="min-w-[100px] py-4 px-4 font-bold text-slate-700 dark:text-slate-300">
                            Umur
                          </TableHead>
                          <TableHead className="min-w-[200px] py-4 px-4 font-bold text-slate-700 dark:text-slate-300">
                            Alamat
                          </TableHead>
                          <TableHead className="min-w-[220px] py-4 px-4 font-bold text-slate-700 dark:text-slate-300">
                            Keterangan
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredData.map((item, index) => (
                          <TableRow
                            key={item.id ?? index}
                            className={`text-[13px] transition-colors hover:bg-slate-50 dark:hover:bg-slate-900/50 ${index % 2 === 0 ? 'bg-white dark:bg-slate-950' : 'bg-slate-50/30 dark:bg-slate-900/30'}`}
                          >
                            <TableCell className="font-bold text-slate-500 dark:text-slate-400 py-3.5 px-4">
                              {item.no}
                            </TableCell>
                            <TableCell className="font-semibold py-3.5 px-4 text-slate-900 dark:text-slate-100">
                              {item.name}
                            </TableCell>
                            <TableCell className="py-3.5 px-4 text-slate-700 dark:text-slate-300">
                              {item.umur}
                            </TableCell>
                            <TableCell className="whitespace-pre-line py-3.5 px-4 text-slate-700 dark:text-slate-300">
                              {item.alamat}
                            </TableCell>
                            <TableCell className="whitespace-pre-line py-3.5 px-4 text-slate-700 dark:text-slate-300">
                              {item.description}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </div>
            </div>

            {data.length > 0 && filteredData.length === 0 && (
              <div
                className="rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 p-8 text-center"
                role="status"
              >
                <p className="text-lg font-semibold text-slate-700 dark:text-slate-300">
                  Tidak ada data yang sesuai dengan pencarian.
                </p>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
                  Coba gunakan kata kunci lain.
                </p>
              </div>
            )}
          </section>

          <Footer />
        </div>
      </div>
    </div>
  );
}
