import { getSheetData, getSheetLastUpdate, getSpreadsheetId } from '../../lib/sheet/google-sheets';
import { mapSheetDataHelipad } from '@/utils/dataMapper';
import { HelipadLocations } from '@/components/helipad-locations';

export const revalidate = 300;

export default async function HelipadLocationsPage() {
  const spreadsheetId = getSpreadsheetId();
  // Get last update time from spreadsheet file metadata
  const lastUpdate = await getSheetLastUpdate(spreadsheetId);
  const data = await getSheetData("'TITIK-LOKASI-HELIDROP'!A3:F", spreadsheetId);

  const initialData = mapSheetDataHelipad(data ?? []);

  return (
    <main className="min-h-screen bg-background">
      <HelipadLocations initialData={initialData} lastUpdate={lastUpdate} />
    </main>
  );
}
