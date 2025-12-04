'use client';

import { useState, useMemo, useEffect } from 'react';
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
import { Search, ChevronDown, ChevronRight, ArrowLeft } from 'lucide-react';
import { Footer } from './footer';
import { useRouter } from 'next/navigation';
import { Header } from './header';
import { Button } from './ui/button';

export interface RefugeePosko {
  no: number;
  nama: string;
  jumlah: string;
}

export interface RefugeeData {
  post: {
    kecamatan: string;
    posko: RefugeePosko[];
  }[];
  total: number;
}

interface RefugeeProps {
  initialData: RefugeeData;
  lastUpdate: any;
}

export function Posko({ initialData, lastUpdate }: RefugeeProps) {
  const [data] = useState<RefugeeData>(initialData);
  const [searchTerm, setSearchTerm] = useState('');
  const [openKecamatan, setOpenKecamatan] = useState<Record<string, boolean>>({});
  const [defaultOpen, setDefaultOpen] = useState<Record<string, boolean>>({});
  const router = useRouter();

  const lastUpdateDate = lastUpdate && lastUpdate[0] && lastUpdate[0][1];

  const filteredData = useMemo(() => {
    const s = searchTerm.toLowerCase();

    return data.post
      .map((item) => {
        const poskoFiltered = item.posko.filter(
          (p) =>
            p.nama.toLowerCase().includes(s) ||
            p.no.toString().includes(s) ||
            p.jumlah.toLowerCase().includes(s),
        );

        if (item.kecamatan.toLowerCase().includes(s)) {
          return item;
        }

        return { ...item, posko: poskoFiltered };
      })
      .filter((item) => item.posko.length > 0 || item.kecamatan.toLowerCase().includes(s));
  }, [searchTerm, data]);

  useEffect(() => {
    if (searchTerm === '') {
      setOpenKecamatan(defaultOpen);
      return;
    }

    const allOpen: Record<string, boolean> = {};
    filteredData.forEach((item) => {
      allOpen[item.kecamatan] = true;
    });

    setOpenKecamatan(allOpen);
  }, [searchTerm, filteredData, defaultOpen]);

  const toggleKecamatan = (name: string) => {
    setOpenKecamatan((prev) => ({
      ...prev,
      [name]: !prev[name],
    }));
  };

  useEffect(() => {
    const all: Record<string, boolean> = {};
    data.post.forEach((item) => {
      all[item.kecamatan] = true;
    });

    setDefaultOpen(all);
    setOpenKecamatan(all);
  }, [data]);

  const handleRowClick = (nama: string, jumlah: string) => {
    // Only navigate if jumlah > 0
    if (parseInt(jumlah) > 0) {
      router.push(`/daftar-pengungsi`);
    }
  };

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
            title="Daftar Posko Pengungsi"
          />

          {/* Search */}
          <section className="space-y-4 rounded-xl border-2 border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 p-5 md:p-6">
            <div className="flex flex-col gap-2">
              <p className="text-base font-bold text-slate-900 dark:text-slate-100">
                🔍 Cari Posko Pengungsian
              </p>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Cari berdasarkan nama posko, kecamatan, atau jumlah pengungsi.
              </p>
            </div>
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Cari posko / kecamatan / jumlah"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="h-12 rounded-xl border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 pl-12 text-base focus-visible:ring-2 focus-visible:ring-green-500"
              />
            </div>
          </section>

          {/* Table */}
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
          {filteredData.length > 0 && (
            <div className="overflow-hidden rounded-xl border-2 border-slate-200 dark:border-slate-800 shadow-lg bg-white dark:bg-slate-950">
              <div className="overflow-x-auto">
                {filteredData.map((item) => (
                  <div key={item.kecamatan}>
                    {/* Kecamatan Header */}
                    <button
                      onClick={() => toggleKecamatan(item.kecamatan)}
                      className="w-full flex items-center justify-between px-6 py-4 bg-slate-100 dark:bg-slate-900 border-b-2 border-slate-200 dark:border-slate-800 text-left hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
                    >
                      <span className="font-black text-lg text-slate-900 dark:text-slate-100">
                        {item.kecamatan}
                      </span>
                      {openKecamatan[item.kecamatan] ? (
                        <ChevronDown className="h-5 w-5 text-slate-700 dark:text-slate-300" />
                      ) : (
                        <ChevronRight className="h-5 w-5 text-slate-700 dark:text-slate-300" />
                      )}
                    </button>

                    {/* POSKO TABLE */}
                    {openKecamatan[item.kecamatan] && (
                      <Table>
                        <TableHeader>
                          <TableRow className="bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-800">
                            <TableHead className="w-16 py-3 px-4 font-bold text-slate-700 dark:text-slate-300">
                              NO
                            </TableHead>
                            <TableHead className="py-3 px-4 font-bold text-slate-700 dark:text-slate-300">
                              NAMA POSKO
                            </TableHead>
                            <TableHead className="text-right py-3 px-4 font-bold text-slate-700 dark:text-slate-300">
                              JUMLAH PENGUNGSI
                            </TableHead>
                          </TableRow>
                        </TableHeader>

                        <TableBody>
                          {item.posko.map((p, idx) => {
                            const isClickable = parseInt(p.jumlah) > 0;

                            return (
                              <TableRow
                                key={idx}
                                onClick={() => handleRowClick(p.nama, p.jumlah)}
                                className={`text-[13px] transition-colors ${isClickable ? 'hover:bg-slate-50 dark:hover:bg-slate-900/50 cursor-pointer' : 'opacity-60 cursor-default'} ${idx % 2 === 0 ? 'bg-white dark:bg-slate-950' : 'bg-slate-50/30 dark:bg-slate-900/30'}`}
                              >
                                <TableCell className="font-bold text-slate-500 dark:text-slate-400 py-3.5 px-4">
                                  {p.no}
                                </TableCell>
                                <TableCell className="font-semibold py-3.5 px-4 text-slate-900 dark:text-slate-100">
                                  {p.nama}
                                </TableCell>
                                <TableCell className="text-right py-3.5 px-4 font-bold text-green-600 dark:text-green-500">
                                  {p.jumlah}
                                </TableCell>
                              </TableRow>
                            );
                          })}
                        </TableBody>
                      </Table>
                    )}
                  </div>
                ))}
                <div className="p-6 border-t-2 border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-900 flex justify-end">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-base text-slate-700 dark:text-slate-300">
                      Total Pengungsi:
                    </span>
                    <span className="font-black text-2xl text-green-600 dark:text-green-500">
                      {data.total.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          <Footer />
        </div>
      </div>
    </div>
  );
}
