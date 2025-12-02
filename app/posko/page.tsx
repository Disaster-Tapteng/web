import { getSheetData, getSheetLastUpdate, getSpreadsheetId } from '../../lib/sheet/google-sheets';
import { mapSheetDataRefugee } from '@/utils/dataMapper';
import { Posko } from '@/components/posko';

export const revalidate = 300;

export default async function RefugeeDashboard() {
  const spreadsheetId = getSpreadsheetId();
  // Get last update time from spreadsheet file metadata
  const lastUpdate = await getSheetLastUpdate(spreadsheetId);
  const data = await getSheetData("'POSKO PENGUNGSIAN'!B4:E", spreadsheetId);

  const initialData = mapSheetDataRefugee(data ?? []);

  return (
    <main className="min-h-screen bg-background">
      <Posko initialData={initialData} lastUpdate={lastUpdate} />
    </main>
  );
}
