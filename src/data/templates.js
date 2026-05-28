export const SURVEY_TEMPLATES = [
  {
    id: 'customer-feedback',
    title: 'Müşteri Memnuniyet Anketi',
    description: 'Ürün veya hizmetleriniz hakkında müşterilerinizden geri bildirim alın.',
    icon: '🛍️',
    questions: [
      { id: 'q1', text: 'Ürünümüzden ne kadar memnunsunuz?', type: 'multipleChoice', options: ['Çok Memnunum', 'Memnunum', 'Kararsızım', 'Memnun Değilim'] },
      { id: 'q2', text: 'Ürünümüzü bir arkadaşınıza önerir misiniz?', type: 'multipleChoice', options: ['Kesinlikle Evet', 'Belki', 'Hayır'] },
      { id: 'q3', text: 'Sizi en çok hangi özelliğimiz etkiledi?', type: 'text' },
      { id: 'q4', text: 'Geliştirmemizi istediğiniz bir alan var mı?', type: 'text' }
    ]
  },
  {
    id: 'employee-onboarding',
    title: 'Çalışan Oryantasyon Geri Bildirimi',
    description: 'Yeni çalışanlarınızın ilk haftasını ve eğitim sürecini değerlendirin.',
    icon: '🤝',
    questions: [
      { id: 'q1', text: 'Oryantasyon süreci yeterince açıklayıcı mıydı?', type: 'multipleChoice', options: ['Evet, Çok Net', 'Kısmen', 'Hayır, Karışıktı'] },
      { id: 'q2', text: 'Ekibinizle tanışma sürecinden memnun kaldınız mı?', type: 'multipleChoice', options: ['Evet', 'Hayır'] },
      { id: 'q3', text: 'İlk haftanızdaki en büyük zorluk neydi?', type: 'text' }
    ]
  },
  {
    id: 'event-registration',
    title: 'Etkinlik Kayıt ve Beklenti Formu',
    description: 'Etkinlik öncesi katılımcı bilgilerini ve beklentilerini toplayın.',
    icon: '📅',
    questions: [
      { id: 'q1', text: 'Etkinliğe hangi şehirden katılıyorsunuz?', type: 'text' },
      { id: 'q2', text: 'Daha önce etkinliklerimize katıldınız mı?', type: 'multipleChoice', options: ['Evet', 'Hayır'] },
      { id: 'q3', text: 'Bu etkinlikten temel beklentiniz nedir?', type: 'multipleChoice', options: ['Networking', 'Yeni Bilgiler Öğrenmek', 'Eğlence'] }
    ]
  }
];
