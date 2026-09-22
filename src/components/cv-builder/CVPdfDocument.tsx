import { Document, Page, Text, View, StyleSheet, Font } from '@react-pdf/renderer';
import type { CVFormData } from '../../types/cv';

// ATS parsing (OCR) ve ToUnicode haritası kaymalarını önlemek için Arimo (Arial muadili) kullanıyoruz
Font.register({
  family: 'Arimo',
  fonts: [
    { src: 'https://raw.githubusercontent.com/googlefonts/arimo/main/fonts/ttf/Arimo-Regular.ttf', fontWeight: 400 },
    { src: 'https://raw.githubusercontent.com/googlefonts/arimo/main/fonts/ttf/Arimo-Bold.ttf', fontWeight: 700 },
  ]
});

// PDF Stilleri — %100 ATS Uyumlu: Tek sütun, sade, metin tabanlı, temiz hiyerarşi
const styles = StyleSheet.create({
  page: {
    padding: '30 35', // Klasik A4 oranı kenar boşlukları
    fontFamily: 'Arimo',
    fontSize: 10,
    color: '#000000', // Siyah net ATS okuması için
    lineHeight: 1.4,
  },
  // Üst Başlık (Contact / Header)
  header: {
    marginBottom: 12,
    borderBottomWidth: 1.5,
    borderBottomColor: '#333333',
    paddingBottom: 8,
  },
  fullName: {
    fontSize: 18,
    fontFamily: 'Arimo',
    fontWeight: 700,
    color: '#000000',
    textTransform: 'uppercase',
  },
  jobTitle: {
    fontSize: 11,
    color: '#333333',
    marginTop: 2,
    marginBottom: 4,
  },
  contactRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
  },
  contactItem: {
    fontSize: 9,
    color: '#333333',
  },
  contactSeparator: {
    fontSize: 9,
    color: '#333333',
    marginHorizontal: 4,
  },
  // Bölüm Başlıkları
  sectionTitle: {
    fontSize: 11,
    fontFamily: 'Arimo',
    fontWeight: 700,
    color: '#000000',
    marginTop: 12,
    marginBottom: 6,
    paddingBottom: 2,
    borderBottomWidth: 0.8,
    borderBottomColor: '#cccccc',
    textTransform: 'uppercase',
  },
  // Özet
  summaryText: {
    fontSize: 9.5,
    color: '#111111',
    lineHeight: 1.5,
  },
  // Liste Maddeleri (Eğitim, Deneyim, Beceriler)
  listItem: {
    flexDirection: 'row',
    marginBottom: 3,
  },
  listBullet: {
    width: 10,
    fontSize: 9.5,
  },
  listContent: {
    flex: 1,
    fontSize: 9.5,
    color: '#111111',
  },
  // Deneyim
  experienceItem: {
    marginBottom: 8,
  },
  experienceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
  },
  experienceTitle: {
    fontSize: 10,
    fontFamily: 'Arimo',
    fontWeight: 700,
    color: '#000000',
  },
  dateRange: {
    fontSize: 9,
    color: '#333333',
  },
  bulletRow: {
    flexDirection: 'row',
    marginTop: 2,
  },
  bulletIcon: {
    width: 10,
    fontSize: 9,
    color: '#111111',
  },
  bulletText: {
    flex: 1,
    fontSize: 9,
    color: '#111111',
  },
  // Eğitim
  educationItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginBottom: 4,
  },
  educationLeft: {
    flex: 1,
  },
  educationTitle: {
    fontSize: 10,
    fontFamily: 'Arimo',
    fontWeight: 700,
    color: '#000000',
  },
  educationSub: {
    fontSize: 9.5,
    color: '#333333',
  },
  educationDate: {
    fontSize: 9,
    color: '#333333',
  }
});

interface CVPdfDocumentProps {
  data: CVFormData;
}

