import React, { useState } from "react";
import { useSelector } from "react-redux";
import MainHeading from "../../Shared/components/MainHeading";
import Form from "react-bootstrap/Form";

import "./style/reader.css";

const Reader = () => {
  const reader = useSelector((state) => state.readerData);
  const [selectedSurahIndex, setSelectedSurahIndex] = useState(0); // State to track selected Surah index

  if (!reader) {
    return <section>Reader details not found.</section>;
  }

  const surahNamesArabic = [
    "الفاتحة",
    "البقرة",
    "آل عمران",
    "النساء",
    "المائدة",
    "الأنعام",
    "الأعراف",
    "الأنفال",
    "التوبة",
    "يونس",
    "هود",
    "يوسف",
    "الرعد",
    "إبراهيم",
    "الحجر",
    "النحل",
    "الإسراء",
    "الكهف",
    "مريم",
    "طه",
    "الأنبياء",
    "الحج",
    "المؤمنون",
    "النور",
    "الفرقان",
    "الشعراء",
    "النمل",
    "القصص",
    "العنكبوت",
    "الروم",
    "لقمان",
    "السجدة",
    "الأحزاب",
    "سبإ",
    "فاطر",
    "يس",
    "الصافات",
    "ص",
    "الزمر",
    "غافر",
    "فصلت",
    "الشورى",
    "الزخرف",
    "الدخان",
    "الجاثية",
    "الأحقاف",
    "محمد",
    "الفتح",
    "الحجرات",
    "ق",
    "الذاريات",
    "الطور",
    "النجم",
    "القمر",
    "الرحمن",
    "الواقعة",
    "الحديد",
    "المجادلة",
    "الحشر",
    "الممتحنة",
    "الصف",
    "الجمعة",
    "المنافقون",
    "التغابن",
    "الطلاق",
    "التحريم",
    "الملك",
    "القلم",
    "الحاقة",
    "المعارج",
    "نوح",
    "الجن",
    "المزمل",
    "المدثر",
    "القيامة",
    "الإنسان",
    "المرسلات",
    "النبأ",
    "النازعات",
    "عبس",
    "التكوير",
    "الإنفطار",
    "المطففين",
    "الإنشقاق",
    "البروج",
    "الطارق",
    "الأعلى",
    "الغاشية",
    "الفجر",
    "البلد",
    "الشams",
    "الليل",
    "الضحى",
    "الشرح",
    "التين",
    "العلق",
    "القدر",
    "البينة",
    "الزلزلة",
    "العاديات",
    "القارعة",
    "التكاثر",
    "العصر",
    "الهمزة",
    "الفيل",
    "قريش",
    "الماعون",
    "الكوثر",
    "الكافرون",
    "النصر",
    "المسد",
    "الإخلاص",
    "الفلق",
    "الناس",
  ];

  const breadcrumb = {
    الرئيسية: "/",
    القرآن: "/quran",
    القارء: "/reader/:readerName",
  };

  const handleSurahSelect = (e) => {
    setSelectedSurahIndex(parseInt(e.target.value, 10)); // Update selected Surah index
  };
  console.log(reader);

  let surahs_numbers = reader.moshaf[selectedSurahIndex].surah_list
    .split(",")
    .map(Number);
  const surahElements = surahs_numbers.map((number) => (
    <div className="surah" key={number}>
      {surahNamesArabic[number - 1]}{" "}
      {/* Adjust index since surahNumbers start from 1 */}
    </div>
  ));
  console.log(surahs_numbers);
  return (
    <section className="reader-section">
      <MainHeading title={`القارء ${reader.name}`} breadcrumb={breadcrumb} />
      <section className="reader-content">
        <div className="container">
          <Form.Select
            name="rwaya"
            size="lg"
            className="reader-rwaya"
            onChange={handleSurahSelect} // Call handleSurahSelect on select change
          >
            {reader.moshaf.map((e, index) => {
              return (
                <option key={e.id} value={index}>
                  {e.name}
                </option>
              );
            })}
          </Form.Select>
        </div>
        <div className="surahs">{surahElements}</div>
      </section>
    </section>
  );
};

export default Reader;
