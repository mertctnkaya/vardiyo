import { Document, Page, Text, View, StyleSheet, Image, Font } from '@react-pdf/renderer';
import type { CVFormData } from '../../types/cv';

// ATS parsing (OCR) ve ToUnicode haritası kaymalarını önlemek için Arimo (Arial muadili) kullanıyoruz
Font.register({
  family: 'Arimo',
  fonts: [
    { src: 'https://raw.githubusercontent.com/googlefonts/arimo/main/fonts/ttf/Arimo-Regular.ttf', fontWeight: 400 },
    { src: 'https://raw.githubusercontent.com/googlefonts/arimo/main/fonts/ttf/Arimo-Bold.ttf', fontWeight: 700 },
  ]
});

// Atölye Formatı — KOBİ, OSB, Usta/Patron mülakatları için
// Görsel ağırlıklı, rozetli, fotoğraflı
const styles = StyleSheet.create({
  page: {
    padding: 24,
    fontFamily: 'Arimo',
    fontSize: 10,
    color: '#1a1a1a',
    lineHeight: 1.35,
  },
  // Üst Banner
  headerBanner: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    backgroundColor: '#1e293b',
    padding: 14,
    borderRadius: 6,
    marginBottom: 10,
  },
  headerLeft: {
    flex: 1,
  },
  fullName: {
    fontSize: 22,
    fontFamily: 'Arimo',
    fontWeight: 700,
    color: '#ffffff',
    letterSpacing: 1,
  },
  jobTitle: {
    fontSize: 13,
    color: '#94a3b8',
    marginTop: 6,
    marginBottom: 4,
    fontWeight: 700,
  },
  contactText: {
    fontSize: 9,
    color: '#cbd5e1',
    marginTop: 6,
    lineHeight: 1.5,
  },
  availabilityTag: {
    fontSize: 8,
    fontFamily: 'Arimo',
    fontWeight: 700,
    color: '#22c55e',
    backgroundColor: '#052e16',
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 4,
    marginTop: 6,
    alignSelf: 'flex-start',
  },
  photo: {
    width: 64,
    height: 80,
    borderRadius: 4,
    objectFit: 'cover',
    borderWidth: 2,
    borderColor: '#334155',
  },
  // Bölüm Başlıkları
  sectionTitle: {
    fontSize: 10.5,
    fontFamily: 'Arimo',
    fontWeight: 700,
    color: '#1e293b',
    marginTop: 10,
    marginBottom: 5,
    paddingBottom: 2,
    borderBottomWidth: 1.5,
    borderBottomColor: '#e2e8f0',
    textTransform: 'uppercase',
    letterSpacing: 1.2,
  },
  // Rozet Grid
  badgeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 5,
    marginTop: 3,
  },
  badge: {
    fontSize: 8.5,
    fontFamily: 'Arimo',
    fontWeight: 700,
    color: '#1e293b',
    backgroundColor: '#e2e8f0',
    paddingHorizontal: 7,
    paddingVertical: 4,
    borderRadius: 4,
  },
  badgeHighlight: {
    fontSize: 8.5,
    fontFamily: 'Arimo',
    fontWeight: 700,
    color: '#ffffff',
    backgroundColor: '#3b82f6',
    paddingHorizontal: 7,
    paddingVertical: 4,
    borderRadius: 4,
  },
  // Disiplin
  disciplineGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 5,
    marginTop: 3,
  },
  disciplineBadge: {
    fontSize: 8.5,
    fontFamily: 'Arimo',
    fontWeight: 700,
    color: '#166534',
    backgroundColor: '#dcfce7',
    paddingHorizontal: 7,
    paddingVertical: 4,
    borderRadius: 4,
    borderWidth: 0.5,
    borderColor: '#86efac',
  },
  // Özet
  summaryText: {
    fontSize: 9.5,
    color: '#334155',
    lineHeight: 1.5,
    marginTop: 2,
  },
  // Deneyim
  expItem: {
    marginBottom: 5,
  },
  expHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  companyBold: {
    fontSize: 10,
    fontFamily: 'Arimo',
    fontWeight: 700,
    color: '#1e293b',
  },
  dateText: {
    fontSize: 8.5,
    color: '#64748b',
  },
  positionText: {
    fontSize: 9.5,
    color: '#475569',
  },
  descText: {
    fontSize: 9,
    color: '#334155',
    marginLeft: 8,
    marginTop: 1,
  },
  // Eğitim
  eduItem: {
    marginBottom: 3,
  },
  eduBold: {
    fontSize: 9.5,
    fontFamily: 'Arimo',
    fontWeight: 700,
    color: '#1e293b',
  },
  eduSub: {
    fontSize: 9,
    color: '#64748b',
  },
  // Ek Bilgi
  extraGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
    marginTop: 2,
  },
  extraItem: {
    fontSize: 8.5,
    color: '#475569',
  },
  // Footer
  footer: {
    position: 'absolute',
    bottom: 10,
    left: 24,
    right: 24,
    textAlign: 'center',
    fontSize: 10,
    color: '#64748b',
  },
});

interface Props {
  data: CVFormData;
}