export default function CVPdfDocument({ data }: CVPdfDocumentProps) {
  const hasExperience = data.experiences.some(e => e.company.trim().length > 0);
  const hasEducation = data.educations.some(e => e.schoolName.trim().length > 0);

  // ATS Uyumlu Beceriler Listesi Birleştirme
  const allSkills = [...data.selectedSkills.map(s => s.name), ...data.customSkills.map(s => s.name)];
  if (data.disciplineShifts) allSkills.push('Vardiyalı Çalışma');
  if (data.discipline5S) allSkills.push('5S Tertip & Düzen');
  if (data.disciplineISG) allSkills.push('İSG Kurallarına Uyum');
  if (data.disciplineHeavy) allSkills.push('Ağır Tempo Çalışma');

  // Ekstra Bilgiler Listesi
  const extraItems: string[] = [];
  if (data.militaryStatus && data.militaryStatus !== 'Belirtmek İstemiyorum') extraItems.push(`Askerlik: ${data.militaryStatus}`);
  if (data.driverLicense.length > 0) extraItems.push(`Ehliyet: ${data.driverLicense.join(', ')}`);
  if (data.srcDocument.length > 0) extraItems.push(`SRC Belgesi: ${data.srcDocument.join(', ')}`);
  if (data.commutePreference) extraItems.push(`Ulaşım: ${data.commutePreference}`);
  if (data.smoking === 'Kullanmıyorum') extraItems.push('Sigara Kullanımı: Kullanmıyor');
  if (data.shiftPreference) extraItems.push(`Çalışma Düzeni Tercihi: ${data.shiftPreference}`);
  if (data.travelRestriction) extraItems.push(data.travelRestriction);
  if (data.height && data.weight) extraItems.push(`Fiziksel: ${data.height} cm / ${data.weight} kg`);
  if (data.securityCardType) extraItems.push(`Güvenlik Kimliği (ÖGG): ${data.securityCardType}`);

  // Deneyim yılına göre sıralama (3+ yıl deneyimli ise deneyim üste)
  const totalExpYears = data.experiences.reduce((sum, exp) => {
    if (!exp.startDate || !exp.endDate) return sum;
    const startParts = exp.startDate.split('/');
    const endParts = exp.endDate === 'Devam Ediyor'
      ? [String(new Date().getMonth() + 1), String(new Date().getFullYear())]
      : exp.endDate.split('/');
    if (startParts.length < 2 || endParts.length < 2) return sum;
    return sum + Math.max(0, parseInt(endParts[1], 10) - parseInt(startParts[1], 10));
  }, 0);
  const isExperienced = totalExpYears >= 3;

  const renderSummary = () => {
    if (!data.summary && !data.availability) return null;
    return (
      <View>
        <Text style={styles.sectionTitle}>ÖZET</Text>
        <Text style={styles.summaryText}>
          {data.summary}
          {data.summary && data.availability ? ' ' : ''}
          {data.availability && `Çalışma Durumu: ${data.availability}.`}
        </Text>
      </View>
    );
  };

  const renderExperience = () => {
    if (!hasExperience) return null;
    return (
      <View>
        <Text style={styles.sectionTitle}>İŞ DENEYİMİ</Text>
        {data.experiences.filter(e => e.company.trim()).map((exp, i) => (
          <View key={i} style={styles.experienceItem}>
            <View style={styles.experienceHeader}>
              {/* ATS İçin Önerilen: Pozisyon — Şirket */}
              <Text style={styles.experienceTitle}>
                {exp.position} — {exp.company}
              </Text>
              <Text style={styles.dateRange}>
                {exp.startDate}{exp.endDate ? ` - ${exp.endDate}` : ''}
              </Text>
            </View>
            {exp.description ? (
              <View style={styles.bulletRow}>
                <Text style={styles.bulletIcon}>•</Text>
                <Text style={styles.bulletText}>{exp.description}</Text>
              </View>
            ) : null}
          </View>
        ))}
      </View>
    );
  };

  const renderEducation = () => {
    if (!hasEducation) return null;
    return (
      <View>
        <Text style={styles.sectionTitle}>EĞİTİM</Text>
        {data.educations.filter(e => e.schoolName.trim()).map((edu, i) => (
          <View key={i} style={styles.educationItem}>
            <View style={styles.educationLeft}>
              <Text style={styles.educationTitle}>{edu.department || 'Mezuniyet Belgesi'} ({edu.level})</Text>
              <Text style={styles.educationSub}>{edu.schoolName}</Text>
            </View>
            {edu.startDate && edu.endDate ? (
              <Text style={styles.educationDate}>{edu.startDate} - {edu.endDate}</Text>
            ) : null}
          </View>
        ))}
      </View>
    );
  };

  const renderSkills = () => {
    if (allSkills.length === 0) return null;
    return (
      <View>
        <Text style={styles.sectionTitle}>BECERİLER</Text>
        {allSkills.map((skill, i) => (
          <View key={i} style={styles.listItem}>
            <Text style={styles.listBullet}>•</Text>
            <Text style={styles.listContent}>{skill}</Text>
          </View>
        ))}
      </View>
    );
  };

  const renderExtras = () => {
    if (extraItems.length === 0) return null;
    return (
      <View>
        <Text style={styles.sectionTitle}>EK BİLGİLER</Text>
        {extraItems.map((item, i) => (
          <View key={i} style={styles.listItem}>
            <Text style={styles.listBullet}>•</Text>
            <Text style={styles.listContent}>{item}</Text>
          </View>
        ))}
      </View>
    );
  };

  const renderReferences = () => {
    return (
      <View>
        <Text style={styles.sectionTitle}>REFERANSLAR</Text>
        {data.references && data.references.length > 0 ? (
          data.references.map((ref) => (
            <View key={ref.id} style={styles.listItem}>
              <Text style={styles.listBullet}>•</Text>
              <Text style={styles.listContent}>
                {ref.fullName} — {ref.companyAndTitle} (İletişim bilgileri KVKK gereği gizlenmiştir, mülakat aşamasında sunulacaktır)
              </Text>
            </View>
          ))
        ) : (
          <View style={styles.listItem}>
            <Text style={styles.listBullet}>•</Text>
            <Text style={styles.listContent}>Referanslar talep üzerine sunulacaktır.</Text>
          </View>
        )}
      </View>
    );
  };

  return (
    <Document
      title={`${data.firstName} ${data.lastName} - CV`}
      author={`${data.firstName} ${data.lastName}`}
      creator="Vardiyo ATS Engine"
      subject={`${data.jobTitleName} Özgeçmişi`}
    >
      <Page size="A4" style={styles.page}>
        {/* İLETİŞİM & BAŞLIK */}
        <View style={styles.header}>
          <View>
            <Text style={styles.fullName}>
              {data.firstName.toUpperCase()} {data.lastName.toUpperCase()}
            </Text>
            <Text style={styles.jobTitle}>{data.jobTitleName}</Text>
          </View>
          <View style={styles.contactRow}>
            {data.phone && <Text style={styles.contactItem}>{data.phone}</Text>}
            {data.email && (
              <>
                <Text style={styles.contactSeparator}>|</Text>
                <Text style={styles.contactItem}>{data.email}</Text>
              </>
            )}
            {data.city && (
              <>
                <Text style={styles.contactSeparator}>|</Text>
                <Text style={styles.contactItem}>
                  {data.district ? `${data.district} / ${data.city}` : data.city}
                </Text>
              </>
            )}
          </View>
        </View>

        {/* ATS BÖLÜM HİYERARŞİSİ */}
        {renderSummary()}

        {isExperienced ? (
          <>
            {renderExperience()}
            {renderSkills()}
            {renderEducation()}
          </>
        ) : (
          <>
            {renderEducation()}
            {renderSkills()}
            {renderExperience()}
          </>
        )}

        {renderExtras()}
        {renderReferences()}

      </Page>
    </Document>
  );
}

