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
  summaryText: {
    fontSize: 9.5,
    color: '#111111',
    lineHeight: 1.5,
  },
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
  skillCategoryTitle: {
    fontSize: 9.5,
    fontFamily: 'Arimo',
    fontWeight: 700,
    color: '#333333',
    marginTop: 4,
    marginBottom: 2,
  },
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
  },
  projectItem: {
    marginBottom: 6,
  },
  projectHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
  },
  projectTitle: {
    fontSize: 10,
    fontFamily: 'Arimo',
    fontWeight: 700,
    color: '#000000',
  },
  projectUrl: {
    fontSize: 9,
    color: '#3F51B5', // Indigo link color
  },
  projectTechnologies: {
    fontSize: 8.5,
    fontFamily: 'Arimo',
    fontWeight: 700,
    color: '#555555',
    marginTop: 1,
    marginBottom: 2,
  }
});

interface CVPdfDocumentProps {
  data: CVFormData;
}

export default function CVPdfDocument({ data }: CVPdfDocumentProps) {
  const isEn = data.language === 'en';
  
  // Çeviri Sözlüğü
  const T = {
    summary: isEn ? 'SUMMARY' : 'ÖZET',
    experience: isEn ? 'EXPERIENCE' : 'İŞ DENEYİMİ',
    education: isEn ? 'EDUCATION' : 'EĞİTİM',
    skills: isEn ? 'SKILLS' : 'BECERİLER',
    projects: isEn ? 'SELECTED PROJECTS' : 'PROJELER',
    extras: isEn ? 'ADDITIONAL INFO' : 'EK BİLGİLER',
    references: isEn ? 'REFERENCES' : 'REFERANSLAR',
    present: isEn ? 'Present' : 'Devam Ediyor',
    availability: isEn ? 'Availability' : 'Çalışma Durumu',
  };

  const hasExperience = data.experiences.some(e => e.company.trim().length > 0);
  const hasEducation = data.educations.some(e => e.schoolName.trim().length > 0);
  const hasProjects = data.projects && data.projects.some(p => p.name.trim().length > 0);

  // ATS Uyumlu Beceriler Listesi - Kategorize Edilmiş
  const categorizedSkills: Record<string, string[]> = {};
  const addSkill = (name: string, category: string = 'Genel') => {
    // İngilizce için kategori adlarını çevir
    let catName = category;
    if (isEn) {
      if (catName === 'Mesleki Bilgi') catName = 'Professional Knowledge';
      else if (catName === 'Makine/Ekipman') catName = 'Tools & Equipment';
      else if (catName === 'Sertifika/Belge') catName = 'Certifications';
      else if (catName === 'Genel') catName = 'General Skills';
    }
    
    if (!categorizedSkills[catName]) categorizedSkills[catName] = [];
    categorizedSkills[catName].push(name);
  };

  data.selectedSkills.forEach(s => addSkill(s.name, s.category));
  data.customSkills.forEach(s => addSkill(s.name, s.category));
  if (data.disciplineShifts) addSkill(isEn ? 'Shift Work' : 'Vardiyalı Çalışma', 'Genel');
  if (data.discipline5S) addSkill(isEn ? '5S Methodology' : '5S Tertip & Düzen', 'Genel');
  if (data.disciplineISG) addSkill(isEn ? 'Occupational Health & Safety' : 'İSG Kurallarına Uyum', 'Genel');
  if (data.disciplineHeavy) addSkill(isEn ? 'Heavy Duty Workflow' : 'Ağır Tempo Çalışma', 'Genel');

  // Ekstra Bilgiler Listesi
  const extraItems: string[] = [];
  if (data.militaryStatus && data.militaryStatus !== 'Belirtmek İstemiyorum') {
    extraItems.push(isEn ? `Military Service: ${data.militaryStatus === 'Yapıldı' ? 'Completed' : data.militaryStatus}` : `Askerlik: ${data.militaryStatus}`);
  }
  if (data.driverLicense.length > 0) extraItems.push(isEn ? `Driver License: ${data.driverLicense.join(', ')}` : `Ehliyet: ${data.driverLicense.join(', ')}`);
  if (data.srcDocument.length > 0) extraItems.push(`SRC Belgesi: ${data.srcDocument.join(', ')}`);
  if (data.commutePreference) extraItems.push(isEn ? `Commute: ${data.commutePreference}` : `Ulaşım: ${data.commutePreference}`);
  if (data.smoking === 'Kullanmıyorum') extraItems.push(isEn ? 'Non-smoker' : 'Sigara Kullanımı: Kullanmıyor');
  if (data.shiftPreference) extraItems.push(isEn ? `Shift Preference: ${data.shiftPreference}` : `Çalışma Düzeni Tercihi: ${data.shiftPreference}`);
  if (data.travelRestriction) extraItems.push(data.travelRestriction); // TODO: Translate later if needed
  if (data.height && data.weight) extraItems.push(isEn ? `Physical: ${data.height} cm / ${data.weight} kg` : `Fiziksel: ${data.height} cm / ${data.weight} kg`);
  if (data.securityCardType) extraItems.push(`ÖGG: ${data.securityCardType}`);

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

  // Çift Madde İşareti Temizleyici (Bullet Sanitizer)
  // Kullanıcının açıklama alanına yazdığı metinleri satır satır böler ve baştaki tire/yıldız/madde işaretlerini temizler.
  const sanitizeBullets = (text: string) => {
    if (!text) return [];
    return text.split(/\r?\n/).map(line => {
      // Baştaki boşluk, tire, yıldız, nokta ve çeşitli utf-8 madde işaretlerini temizle
      return line.replace(/^[\s\-\*•·◦]+/, '').trim();
    }).filter(line => line.length > 0);
  };

  const renderSummary = () => {
    if (!data.summary && !data.availability) return null;
    return (
      <View>
        <Text style={styles.sectionTitle}>{T.summary}</Text>
        <Text style={styles.summaryText}>
          {data.summary}
          {data.summary && data.availability ? ' ' : ''}
          {data.availability && `${T.availability}: ${data.availability}.`}
        </Text>
      </View>
    );
  };

  const renderExperience = () => {
    if (!hasExperience) return null;
    return (
      <View>
        <Text style={styles.sectionTitle}>{T.experience}</Text>
        {data.experiences.filter(e => e.company.trim()).map((exp, i) => (
          <View key={i} style={styles.experienceItem}>
            <View style={styles.experienceHeader}>
              <Text style={styles.experienceTitle}>
                {exp.position} — {exp.company}
              </Text>
              <Text style={styles.dateRange}>
                {exp.startDate}{exp.endDate ? ` - ${exp.endDate === 'Devam Ediyor' ? T.present : exp.endDate}` : ''}
              </Text>
            </View>
            {/* Sanitized Bullets */}
            {sanitizeBullets(exp.description).map((bulletLine, index) => (
              <View key={index} style={styles.bulletRow}>
                <Text style={styles.bulletIcon}>•</Text>
                <Text style={styles.bulletText}>{bulletLine}</Text>
              </View>
            ))}
          </View>
        ))}
      </View>
    );
  };

  const renderProjects = () => {
    if (!hasProjects) return null;
    return (
      <View>
        <Text style={styles.sectionTitle}>{T.projects}</Text>
        {data.projects!.filter(p => p.name.trim()).map((proj, i) => (
          <View key={i} style={styles.projectItem}>
            <View style={styles.projectHeader}>
              <Text style={styles.projectTitle}>{proj.name}</Text>
              {proj.url && <Text style={styles.projectUrl}>{proj.url.replace(/^https?:\/\//, '')}</Text>}
            </View>
            {proj.technologies && (
              <Text style={styles.projectTechnologies}>{proj.technologies}</Text>
            )}
            {sanitizeBullets(proj.description).map((bulletLine, index) => (
              <View key={index} style={styles.bulletRow}>
                <Text style={styles.bulletIcon}>•</Text>
                <Text style={styles.bulletText}>{bulletLine}</Text>
              </View>
            ))}
          </View>
        ))}
      </View>
    );
  };

  const renderEducation = () => {
    if (!hasEducation) return null;
    return (
      <View>
        <Text style={styles.sectionTitle}>{T.education}</Text>
        {data.educations.filter(e => e.schoolName.trim()).map((edu, i) => (
          <View key={i} style={styles.educationItem}>
            <View style={styles.educationLeft}>
              <Text style={styles.educationTitle}>{edu.department || (isEn ? 'Diploma' : 'Mezuniyet Belgesi')} ({edu.level})</Text>
              <Text style={styles.educationSub}>{edu.schoolName}</Text>
            </View>
            {edu.startDate && edu.endDate ? (
              <Text style={styles.educationDate}>{edu.startDate} - {edu.endDate === 'Devam Ediyor' ? T.present : edu.endDate}</Text>
            ) : null}
          </View>
        ))}
      </View>
    );
  };

  const renderSkills = () => {
    const categories = Object.keys(categorizedSkills);
    if (categories.length === 0) return null;
    
    return (
      <View>
        <Text style={styles.sectionTitle}>{T.skills}</Text>
        {categories.map((cat, i) => (
          <View key={i} style={{ marginBottom: 4 }}>
            <Text style={styles.skillCategoryTitle}>{cat}</Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 4 }}>
              {categorizedSkills[cat].map((skill, j) => (
                <Text key={j} style={{ fontSize: 9.5, color: '#333333' }}>
                  {skill}{j < categorizedSkills[cat].length - 1 ? ' • ' : ''}
                </Text>
              ))}
            </View>
          </View>
        ))}
      </View>
    );
  };

  const renderExtras = () => {
    if (extraItems.length === 0) return null;
    return (
      <View>
        <Text style={styles.sectionTitle}>{T.extras}</Text>
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
    // Referans yoksa veya boşsa başlığı tamamen gizle (Smart Section Hiding)
    const validRefs = data.references?.filter(r => r.fullName.trim() !== '') || [];
    if (validRefs.length === 0) return null;

    return (
      <View>
        <Text style={styles.sectionTitle}>{T.references}</Text>
        {validRefs.map((ref) => (
          <View key={ref.id} style={styles.listItem}>
            <Text style={styles.listBullet}>•</Text>
            <Text style={styles.listContent}>
              {ref.fullName} — {ref.companyAndTitle} {isEn ? '(Contact info withheld for privacy)' : '(İletişim bilgileri KVKK gereği gizlenmiştir, mülakat aşamasında sunulacaktır)'}
            </Text>
          </View>
        ))}
      </View>
    );
  };

  return (
    <Document
      title={`${data.firstName} ${data.lastName} - CV`}
      author={`${data.firstName} ${data.lastName}`}
      creator="Vardiyo CV Builder"
      subject={`${data.jobTitleName} CV`}
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
          
          {/* Sosyal & Profesyonel Linkler */}
          {(data.linkedin || data.github || data.portfolio) && (
             <View style={[styles.contactRow, { marginTop: 4 }]}>
               {data.linkedin && <Text style={styles.contactItem}>linkedin.com/in/{data.linkedin.replace(/^https?:\/\/(www\.)?linkedin\.com\/in\//, '').replace(/\/$/, '')}</Text>}
               {data.linkedin && data.github && <Text style={styles.contactSeparator}>|</Text>}
               {data.github && <Text style={styles.contactItem}>github.com/{data.github.replace(/^https?:\/\/(www\.)?github\.com\//, '').replace(/\/$/, '')}</Text>}
               {(data.linkedin || data.github) && data.portfolio && <Text style={styles.contactSeparator}>|</Text>}
               {data.portfolio && <Text style={styles.contactItem}>{data.portfolio.replace(/^https?:\/\//, '')}</Text>}
             </View>
          )}
        </View>

        {/* ATS BÖLÜM HİYERARŞİSİ */}
        {renderSummary()}

        {isExperienced ? (
          <>
            {renderExperience()}
            {renderProjects()}
            {renderSkills()}
            {renderEducation()}
          </>
        ) : (
          <>
            {renderEducation()}
            {renderSkills()}
            {renderProjects()}
            {renderExperience()}
          </>
        )}

        {renderExtras()}
        {renderReferences()}

      </Page>
    </Document>
  );
}

