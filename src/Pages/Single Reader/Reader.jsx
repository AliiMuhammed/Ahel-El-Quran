import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import MainHeading from "../../Shared/components/MainHeading";
import Form from "react-bootstrap/Form";
import AudioPlayer from "react-h5-audio-player";
import "react-h5-audio-player/lib/styles.css";
import "./style/reader.css";
import {
  FaSearch,
  FaRegPlayCircle,
  FaRegArrowAltCircleDown,
} from "react-icons/fa";
import Alert from "./../../Shared/components/Alert";

const surahNamesArabicWithNumbers = [
  "١ - الفاتحة",
  "٢ - البقرة",
  "٣ - آل عمران",
  "٤ - النساء",
  "٥ - المائدة",
  "٦ - الأنعام",
  "٧ - الأعراف",
  "٨ - الأنفال",
  "٩ - التوبة",
  "١٠ - يونس",
  "١١ - هود",
  "١٢ - يوسف",
  "١٣ - الرعد",
  "١٤ - إبراهيم",
  "١٥ - الحجر",
  "١٦ - النحل",
  "١٧ - الإسراء",
  "١٨ - الكهف",
  "١٩ - مريم",
  "٢٠ - طه",
  "٢١ - الأنبياء",
  "٢٢ - الحج",
  "٢٣ - المؤمنون",
  "٢٤ - النور",
  "٢٥ - الفرقان",
  "٢٦ - الشعراء",
  "٢٧ - النمل",
  "٢٨ - القصص",
  "٢٩ - العنكبوت",
  "٣٠ - الروم",
  "٣١ - لقمان",
  "٣٢ - السجدة",
  "٣٣ - الأحزاب",
  "٣٤ - سبإ",
  "٣٥ - فاطر",
  "٣٦ - يس",
  "٣٧ - الصافات",
  "٣٨ - ص",
  "٣٩ - الزمر",
  "٤٠ - غافر",
  "٤١ - فصلت",
  "٤٢ - الشورى",
  "٤٣ - الزخرف",
  "٤٤ - الدخان",
  "٤٥ - الجاثية",
  "٤٦ - الأحقاف",
  "٤٧ - محمد",
  "٤٨ - الفتح",
  "٤٩ - الحجرات",
  "٥٠ - ق",
  "٥١ - الذاريات",
  "٥٢ - الطور",
  "٥٣ - النجم",
  "٥٤ - القمر",
  "٥٥ - الرحمن",
  "٥٦ - الواقعة",
  "٥٧ - الحديد",
  "٥٨ - المجادلة",
  "٥٩ - الحشر",
  "٦٠ - الممتحنة",
  "٦١ - الصف",
  "٦٢ - الجمعة",
  "٦٣ - المنافقون",
  "٦٤ - التغابن",
  "٦٥ - الطلاق",
  "٦٦ - التحريم",
  "٦٧ - الملك",
  "٦٨ - القلم",
  "٦٩ - الحاقة",
  "٧٠ - المعارج",
  "٧١ - نوح",
  "٧٢ - الجن",
  "٧٣ - المزمل",
  "٧٤ - المدثر",
  "٧٥ - القيامة",
  "٧٦ - الإنسان",
  "٧٧ - المرسلات",
  "٧٨ - النبأ",
  "٧٩ - النازعات",
  "٨٠ - عبس",
  "٨١ - التكوير",
  "٨٢ - الإنفطار",
  "٨٣ - المطففين",
  "٨٤ - الإنشقاق",
  "٨٥ - البروج",
  "٨٦ - الطارق",
  "٨٧ - الأعلى",
  "٨٨ - الغاشية",
  "٨٩ - الفجر",
  "٩٠ - البلد",
  "٩١ - الشمس",
  "٩٢ - الليل",
  "٩٣ - الضحى",
  "٩٤ - الشرح",
  "٩٥ - التين",
  "٩٦ - العلق",
  "٩٧ - القدر",
  "٩٨ - البينة",
  "٩٩ - الزلزلة",
  "١٠٠ - العاديات",
  "١٠١ - القارعة",
  "١٠٢ - التكاثر",
  "١٠٣ - العصر",
  "١٠٤ - الهمزة",
  "١٠٥ - الفيل",
  "١٠٦ - قريش",
  "١٠٧ - الماعون",
  "١٠٨ - الكوثر",
  "١٠٩ - الكافرون",
  "١١٠ - النصر",
  "١١١ - المسد",
  "١١٢ - الإخلاص",
  "١١٣ - الفلق",
  "١١٤ - الناس",
];

