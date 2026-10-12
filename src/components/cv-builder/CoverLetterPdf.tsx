import { Document, Page, Text, View, StyleSheet, Font } from '@react-pdf/renderer';
import type { CVFormData } from '../../types/cv';

// Aynı fontları kullanıyoruz
Font.register({
  family: 'Arimo',
  fonts: [
    { src: 'https://raw.githubusercontent.com/googlefonts/arimo/main/fonts/ttf/Arimo-Regular.ttf', fontWeight: 400 },
    { src: 'https://raw.githubusercontent.com/googlefonts/arimo/main/fonts/ttf/Arimo-Bold.ttf', fontWeight: 700 },
  ]
});

const styles = StyleSheet.create({
  page: {
    padding: '40 50', // Ön yazı için daha geniş kenar boşlukları (Klasik mektup stili)
    fontFamily: 'Arimo',
    fontSize: 11,
    color: '#000000',
    lineHeight: 1.6, // Okunabilirliği artırmak için yüksek satır aralığı
  },
  header: {
    marginBottom: 30,
    borderBottomWidth: 1.5,
    borderBottomColor: '#333333',
    paddingBottom: 15,
  },
  fullName: {
    fontSize: 20,
    fontFamily: 'Arimo',
    fontWeight: 700,
    color: '#000000',
    textTransform: 'uppercase',
  },
  jobTitle: {
    fontSize: 12,
    color: '#333333',
    marginTop: 4,
    marginBottom: 8,
  },
  contactRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  contactItem: {
    fontSize: 10,
    color: '#333333',
  },
  contactSeparator: {
    fontSize: 10,
    color: '#333333',
    marginHorizontal: 4,
  },
  date: {
    fontSize: 10,
    color: '#000000',
    textAlign: 'right',
    marginBottom: 20,
  },
  salutation: {
    fontSize: 11,
    fontFamily: 'Arimo',
    fontWeight: 700,
    marginBottom: 15,
  },
  paragraph: {
    fontSize: 11,
    marginBottom: 12,
    textAlign: 'justify',
  },
  signOff: {
    marginTop: 30,
    fontSize: 11,
  },
  signatureName: {
    marginTop: 40,
    fontSize: 12,
    fontFamily: 'Arimo',
    fontWeight: 700,
  }
});

interface CoverLetterPdfProps {
  data: CVFormData;
}

export default function CoverLetterPdf({ data }: CoverLetterPdfProps) {
  const isEn = data.language === 'en';

  const today = new Intl.DateTimeFormat(isEn ? 'en-US' : 'tr-TR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  }).format(new Date());

  // Dinamik Metin Üretimi
  const greeting = isEn ? 'To the Hiring Manager,' : 'İlgili Makama / İşe Alım Yöneticisine,';
  
  // İşe Alım / İK için özel, "istekli", "zeki", "hızlı öğrenen", "analitik", "askerlik/tecil/kariyer içermeyen" metin
  const isHR = data.jobTitleName.toLowerCase().includes('işe alım') || data.jobTitleName.toLowerCase().includes('insan kaynakları');

  let p1 = '', p2 = '', p3 = '';

  if (isEn) {
    p1 = `I am writing to express my strong interest in the ${data.jobTitleName} position at your esteemed company. With my background and strong dedication, I am confident in my ability to make an immediate and positive impact on your team.`;
    p2 = `My enclosed resume provides a detailed overview of my experience, including my previous roles and the skills I have developed. I pride myself on my ability to adapt quickly, solve problems efficiently, and collaborate effectively with my colleagues.`;
    p3 = `I am highly motivated to bring my expertise to your company and contribute to your ongoing success. I would welcome the opportunity to discuss how my qualifications align with your needs in an interview.`;
  } else {
    if (isHR) {
      p1 = `Şirketiniz bünyesinde açık bulunan ${data.jobTitleName} pozisyonuna başvurumu iletmek isterim. Yeni konuları hızlı öğrenme kapasitem ve yüksek çalışma isteğim ile bu rolde kurumunuza hızlıca adapte olabileceğime inanıyorum.`;
      p2 = `İnsan ilişkilerindeki başarım, güçlü iletişim becerilerim ve düzgün diksiyonum sayesinde hem adaylarla hem de ekip arkadaşlarımla uyumlu bir çalışma süreci yürütebilirim. Aynı zamanda, olaylara analitik yaklaşma becerim ve pratik çözüm üretebilme yapım, süreçlerin sağlıklı ilerlemesine büyük katkı sağlayacaktır.`;
      p3 = `Özgeçmişimi ekte bilginize sunuyorum. İşini ciddiyetle yapan, bulunduğu ortama hızla uyum sağlayan ve verilen görevi en iyi şekilde yerine getirmek için oldukça motive biriyim. Konuyu detaylıca görüşebilmek için mülakat fırsatı rica ediyorum.`;
    } else {
      p1 = `Şirketiniz bünyesinde açık bulunan ${data.jobTitleName} pozisyonuna başvurumu iletmek isterim. İlgili alandaki geçmiş tecrübelerim ve temel yetkinliklerimle kurumunuzun hedeflerine katkı sağlamayı amaçlıyorum.`;
      p2 = `Ekte yer alan özgeçmişim, eğitim durumum ve mesleki deneyimlerim hakkında detaylı bilgi içermektedir. Görev ve sorumluluk bilinciyle, bana verilecek görevleri en verimli şekilde yerine getirme gayretindeyim.`;
      p3 = `Yetkinliklerimin pozisyonun gerekliliklerine uygun olduğunu değerlendiriyor, konuyla ilgili detayları yüz yüze görüşebilmek için geri dönüşünüzü bekliyorum.`;
    }
  }

  const signOff = isEn ? 'Sincerely,' : 'Saygılarımla,';

  return (
    <Document
      title={`${data.firstName} ${data.lastName} - Cover Letter`}
      author={`${data.firstName} ${data.lastName}`}
      creator="Vardiyo CV Builder"
      subject={`${data.jobTitleName} Cover Letter`}
    >
      <Page size="A4" style={styles.page}>
        {/* HEADER */}
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

        {/* TARIH */}
        <Text style={styles.date}>{today}</Text>

        {/* METİN */}
        <Text style={styles.salutation}>{greeting}</Text>
        <Text style={styles.paragraph}>{p1}</Text>
        <Text style={styles.paragraph}>{p2}</Text>
        <Text style={styles.paragraph}>{p3}</Text>

        {/* İMZA */}
        <Text style={styles.signOff}>{signOff}</Text>
        <Text style={styles.signatureName}>{data.firstName} {data.lastName}</Text>
        
      </Page>
    </Document>
  );
}
