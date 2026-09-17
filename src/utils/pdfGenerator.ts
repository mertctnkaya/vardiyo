import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import type { LegacyPayrollData } from '../types';
import { exportFile } from './exportUtils';
import { isNative } from './isNative';

export const savePdfDoc = async (doc: jsPDF, fileName: string) => {
  if (isNative()) {
    const blob = doc.output('blob');
    await exportFile(fileName, blob, 'application/pdf');
  } else {
    doc.save(fileName);
  }
};

// jsPDF varsayılan fontları Türkçe karakterleri (ş, ğ, ı vb.) desteklemez.
// Hata oluşmaması ve dökümanın bozuk çıkmaması için metinleri İngilizce karakterlere çeviriyoruz.
const tr2en = (text: string): string => {
  return text
    .replace(/ğ/g, 'g').replace(/Ğ/g, 'G')
    .replace(/ü/g, 'u').replace(/Ü/g, 'U')
    .replace(/ş/g, 's').replace(/Ş/g, 'S')
    .replace(/ı/g, 'i').replace(/İ/g, 'I')
    .replace(/ö/g, 'o').replace(/Ö/g, 'O')
    .replace(/ç/g, 'c').replace(/Ç/g, 'C');
};

export const generateAdvancedPayrollPDF = (
  payrollData: LegacyPayrollData, 
  fileName: string, 
  userName: string, 
  payrollDate: Date
) => {
  const doc = new jsPDF();
  
  // Modern (sans-serif) font kullanalım (Times yerine)
  doc.setFont('helvetica');

  const monthStr = new Intl.DateTimeFormat('tr-TR', { month: 'long', year: 'numeric' }).format(payrollDate);

  // --- Üst Başlık (Header) ---
  doc.setFontSize(18);
  doc.setTextColor(63, 81, 181);
  doc.setFont('helvetica', 'bold');
  doc.text(tr2en('VARDİYO BORDRO DÖKÜMÜ'), 14, 16);
  
  doc.setFontSize(9);
  doc.setTextColor(100, 100, 100);
  doc.setFont('helvetica', 'normal');
  doc.text(`Tarih: ${new Date().toLocaleDateString('tr-TR')}`, 160, 16);
  doc.text(tr2en('Resmi ve Onayli Belge Ciktisidir.'), 14, 22);
  
  // --- Personel Bilgileri ---
  doc.setFontSize(10);
  doc.setTextColor(0, 0, 0);
  doc.setFont('helvetica', 'bold');
  doc.text(tr2en('Personel Bilgileri'), 14, 32);
  doc.setFont('helvetica', 'normal');
  doc.text(tr2en(`Ad Soyad: ${userName}`), 14, 38);
  doc.text(tr2en(`Donem: ${monthStr}`), 14, 44);
  doc.text(tr2en(`Puantaj Gunu: ${payrollData.stats.payrollDays} Gun`), 14, 50);
  doc.text(tr2en(`Aylik Brut Maas: ${(payrollData.baseGrossInfo.daily * 30).toFixed(2)} TL`), 100, 38);
  doc.text(tr2en(`Brut Gunluk Ucret: ${payrollData.baseGrossInfo.daily.toFixed(2)} TL`), 100, 44);

  // --- İstatistikler ve Çalışma Bilgileri (Table) ---
  autoTable(doc, {
    startY: 55,
    head: [[tr2en('Aylik Calisma Istatistikleri'), tr2en('Miktar')]],
    body: [
      [tr2en('Normal Calisilan Gun'), `${payrollData.stats.payrollDays} Gun`],
      [tr2en('Fazla Mesai Saati'), `${payrollData.stats.overtimeHours} Saat`],
      [tr2en('Gece Calismasi'), `${payrollData.calculatedNightHours} Saat`],
      [tr2en('Devamsizlik / Gec Kalma'), `${payrollData.stats.absentDays} Gun / ${payrollData.stats.lateHours} Saat`],
    ],
    theme: 'grid',
    styles: { font: 'helvetica', fontSize: 9, cellPadding: 2 },
    headStyles: { fillColor: [63, 81, 181] },
    margin: { left: 14 }
  });

  // --- Brüt Hakedişler ---
  const finalYStats = (doc as any).lastAutoTable.finalY || 55;

  autoTable(doc, {
    startY: finalYStats + 5,
    head: [[tr2en('1. Brut Hakedisler'), tr2en('Tutar (TL)')]],
    body: [
      [tr2en('Aylik Kok Maas Hakedisi'), `+${payrollData.incomes.baseMonth.toFixed(2)}`],
      [tr2en('Fazla Mesai Ucreti'), `+${payrollData.incomes.overtime.toFixed(2)}`],
      [tr2en('Gece Calismasi Primi'), `+${payrollData.incomes.nightBonus.toFixed(2)}`],
      [tr2en('Resmi Tatil Mesaisi'), `+${payrollData.incomes.holidayWork.toFixed(2)}`],
      [tr2en('Toplam Brut Hakedis'), `${payrollData.incomes.totalGrossHakedis.toFixed(2)}`],
    ],
    theme: 'striped',
    styles: { font: 'helvetica', fontSize: 9, cellPadding: 2 },
    headStyles: { fillColor: [16, 185, 129] }, // Emerald color
  });

  // --- Kesintiler (Brüt) ---
  const finalYIncomes = (doc as any).lastAutoTable.finalY;

  autoTable(doc, {
    startY: finalYIncomes + 5,
    head: [[tr2en('2. Brut Kesintiler'), tr2en('Tutar (TL)')]],
    body: [
      [tr2en('Devamsizlik Kesintisi'), `-${payrollData.deductionsGross.absent.toFixed(2)}`],
      [tr2en('Gec Kalma Kesintisi'), `-${payrollData.deductionsGross.late.toFixed(2)}`],
      [tr2en('Yeni Brut Matrah (SGK Oncesi)'), `${payrollData.newGrossMatrah.toFixed(2)}`],
    ],
    theme: 'striped',
    styles: { font: 'helvetica', fontSize: 9, cellPadding: 2 },
    headStyles: { fillColor: [245, 158, 11] }, // Amber
  });

  // --- Yasal Kesintiler (Vergiler) ---
  const finalYDeductions = (doc as any).lastAutoTable.finalY;

  autoTable(doc, {
    startY: finalYDeductions + 5,
    head: [[tr2en('3. Yasal Kesintiler (SGK ve Vergi)'), tr2en('Tutar (TL)')]],
    body: [
      [tr2en('SGK Isci Primi (%14)'), `-${payrollData.taxes.sgk.toFixed(2)}`],
      [tr2en('Issizlik Primi (%1)'), `-${payrollData.taxes.unemployment.toFixed(2)}`],
      [tr2en('Gelir Vergisi (Istisna Dusulmus)'), `-${payrollData.taxes.incomeTax.toFixed(2)}`],
      [tr2en('Damga Vergisi (Istisna Dusulmus)'), `-${payrollData.taxes.stampTax.toFixed(2)}`],
      [tr2en('Vergiler Sonrasi Net Maas'), `${payrollData.netMaaş.toFixed(2)}`],
    ],
    theme: 'striped',
    styles: { font: 'helvetica', fontSize: 9, cellPadding: 2 },
    headStyles: { fillColor: [239, 68, 68] }, // Red
  });

  // --- Net Özel Kesintiler ve HESABA YATAN ---
  const finalYTaxes = (doc as any).lastAutoTable.finalY;
  
  const finalBody = [];
  if (payrollData.netKesintiler.bes > 0) {
    finalBody.push([tr2en('BES Kesintisi'), `-${payrollData.netKesintiler.bes.toFixed(2)}`]);
  }
  if (payrollData.netKesintiler.other > 0) {
    finalBody.push([tr2en('Diger (Icra, Avans vb.)'), `-${payrollData.netKesintiler.other.toFixed(2)}`]);
  }
  finalBody.push([tr2en('NET HESABA YATAN'), `${payrollData.hesabaYatanNet.toFixed(2)} TL`]);

  autoTable(doc, {
    startY: finalYTaxes + 5,
    head: [[tr2en('4. Kesin Hesap ve Odenecek Net Tutar'), tr2en('Tutar')]],
    body: finalBody,
    theme: 'grid',
    styles: { font: 'helvetica', fontSize: 10, cellPadding: 3 },
    headStyles: { fillColor: [30, 41, 59] }, // Slate
    bodyStyles: { fontStyle: 'bold' },
  });

  // --- İmza Alanı ---
  const signatureY = (doc as any).lastAutoTable.finalY + 20;
  
  // Tek sayfaya sığması için kontrol, eğer taşıyorsa yeni sayfa aç.
  // A4 boyutu 297mm. İmza alanı için ~30mm lazım.
  let finalSignatureY = signatureY;
  if (signatureY > 270) {
    doc.addPage();
    finalSignatureY = 30;
  }

  doc.setFontSize(9);
  doc.setTextColor(0,0,0);
  doc.setFont('helvetica', 'normal');
  doc.text(tr2en('Isveren / IK Yetkilisi'), 40, finalSignatureY);
  doc.text(tr2en('(Kase - Imza)'), 45, finalSignatureY + 5);

  doc.text(tr2en('Personel'), 150, finalSignatureY);
  doc.text(tr2en('(Imza)'), 153, finalSignatureY + 5);

  doc.setFontSize(8);
  doc.setTextColor(150, 150, 150);
  doc.text(tr2en('Bu belge Vardiyo Uygulamasi tarafindan otomatik olusturulmustur.'), 14, finalSignatureY + 25);
  
  // Kaydet
  savePdfDoc(doc, fileName);
};

