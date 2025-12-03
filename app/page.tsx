import { DisasterDashboard } from '@/components/disaster-dashboard';
import { getSheetData, getSheetLastUpdate, getSpreadsheetId } from '../lib/sheet/google-sheets';
import { mapSheetData, mapSheetDataRefugee, mapSheetDataHelipad } from '@/utils/dataMapper';

export default async function Home() {
  const spreadsheetId = getSpreadsheetId();
  // Get last update time from spreadsheet file metadata
  const lastUpdate = await getSheetLastUpdate(spreadsheetId);
  const data = await getSheetData('KECAMATAN!A5:O', spreadsheetId);
  const poskoData = await getSheetData("'POSKO PENGUNGSIAN'!B4:E", spreadsheetId);
  const helipadData = await getSheetData("'TITIK-LOKASI-HELIDROP'!A3:F", spreadsheetId);

  const totalPosko = mapSheetDataRefugee(poskoData ?? []);
  const helipadLocations = mapSheetDataHelipad(helipadData ?? []);

  const initialData = mapSheetData(data ?? []);

  return (
    <main className="min-h-screen bg-background">
      <DisasterDashboard
        initialData={initialData}
        lastUpdate={lastUpdate}
        totalPosko={totalPosko.totalPosko}
        totalHelipadLocations={helipadLocations.length}
      />
    </main>
  );
}
