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
    <div className="container mx-auto max-w-6xl py-10 px-4 md:px-6">
      <div className="flex flex-col gap-8">
        <Button
          variant="ghost"
          onClick={() => router.push('/')}
          className="w-fit gap-2 px-0 text-sm font-medium text-muted-foreground hover:text-foreground"
          aria-label="Kembali ke halaman utama"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden />
          Kembali ke beranda
        </Button>

        <Header lastUpdateDate={lastUpdateDate} showActions={false} title="Titik Lokasi Helipad" />

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Cari kecamatan, desa, koordinat, atau keterangan lokasi"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Table */}
        {filteredData.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            Tidak ada data yang sesuai dengan pencarian
          </div>
        )}
        {filteredData.length > 0 && (
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableCaption className="px-6 text-left pb-2">
                    Daftar titik lokasi helipad untuk operasi evakuasi dan bantuan di Kabupaten
                    Tapanuli Tengah.
                  </TableCaption>
                  <TableHeader className="sticky top-0 z-10 bg-background/95 backdrop-blur">
                    <TableRow className="text-xs uppercase tracking-wide">
                      <TableHead className="w-16 font-semibold">NO</TableHead>
                      <TableHead className="min-w-[140px] font-semibold">Kecamatan</TableHead>
                      <TableHead className="min-w-[180px] font-semibold">Desa</TableHead>
                      <TableHead className="min-w-[140px] font-semibold">Latitude</TableHead>
                      <TableHead className="min-w-[140px] font-semibold">Longitude</TableHead>
                      <TableHead className="min-w-[200px] font-semibold">
                        Keterangan Titik Lokasi
                      </TableHead>
                      <TableHead className="w-24 font-semibold text-center">Peta</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredData.map((item, index) => {
                      const mapsLink = getGoogleMapsLink(item.latitude, item.longitude);

                      return (
                        <TableRow key={item.id} className="text-sm">
                          <TableCell className="font-medium text-muted-foreground">
                            {index + 1}
                          </TableCell>
                          <TableCell className="font-medium">{item.kecamatan || '-'}</TableCell>
                          <TableCell>{item.desa}</TableCell>
                          <TableCell className="font-mono text-xs">
                            {item.latitude || '-'}
                          </TableCell>
                          <TableCell className="font-mono text-xs">
                            {item.longitude || '-'}
                          </TableCell>
                          <TableCell>{item.keterangan || '-'}</TableCell>
                          <TableCell className="text-center">
                            {mapsLink ? (
                              <Button
                                variant="ghost"
                                size="sm"
                                asChild
                                className="h-8 w-8 p-0"
                                aria-label="Buka di Google Maps"
                              >
                                <a
                                  href={mapsLink}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-primary hover:text-primary/80"
                                >
                                  <MapPin className="h-4 w-4" />
                                </a>
                              </Button>
                            ) : (
                              <span className="text-muted-foreground">-</span>
                            )}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        )}

        <Footer />
      </div>
    </div>
  );
}
