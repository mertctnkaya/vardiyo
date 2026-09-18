import { Filesystem, Directory } from '@capacitor/filesystem';
import { Share } from '@capacitor/share';
import { isNative } from './isNative';
import { getLocalDateString } from './dateUtils';

const blobToBase64 = (blob: Blob): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = reject;
    reader.onload = () => {
      const dataUrl = reader.result as string;
      const base64 = dataUrl.split(',')[1];
      resolve(base64);
    };
    reader.readAsDataURL(blob);
  });
};


export const exportFile = async (fileName: string, content: string | Blob, mimeType: string) => {
  if (isNative()) {
    try {
      let base64Data: string;
      if (typeof content === 'string') {
        const encoder = new TextEncoder();
        const uint8Array = encoder.encode(content);
        let binary = '';
        const len = uint8Array.byteLength;
        for (let i = 0; i < len; i++) {
          binary += String.fromCharCode(uint8Array[i]);
        }
        base64Data = btoa(binary);
      } else {
        base64Data = await blobToBase64(content);
      }

      const result = await Filesystem.writeFile({
        path: fileName,
        data: base64Data,
        directory: Directory.Cache,
      });

      await Share.share({
        title: fileName,
        url: result.uri,
        dialogTitle: 'Raporu Kaydet veya Paylaş'
      });
      return;
    } catch (err) {
      console.error('Mobil dosya kaydetme/paylaşma hatası:', err);
    }
  }

  // Web Tarayıcı İndirme Akışı
  const blob = typeof content === 'string' ? new Blob([content], { type: mimeType }) : content;
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", fileName);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
};

// Sadece masaüstü tarayıcılarda yazdırma için sekme adını geçici değiştirir
export const printDocumentAsPDF = (documentTitle: string) => {
  const originalTitle = document.title;
  document.title = documentTitle;
  window.print();
  document.title = originalTitle; 
};

export const downloadDataAsJSON = (fileName: string, data: Record<string, any>) => {
  const jsonContent = JSON.stringify(data, null, 2);
  exportFile(fileName, jsonContent, 'application/json');
};

export const downloadCalendarAsCSV = (
  fileName: string, 
  calendarDays: any[], 
  workLogs: Record<string, any>, 
  employmentStartDate: Date, 
  getShiftForDate: (date: Date) => any
) => {
  const statusMap: Record<string, string> = {
    'normal': 'Normal Mesai',
    'overtime': 'Fazla Mesai',
    'leave': 'Ücretli İzin/Rapor',
    'annual_leave': 'Yıllık İzin',
    'holiday_work': 'Resmi Tatil Mesaisi',
    'absent': 'Devamsızlık',
    'late': 'Geç Kalma',
    'partial_leave': 'Saatlik İzin'
  };

  let csvContent = "\uFEFFTarih,Vardiya,Durum,Saat (Ek/Eksik)\n";

  calendarDays.forEach(item => {
    if (!item.isCurrentMonth || item.date < employmentStartDate) return;

    const dateStr = getLocalDateString(item.date);
    const log = workLogs[dateStr];
    const shift = getShiftForDate(item.date);

    let statusStr = shift.isOffDay ? 'Hafta Tatili' : 'Normal Mesai';
    if (log && log.status) {
      statusStr = statusMap[log.status] || log.status;
    }

    const hours = log?.hours ? log.hours : '';
    csvContent += `${dateStr},${shift.name},${statusStr},${hours}\n`;
  });

  exportFile(fileName, csvContent, 'text/csv;charset=utf-8;');
};

export const generateFileName = (prefix: string, date: Date, userName?: string, extension: string = '') => {
  const monthName = new Intl.DateTimeFormat('tr-TR', { month: 'long' }).format(date);
  const safeUserName = userName ? userName.replace(/\s+/g, '_') : 'Rapor';
  return `${prefix}_${monthName}_${safeUserName}${extension}`;
};