export default function CVPdfWorkshop({ data }: Props) {
  const allSkills = [...data.selectedSkills, ...data.customSkills];
  const hasExperience = data.experiences.some(e => e.company.trim().length > 0);
  const hasEducation = data.educations.some(e => e.schoolName.trim().length > 0);

  const disciplineTags: string[] = [];
  if (data.disciplineShifts) disciplineTags.push('Vardiyalı Çalışma');
  if (data.discipline5S) disciplineTags.push('5S');
  if (data.disciplineISG) disciplineTags.push('İSG');
  if (data.disciplineHeavy) disciplineTags.push('Ağır Tempo');

  const extraItems: string[] = [];
  if (data.militaryStatus && data.militaryStatus !== 'Belirtmek İstemiyorum') extraItems.push(`Askerlik: ${data.militaryStatus}`);
  if (data.driverLicense.length > 0) extraItems.push(`Ehliyet: ${data.driverLicense.join(', ')}`);
  if (data.srcDocument.length > 0) extraItems.push(`SRC: ${data.srcDocument.join(', ')}`);
  if (data.commutePreference) extraItems.push(`Ulaşım: ${data.commutePreference}`);
  if (data.smoking === 'Kullanmıyorum') extraItems.push('Sigara: Kullanmıyor');
  if (data.shiftPreference) extraItems.push(`Vardiya: ${data.shiftPreference}`);
  if (data.height && data.weight) extraItems.push(`Boy/Kilo: ${data.height} cm / ${data.weight} kg`);
  if (data.securityCardType) extraItems.push(`ÖGG: ${data.securityCardType}`);

  return (
    <Document>
      <Page size="A4" style={styles.page}>

        {/* ÜST BANNER */}
        <View style={styles.headerBanner}>
          <View style={styles.headerLeft}>
            <View>
              <Text style={styles.fullName}>
                {data.firstName.toUpperCase()} {data.lastName.toUpperCase()}
              </Text>
              <Text style={styles.jobTitle}>{data.jobTitleName}</Text>
            </View>
            <Text style={styles.contactText}>
              {[data.phone, data.email, data.district ? `${data.district} / ${data.city}` : data.city]
                .filter(Boolean)
                .join('  |  ')}
            </Text>
            {data.availability && (
              <Text style={styles.availabilityTag}>{data.availability}</Text>
            )}
          </View>
          {data.photo && (
            <Image src={data.photo} style={styles.photo} />
          )}
        </View>

        {/* ÖZET */}
        {data.summary && (
          <View>
            <Text style={styles.sectionTitle}>PROFİL</Text>
            <Text style={styles.summaryText}>{data.summary}</Text>
          </View>
        )}

        {/* YETKİNLİK ROZETLERİ */}
        {allSkills.length > 0 && (
          <View>
            <Text style={styles.sectionTitle}>YETKİNLİKLER</Text>
            <View style={styles.badgeGrid}>
              {allSkills.map((s, i) => (
                <Text
                  key={i}
                  style={s.category === 'Sertifika/Belge' ? styles.badgeHighlight : styles.badge}
                >
                  {s.name}
                </Text>
              ))}
            </View>
          </View>
        )}

        {/* ÇALIŞMA DİSİPLİNİ */}
        {disciplineTags.length > 0 && (
          <View>
            <Text style={styles.sectionTitle}>ÇALIŞMA DİSİPLİNİ</Text>
            <View style={styles.disciplineGrid}>
              {disciplineTags.map((tag, i) => (
                <Text key={i} style={styles.disciplineBadge}>✓ {tag}</Text>
              ))}
            </View>
          </View>
        )}

        {/* İŞ DENEYİMİ */}
        {hasExperience && (
          <View>
            <Text style={styles.sectionTitle}>İŞ DENEYİMİ</Text>
            {data.experiences.filter(e => e.company.trim()).map((exp, i) => (
              <View key={i} style={styles.expItem}>
                <View style={styles.expHeader}>
                  <Text style={styles.companyBold}>{exp.company}</Text>
                  <Text style={styles.dateText}>
                    {exp.startDate}{exp.endDate ? ` — ${exp.endDate}` : ''}
                  </Text>
                </View>
                <Text style={styles.positionText}>{exp.position}</Text>
                {exp.description ? <Text style={styles.descText}>• {exp.description}</Text> : null}
              </View>
            ))}
          </View>
        )}

        {/* EĞİTİM */}
        {hasEducation && (
          <View>
            <Text style={styles.sectionTitle}>EĞİTİM</Text>
            {data.educations.filter(e => e.schoolName.trim()).map((edu, i) => (
              <View key={i} style={styles.eduItem}>
                <Text style={styles.eduBold}>
                  {edu.level} — {edu.schoolName}
                  {edu.startDate && edu.endDate ? ` (${edu.startDate} - ${edu.endDate})` : ''}
                </Text>
                {edu.department ? <Text style={styles.eduSub}>{edu.department}</Text> : null}
              </View>
            ))}
          </View>
        )}

        {/* EK BİLGİLER */}
        {extraItems.length > 0 && (
          <View>
            <Text style={styles.sectionTitle}>EK BİLGİLER</Text>
            <View style={styles.extraGrid}>
              {extraItems.map((item, i) => (
                <Text key={i} style={styles.extraItem}>
                  {item}{i < extraItems.length - 1 ? '  |' : ''}
                </Text>
              ))}
            </View>
            {data.references && data.references.length > 0 ? (
              <View style={{ marginTop: 6 }}>
                <Text style={{ ...styles.extraItem, fontWeight: 700, marginBottom: 2 }}>Referanslar:</Text>
                {data.references.map((ref) => (
                  <Text key={ref.id} style={styles.extraItem}>
                    • {ref.fullName} - {ref.companyAndTitle} {ref.phone ? `(${ref.phone})` : ''}
                  </Text>
                ))}
              </View>
            ) : (
              <Text style={{ ...styles.extraItem, marginTop: 4 }}>
                Referans: Talep halinde sunulacaktır.
              </Text>
            )}
          </View>
        )}

        <Text style={styles.footer}>Vardiyo ile hazırlanmıştır — vardiyo.vercel.app</Text>
      </Page>
    </Document>
  );
}

