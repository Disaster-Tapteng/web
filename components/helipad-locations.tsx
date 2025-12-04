'use client';

import { useState, useMemo } from 'react';
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
import { Search, ArrowLeft, MapPin } from 'lucide-react';
import { Footer } from './footer';
import { useRouter } from 'next/navigation';
import { Header } from './header';
import { Button } from './ui/button';
import { HelipadLocationData } from '@/interfaces/DisasterData';

interface HelipadLocationsProps {
  initialData: HelipadLocationData[];
  lastUpdate: any;
}

export function HelipadLocations({ initialData, lastUpdate }: HelipadLocationsProps) {
  const [data] = useState<HelipadLocationData[]>(initialData);
  const [searchTerm, setSearchTerm] = useState('');
  const router = useRouter();

  const lastUpdateDate = lastUpdate && lastUpdate[0] && lastUpdate[0][1];

  const filteredData = useMemo(() => {
    if (!searchTerm) return data;

    const search = searchTerm.toLowerCase();
    return data.filter((item) => {
      return (
        item.kecamatan.toLowerCase().includes(search) ||
        item.desa.toLowerCase().includes(search) ||
        item.latitude.toLowerCase().includes(search) ||
        item.longitude.toLowerCase().includes(search) ||
        item.keterangan.toLowerCase().includes(search) ||
        (item.no !== null && item.no.toString().includes(search))
      );
    });
  }, [data, searchTerm]);

  // Helper function to convert coordinates to decimal format if needed
  const parseCoordinate = (coord: string): number | null => {
    if (!coord || coord.trim() === '') return null;

    // Check if it's already in decimal format
    const decimalMatch = coord.match(/^([+-]?\d+\.?\d*)/);
    if (decimalMatch) {
      const value = parseFloat(decimalMatch[1]);
      if (!isNaN(value)) return value;
    }

    // Try to parse DMS format (e.g., "1°40'39"N")
    const dmsMatch = coord.match(/(\d+)°(\d+)'(\d+)"([NSEW])/);
    if (dmsMatch) {
      const degrees = parseFloat(dmsMatch[1]);
      const minutes = parseFloat(dmsMatch[2]);
      const seconds = parseFloat(dmsMatch[3]);
      const direction = dmsMatch[4];

      let decimal = degrees + minutes / 60 + seconds / 3600;
      if (direction === 'S' || direction === 'W') {
        decimal = -decimal;
      }

      return decimal;
    }

    return null;
  };

  // Generate Google Maps link
  const getGoogleMapsLink = (latitude: string, longitude: string): string | null => {
    const lat = parseCoordinate(latitude);
    const lng = parseCoordinate(longitude);

    if (lat !== null && lng !== null) {
      return `https://www.google.com/maps?q=${lat},${lng}`;
    }

    return null;
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
            title="Titik Lokasi Helipad"
          />

          {/* Search */}
          <section className="space-y-4 rounded-xl border-2 border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 p-5 md:p-6">
            <div className="flex flex-col gap-2">
              <p className="text-base font-bold text-slate-900 dark:text-slate-100">
                🔍 Cari Lokasi Helipad
              </p>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Cari berdasarkan kecamatan, desa, koordinat, atau keterangan lokasi.
              </p>
            </div>
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Cari kecamatan, desa, koordinat, atau keterangan lokasi"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="h-12 rounded-xl border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 pl-12 text-base focus-visible:ring-2 focus-visible:ring-blue-500"
              />
            </div>
            <div className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-950 px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-800 w-fit">
              <span className="text-blue-600 dark:text-blue-500">{filteredData.length}</span>
              <span>dari</span>
              <span className="text-blue-600 dark:text-blue-500">{data.length}</span>
              <span>lokasi ditampilkan</span>
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
                <Table>
                  <TableHeader className="bg-slate-100 dark:bg-slate-900">
                    <TableRow className="text-xs uppercase tracking-wider border-b-2 border-slate-300 dark:border-slate-700">
                      <TableHead className="w-16 py-4 px-4 font-bold text-slate-700 dark:text-slate-300">
                        NO
                      </TableHead>
                      <TableHead className="min-w-[140px] py-4 px-4 font-bold text-slate-700 dark:text-slate-300">
                        Kecamatan
                      </TableHead>
                      <TableHead className="min-w-[180px] py-4 px-4 font-bold text-slate-700 dark:text-slate-300">
                        Desa
                      </TableHead>
                      <TableHead className="min-w-[140px] py-4 px-4 font-bold text-slate-700 dark:text-slate-300">
                        Latitude
                      </TableHead>
                      <TableHead className="min-w-[140px] py-4 px-4 font-bold text-slate-700 dark:text-slate-300">
                        Longitude
                      </TableHead>
                      <TableHead className="min-w-[200px] py-4 px-4 font-bold text-slate-700 dark:text-slate-300">
                        Keterangan Titik Lokasi
                      </TableHead>
                      <TableHead className="w-24 py-4 px-4 font-bold text-center text-slate-700 dark:text-slate-300">
                        Peta
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredData.map((item, index) => {
                      const mapsLink = getGoogleMapsLink(item.latitude, item.longitude);

                      return (
                        <TableRow
                          key={item.id}
                          className={`text-[13px] transition-colors hover:bg-slate-50 dark:hover:bg-slate-900/50 ${index % 2 === 0 ? 'bg-white dark:bg-slate-950' : 'bg-slate-50/30 dark:bg-slate-900/30'}`}
                        >
                          <TableCell className="font-bold text-slate-500 dark:text-slate-400 py-3.5 px-4">
                            {index + 1}
                          </TableCell>
                          <TableCell className="font-semibold py-3.5 px-4 text-slate-900 dark:text-slate-100">
                            {item.kecamatan || '-'}
                          </TableCell>
                          <TableCell className="py-3.5 px-4 text-slate-700 dark:text-slate-300">
                            {item.desa}
                          </TableCell>
                          <TableCell className="font-mono text-xs py-3.5 px-4 text-slate-600 dark:text-slate-400">
                            {item.latitude || '-'}
                          </TableCell>
                          <TableCell className="font-mono text-xs py-3.5 px-4 text-slate-600 dark:text-slate-400">
                            {item.longitude || '-'}
                          </TableCell>
                          <TableCell className="py-3.5 px-4 text-slate-700 dark:text-slate-300">
                            {item.keterangan || '-'}
                          </TableCell>
                          <TableCell className="text-center py-3.5 px-4">
                            {mapsLink ? (
                              <Button
                                variant="ghost"
                                size="sm"
                                asChild
                                className="h-9 w-9 p-0 hover:bg-blue-100 dark:hover:bg-blue-950"
                                aria-label="Buka di Google Maps"
                              >
                                <a
                                  href={mapsLink}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-blue-600 dark:text-blue-500 hover:text-blue-700 dark:hover:text-blue-400"
                                >
                                  <MapPin className="h-5 w-5" />
                                </a>
                              </Button>
                            ) : (
                              <span className="text-slate-400 dark:text-slate-600">-</span>
                            )}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            </div>
          )}

          <Footer />
        </div>
      </div>
    </div>
  );
}
