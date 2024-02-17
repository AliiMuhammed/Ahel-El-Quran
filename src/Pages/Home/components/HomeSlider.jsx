import React from "react";
import MainHeader from "../../../Shared/components/MainHeader";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "../Style/homeSlider.css";
import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/pagination";
import img1 from "../../../Assets/Home/doa2 1.jpg";
import img2 from "../../../Assets/Home/doa2 2.jpg";
import img3 from "../../../Assets/Home/doa2 3.jpg";
import img4 from "../../../Assets/Home/doa2 4.jpg";
import img5 from "../../../Assets/Home/doa2 5.jpg";
import img6 from "../../../Assets/Home/doa2 6.jpg";
import img7 from "../../../Assets/Home/doa2 7.jpg";
import img8 from "../../../Assets/Home/doa2 8.jpg";
import img9 from "../../../Assets/Home/doa2 9.jpg";
import img10 from "../../../Assets/Home/doa2 10.jpg";
const HomeSlider = () => {
  const imgsDoaa = [
    img1,
    img2,
    img3,
    img4,
    img5,
    img6,
    img7,
    img8,
    img9,
    img10,
  ];
  return (
    <section className="HomeSlider">
      <div className="container">
        <MainHeader
          Header={"بَعْض مِن أَدعِية الأنْبياء"}
          smHeader={"أَدعِية"}
        />
        <Swiper
          spaceBetween={30}
          grabCursor={true}
          centeredSlides={true}
          slidesPerView={"auto"}
          coverflowEffect={{
            rotate: 50,
            stretch: 0,
            depth: 200,
            modifier: 1,
            slideShadows: true,
          }}
          autoplay={{
            delay: 4500,
            disableOnInteraction: false,
          }}
          loop={true}
          pagination={true}
          modules={[Autoplay, Pagination]}
          className="mySwiper doaa"
        >
          {imgsDoaa.map((doaa, index) => {
            return (
              <SwiperSlide key={index}>
                <div className="slide-doaa">
                  <img src={doaa} alt="doaa" loading="lazy" />
                </div>
              </SwiperSlide>
            );
          })}
        </Swiper>
      </div>
    </section>
  );
};

export default HomeSlider;