const Reader = () => {
  const [searchInput, setSearchInput] = useState("");

  const reader = useSelector((state) => state.readerData);
  const [selectedRwayaIndex, setSelectedRwayaIndex] = useState(0);
  const [selectedSurahIndex, setSelectedSurahIndex] = useState("001");
  const [selectedSurahClass, setSelectedSurahClass] = useState("");
  const [isAudioVisible, setIsAudioVisible] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  if (!reader) {
    return <section>Reader details not found.</section>;
  }

  const breadcrumb = {
    الرئيسية: "/",
    القرآن: "/quran",
    القارئ: "/reader/:readerName",
  };

  const handleSurahSelect = (e) => {
    setSelectedRwayaIndex(parseInt(e.target.value, 10)); // Update selected Surah index
  };

  let surahs_numbers = reader.moshaf[selectedRwayaIndex].surah_list
    .split(",")
    .map(Number);

  const arabicToEnglish = (arabicNumeral) => {
    const arabicNumbers = "٠١٢٣٤٥٦٧٨٩";
    const englishNumbers = "0123456789";
    return arabicNumeral.replace(/[٠-٩]/g, (match) => {
      const index = arabicNumbers.indexOf(match);
      return englishNumbers.charAt(index);
    });
  };

  const handleSurahClick = (number) => {
    setSelectedSurahIndex(arabicToEnglish(number).toString().padStart(3, "0"));
    setSelectedSurahClass(`second-btn-${number}`);
    setIsAudioVisible(true);
    setIsPlaying(true);
  };

  const surahElements = surahs_numbers
    .filter((surahNumber) =>
      surahNamesArabicWithNumbers[surahNumber - 1]
        .toLowerCase()
        .includes(searchInput.toLowerCase())
    )
    .map((surahNumber) => {
      const surah = surahNamesArabicWithNumbers[surahNumber - 1];
      return (
        <div
          className={`surah main-btn ${
            selectedSurahClass === `second-btn-${surahNumber}`
              ? "second-btn"
              : ""
          }`}
          key={surahNumber}
        >
          {surah}
          <a
            href={`${reader.moshaf[selectedRwayaIndex].server}${selectedSurahIndex}.mp3`}
            download={`${selectedSurahIndex}.mp3`}
            title="تحميل السورة"
            target="_blank"
            rel="noreferrer"
          >
            <FaRegArrowAltCircleDown />
          </a>
          <button
            className="play-btn"
            onClick={() => handleSurahClick(surah.split(" - ")[0])}
            title="الأستماع الي السورة"
          >
            <FaRegPlayCircle />
          </button>
        </div>
      );
    });
  const audioElement = () => {
    const audioSrc = `${reader.moshaf[selectedRwayaIndex].server}${selectedSurahIndex}.mp3`;
    return isAudioVisible ? (
      <AudioPlayer
        src={audioSrc}
        className="audio-element"
        autoPlay={isPlaying}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onEnded={() => setIsAudioVisible(false)}
      />
    ) : null;
  };

  const handleSearch = (e) => {
    const input = e.target.value;
    setSearchInput(input);
  };

  console.log();

  return (
    <section className="reader-section">
      <MainHeading title={`القارئ ${reader.name}`} breadcrumb={breadcrumb} />
      <section className="reader-content">
        <div className="container">
          <div className="search-box">
            <button className="search-btn">
              <FaSearch />
            </button>
            <input
              type="search"
              name=""
              id=""
              placeholder="ادخل اسم السورة ..."
              value={searchInput}
              onChange={handleSearch}
            />
          </div>

          <div className="surah-audio">{audioElement()}</div>
          <Form.Select
            name="rwaya"
            size="lg"
            className="reader-rwaya"
            onChange={handleSurahSelect}
          >
            {reader.moshaf.map((e, index) => {
              return (
                <option key={e.id} value={index}>
                  {e.name}
                </option>
              );
            })}
          </Form.Select>
          <div className="surahs">{surahElements}</div>
          {surahElements.length === 0 && (
            <Alert
              msg={`لا يوجد سورة بهذا الاسم "${searchInput}"`}
              variant={"warning"}
            />
          )}
        </div>
      </section>
    </section>
  );
};

export default Reader;
