import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import "./style/quran.css";
import MainHeading from "./../../Shared/components/MainHeading";
import MainHeader from "./../../Shared/components/MainHeader";
import axios from "axios";
import Loader from "../../Shared/components/Loader";
import { Link } from "react-router-dom";
import { Link as ScrollLink } from "react-scroll";
import { FaSearch } from "react-icons/fa";

const Quran = () => {
  const [readers, setReaders] = useState({
    loading: false,
    data: null,
    errMsg: null,
  });
  const [letters, setLetters] = useState([]);

  useEffect(() => {
    setReaders({ ...readers, loading: true });
    axios
      .get("https://mp3quran.net/api/v3/recent_reads")
      .then((res) => {
        const sortedReaders = res.data.reads.sort((a, b) =>
          a.name.localeCompare(b.name)
        );
        setReaders({ ...readers, data: sortedReaders, loading: false });

        const uniqueLetters = Array.from(
          new Set(
            sortedReaders
              .map((reader) =>
                reader.name.charAt(0).toUpperCase().replace(/[إأ]/g, "ا")
              )
              .filter((letter, index, self) => {
                return (
                  sortedReaders.some(
                    (reader) =>
                      reader.name
                        .charAt(0)
                        .toUpperCase()
                        .replace(/[إأ]/g, "ا") === letter
                  ) && self.indexOf(letter) === index
                );
              })
          )
        );
        setLetters(uniqueLetters);
      })
      .catch((err) => {
        setReaders({
          ...readers,
          loading: false,
          data: null,
          errMsg: "عفواً لقد حدث خطأ ما, برجاء اعادة المحاولة لاحقاً",
        });
        console.log(err);
      });
  }, []);

  const dispatch = useDispatch();

  const breadcrumb = {
    الرئيسية: "/",
    القرآن: "/quran",
  };

  if (readers.loading) {
    return (
      <section className="quran-section">
        <MainHeading breadcrumb={breadcrumb} title="القرآن الكريم" />
        <section className="readers">
          <div className="container">
            <Loader />
          </div>
        </section>
      </section>
    );
  }

  if (!readers.data || !Array.isArray(readers.data)) {
    return (
      <section className="quran-section">
        <MainHeading breadcrumb={breadcrumb} title="القرآن الكريم" />
        <section className="readers">
          <div className="container">{readers.errMsg}</div>
        </section>
      </section>
    );
  }

  const groupedReaders = readers.data.reduce((acc, reader) => {
    const firstLetter = reader.name
      .charAt(0)
      .toUpperCase()
      .replace(/[إأ]/g, "ا");
    if (!acc[firstLetter]) {
      acc[firstLetter] = [];
    }
    acc[firstLetter].push(reader);
    return acc;
  }, {});

  return (
    <section className="quran-section">
      <MainHeading breadcrumb={breadcrumb} title="القرآن الكريم" />
      <section className="readers">
        <MainHeader
          Header={"اِستمَع إِلى اَلقُرآن اَلكرِيم بِصَوت"}
          smHeader={"قُرَّاء اَلقُرآن اَلكرِيم"}
        />
        <div className="container">
          <div className="search-box">
            <button className="search-btn">
              <FaSearch />
            </button>
            <input
              type="search"
              name=""
              id=""
              placeholder="ادخل اسم القارء ..."
            />
          </div>
          <div className="search-letters">
            {letters.map((letter) => {
              return (
                <ScrollLink
                  className="main-btn second-btn letter"
                  activeClass="active"
                  to={letter}
                  spy={true}
                  smooth={true}
                  offset={-150}
                  duration={1}
                  key={letter}
                >
                  {letter}
                </ScrollLink>
              );
            })}{" "}
          </div>

          {letters.map((letter) => (
            <div className="letter-collection" key={letter}>
              <h2 className="one-letter" name={letter}>
                {letter}
              </h2>
              <div className="readers-cards">
                {groupedReaders[letter].map((reader) => (
                  <div className="reader-card" key={reader.id}>
                    <Link
                      key={reader.id}
                      to={`/reader/${reader.name}`}
                      className="main-btn"
                      onClick={() => {
                        dispatch({ type: "SET_READER_DATA", payload: reader });
                      }}
                    >
                      {reader.name}
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </section>
  );
};

export default Quran;