export const generateAdvancedSeverancePDF = (
  severanceResult: any, 
  fileName: string, 
  userName: string, 
  hireDate: string,
  terminationDate: string,
  grossWage: number
) => {
  const doc = new jsPDF();
  
  // Modern font
  doc.setFont('helvetica');

  // --- Üst Başlık (Header) ---
  doc.setFontSize(18);
  doc.setTextColor(245, 158, 11); // Amber
  doc.setFont('helvetica', 'bold');
  doc.text(tr2en('VARDİYO TAZMİNAT DÖKÜMÜ'), 14, 16);
  
  doc.setFontSize(9);
  doc.setTextColor(100, 100, 100);
  doc.setFont('helvetica', 'normal');
  doc.text(`Tarih: ${new Date().toLocaleDateString('tr-TR')}`, 160, 16);
  doc.text(tr2en('Resmi ve Onayli Belge Ciktisidir.'), 14, 22);
  
  // --- Personel Bilgileri ---
  doc.setFontSize(10);
  doc.setTextColor(0, 0, 0);
  doc.setFont('helvetica', 'bold');
  doc.text(tr2en('Personel & Hesaplama Bilgileri'), 14, 32);
  doc.setFont('helvetica', 'normal');
  doc.text(tr2en(`Ad Soyad: ${userName}`), 14, 38);
  doc.text(tr2en(`Giris Tarihi: ${new Date(hireDate).toLocaleDateString('tr-TR')}`), 14, 44);
  doc.text(tr2en(`Cikis Tarihi: ${new Date(terminationDate).toLocaleDateString('tr-TR')}`), 14, 50);
  doc.text(tr2en(`Calisilan Sure: ${severanceResult.yearsWorked.toFixed(2)} Yil`), 100, 38);
  doc.text(tr2en(`Aylik Brut Ucret: ${grossWage.toFixed(2)} TL`), 100, 44);

  // --- Kıdem Tazminatı (Table) ---
  autoTable(doc, {
    startY: 55,
    head: [[tr2en('1. Kidem Tazminati'), tr2en('Tutar (TL)')]],
    body: [
      [tr2en('Brut Kidem Tazminati'), `+${severanceResult.severanceGross.toFixed(2)}`],
      [tr2en('Damga Vergisi Kesintisi'), `-${severanceResult.severanceStampTax.toFixed(2)}`],
      [tr2en('Net Kidem Tazminati'), `${severanceResult.severanceNet.toFixed(2)}`],
    ],
    theme: 'grid',
    styles: { font: 'helvetica', fontSize: 9, cellPadding: 2 },
    headStyles: { fillColor: [245, 158, 11] },
    margin: { left: 14 }
  });

  // --- İhbar Tazminatı (Table) ---
  const finalY1 = (doc as any).lastAutoTable.finalY || 55;
  autoTable(doc, {
    startY: finalY1 + 5,
    head: [[tr2en('2. Ihbar Tazminati'), tr2en('Tutar (TL)')]],
    body: [
      [tr2en(`Ihbar Suresi (${severanceResult.noticeWeeks} Hafta)`), ''],
      [tr2en('Brut Ihbar Tazminati'), `+${severanceResult.noticeGross.toFixed(2)}`],
      [tr2en('Gelir Vergisi Kesintisi'), `-${severanceResult.noticeIncomeTax.toFixed(2)}`],
      [tr2en('Damga Vergisi Kesintisi'), `-${severanceResult.noticeStampTax.toFixed(2)}`],
      [tr2en('Net Ihbar Tazminati'), `${severanceResult.noticeNet.toFixed(2)}`],
    ],
    theme: 'grid',
    styles: { font: 'helvetica', fontSize: 9, cellPadding: 2 },
    headStyles: { fillColor: [239, 68, 68] },
    margin: { left: 14 }
  });

  // --- TOPLAM ---
  const finalY2 = (doc as any).lastAutoTable.finalY || 55;
  autoTable(doc, {
    startY: finalY2 + 10,
    head: [[tr2en('3. Toplam Odenecek Tutar'), tr2en('Tutar (TL)')]],
    body: [
      [tr2en('Toplam NET Tazminat (Hesaba Yatan)'), `${severanceResult.totalNet.toFixed(2)} TL`],
    ],
    theme: 'grid',
    styles: { font: 'helvetica', fontSize: 11, cellPadding: 3 },
    headStyles: { fillColor: [30, 41, 59] },
    bodyStyles: { fontStyle: 'bold' },
    margin: { left: 14 }
  });

  // --- İmza Alanı ---
  const signatureY = (doc as any).lastAutoTable.finalY + 25;
  
  let finalSignatureY = signatureY;
  if (signatureY > 270) {
    doc.addPage();
    finalSignatureY = 30;
  }

  doc.setFontSize(9);
  doc.setTextColor(0,0,0);
  doc.setFont('helvetica', 'normal');
  doc.text(tr2en('Isveren / IK Yetkilisi'), 40, finalSignatureY);
  doc.text(tr2en('(Kase - Imza)'), 45, finalSignatureY + 5);

  doc.text(tr2en('Personel'), 150, finalSignatureY);
  doc.text(tr2en('(Imza)'), 153, finalSignatureY + 5);

  doc.setFontSize(8);
  doc.setTextColor(150, 150, 150);
  doc.text(tr2en('Bu belge Vardiyo Uygulamasi tarafindan otomatik olusturulmustur.'), 14, finalSignatureY + 25);
  
  // Kaydet
  savePdfDoc(doc, fileName);
};

