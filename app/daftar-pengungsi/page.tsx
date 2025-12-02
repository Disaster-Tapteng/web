import { Evacuees } from '@/components/evacuees';
import { getSheetData, getSheetLastUpdate, getSpreadsheetId } from '../../lib/sheet/google-sheets';
import { mapSheetDataEvacuee } from '../../utils/dataMapper';

export const revalidate = 300;

export default async function EvacueesPage() {
  const spreadsheetId = getSpreadsheetId();
  const lastUpdate = await getSheetLastUpdate(spreadsheetId);

  const [tukkaRaw, gorPandanRaw, hotelHasianRaw, jayaGreenRaw, sibuluanNauliRaw] =
    await Promise.all([
      getSheetData('PENGUNSI-TUKKA!B7:B', spreadsheetId),
      getSheetData('PENGUNSI-GOR PANDAN!B6:B', spreadsheetId),
      getSheetData('PENGUNGSI-HOTEL HASIAN DAN CC!B8:B', spreadsheetId),
      getSheetData('PENGUNGSI-JAYA GREEN!B7:B', spreadsheetId),
      getSheetData('PENGUNGSI-LINK 1 SIBULUAN NAULI!B2:B', spreadsheetId),
    ]);

  const tukka = mapSheetDataEvacuee(tukkaRaw ?? [], 'Kecamatan Tukka');
  const gorPandan = mapSheetDataEvacuee(gorPandanRaw ?? [], 'Gedung Serba Guna Pandan');
  const hotelHasian = mapSheetDataEvacuee(
    hotelHasianRaw ?? [],
    'Hotel Hasian / Pastoran Santo Yosef',
  );
  const jayaGreen = mapSheetDataEvacuee(jayaGreenRaw ?? [], 'Jaya Green - Terminal Baru');
  const sibuluanNauli = mapSheetDataEvacuee(
    sibuluanNauliRaw ?? [],
    'Huta Godang Kel. Sibuluan Nauli',
  );

  const initialData = [...tukka, ...gorPandan, ...hotelHasian, ...jayaGreen, ...sibuluanNauli];

  return (
    <main className="min-h-screen bg-background">
      <Evacuees initialData={initialData} lastUpdate={lastUpdate} />
    </main>
  );
}