export const generateAdvancedCalendarPDF = (
  calendarDays: any[],
  workLogs: Record<string, any>,
  getShiftForDate: (date: Date) => any,
  employmentStartDate: Date,
  baseDate: Date,
  userName: string,
  fileName: string,
  workType: string
) => {
  const doc = new jsPDF();
  doc.setFont('helvetica');

  const monthStr = new Intl.DateTimeFormat('tr-TR', { month: 'long', year: 'numeric' }).format(baseDate);

  // --- Üst Başlık (Header) ---
  doc.setFontSize(18);
  doc.setTextColor(16, 185, 129); // Emerald
  doc.setFont('helvetica', 'bold');
  doc.text(tr2en('VARDİYO ÇALIŞMA TAKVİMİ'), 14, 16);
  
  doc.setFontSize(9);
  doc.setTextColor(100, 100, 100);
  doc.setFont('helvetica', 'normal');
  doc.text(`Tarih: ${new Date().toLocaleDateString('tr-TR')}`, 160, 16);
  doc.text(tr2en('Resmi ve Onayli Belge Ciktisidir.'), 14, 22);

  // --- Personel Bilgileri ---
  doc.setFontSize(10);
  doc.setTextColor(0, 0, 0);
  doc.setFont('helvetica', 'bold');
  doc.text(tr2en('Personel Bilgileri'), 14, 32);
  doc.setFont('helvetica', 'normal');
  doc.text(tr2en(`Ad Soyad: ${userName}`), 14, 38);
  doc.text(tr2en(`Donem: ${monthStr}`), 14, 44);
  doc.text(tr2en(`Calisma Tipi: ${workType === 'yevmiye' ? 'Yevmiye (Gunluk)' : 'Aylik Bordro'}`), 100, 38);

  const statusMap: Record<string, string> = {
    'normal': 'Normal Mesai',
    'overtime': 'Fazla Mesai',
    'leave': 'Ucretli Izin/Rapor',
    'annual_leave': 'Yillik Izin',
    'holiday_work': 'Resmi Tatil Mesaisi',
    'absent': 'Devamsizlik',
    'late': 'Gec Kalma',
    'partial_leave': 'Saatlik Izin'
  };

  const bodyData: any[] = [];
  let totalDays = 0;
  let totalOvertimeHours = 0;
  let totalAbsentDays = 0;

  calendarDays.forEach(item => {
    if (!item.isCurrentMonth || item.date < employmentStartDate) return;

    const dateObj = item.date;
    const dateStr = `${dateObj.getFullYear()}-${String(dateObj.getMonth() + 1).padStart(2, '0')}-${String(dateObj.getDate()).padStart(2, '0')}`;
    const log = workLogs[dateStr];
    const shift = getShiftForDate(dateObj);

    let statusStr = shift.isOffDay ? 'Hafta Tatili' : 'Normal Mesai';
    let isWorked = !shift.isOffDay;

    if (log && log.status) {
      statusStr = statusMap[log.status] || tr2en(log.status);
      if (log.status === 'absent') {
        isWorked = false;
        totalAbsentDays++;
      } else if (log.status === 'overtime') {
        totalOvertimeHours += (log.hours || 0);
        isWorked = true;
      }
    } else if (shift.isOffDay) {
      isWorked = false;
    }

    if (isWorked) totalDays++;

    const displayDate = new Intl.DateTimeFormat('tr-TR', { day: '2-digit', month: '2-digit', year: 'numeric', weekday: 'short' }).format(dateObj);
    const hours = log?.hours ? `${log.hours} Saat` : (shift.isOffDay ? '-' : 'Tam Gun');

    bodyData.push([
      tr2en(displayDate),
      tr2en(shift.name),
      tr2en(statusStr),
      tr2en(hours),
      log?.note ? tr2en(log.note) : '-'
    ]);
  });

  autoTable(doc, {
    startY: 55,
    head: [[tr2en('Tarih'), tr2en('Vardiya'), tr2en('Durum'), tr2en('Sure'), tr2en('Not')]],
    body: bodyData,
    theme: 'striped',
    styles: { font: 'helvetica', fontSize: 8, cellPadding: 2 },
    headStyles: { fillColor: [16, 185, 129] }, // Emerald
    margin: { left: 14 }
  });

  // --- Özet ---
  const finalY = (doc as any).lastAutoTable.finalY + 10;
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text(tr2en('Donem Ozeti'), 14, finalY);
  
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text(tr2en(`Toplam Calisilan Gun: ${totalDays}`), 14, finalY + 6);
  doc.text(tr2en(`Toplam Fazla Mesai: ${totalOvertimeHours} Saat`), 14, finalY + 12);
  doc.text(tr2en(`Toplam Devamsizlik: ${totalAbsentDays} Gun`), 14, finalY + 18);

  // --- İmza Alanı ---
  const signatureY = finalY + 35;
  
  let finalSignatureY = signatureY;
  if (signatureY > 270) {
    doc.addPage();
    finalSignatureY = 30;
  }

  doc.setFontSize(9);
  doc.setTextColor(0,0,0);
  doc.setFont('helvetica', 'normal');
  doc.text(tr2en('Isveren / IK Yetkilisi'), 40, finalSignatureY);
  doc.text(tr2en('(Kase - Imza)'), 45, finalSignatureY + 5);

  doc.text(tr2en('Personel'), 150, finalSignatureY);
  doc.text(tr2en('(Imza)'), 153, finalSignatureY + 5);

  doc.setFontSize(8);
  doc.setTextColor(150, 150, 150);
  doc.text(tr2en('Bu belge Vardiyo Uygulamasi tarafindan otomatik olusturulmustur.'), 14, finalSignatureY + 25);
  
  savePdfDoc(doc, fileName);
};
