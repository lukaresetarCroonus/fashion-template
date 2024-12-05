"use client";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { Swiper, SwiperSlide, useSwiper } from "swiper/react";
import "swiper/css/navigation";
import "swiper/css/effect-fade";
import "swiper/css/autoplay";
import { Autoplay, EffectFade, Pagination, Navigation } from "swiper/modules";

const IndexSlider = ({ banners, mobileBanners }) => {
  const renderMedia = (banner) => {
    if (banner?.file_data?.type === "video") {
      return (
        <video
          width={banner?.file_data?.banner_position?.width}
          height={banner?.file_data?.banner_position?.height}
          className="bg-fixed w-full h-full object-cover"
          autoPlay
          loop
          muted
        >
          <source src={banner?.file_data?.url} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      );
    } else {
      return (
        <Image
          src={banner?.file_data?.url}
          alt={banner?.file_data?.descriptions?.alt}
          width={1920}
          height={1080}
          className="bg-fixed w-full h-full object-cover"
        />
      );
    }
  };

  return (
    <>
      <div className="hidden md:block">
        <div className="absolute w-screen block max-sm:h-[400px] md:h-[510px] lg:h-[690px] xl:h-[700px] 2xl:h-[750px] 3xl:h-[800px]">
          <div className="relative h-full overflow-hidden">
            {banners && banners.length > 0 && (
              <Swiper
                rewind={true}
                modules={[EffectFade, Pagination, Autoplay]}
                effect="fade"
                autoplay={{
                  delay: 5000,
                }}
                pagination={{
                  type: "fraction",
                  currentClass: "text-white",
                  totalClass: "text-white",
                }}
                fadeEffect={{
                  crossFade: true,
                }}
                className="items-center max-sm:h-[400px] justify-between h-full w-full"
              >
                {banners.map((banner, index) => {
                  return (
                    <SwiperSlide key={index} className={"h-full w-full"}>
                      <div className="relative max-sm:h-[400px] sm:h-full">
                        {renderMedia(banner)}
                        <Link
                          href={`${banner?.url ?? `/stranica-u-izradi`}`}
                          target={banner?.target ?? "_self"}
                          className="absolute z-[49] top-0 left-0 w-full h-full bg-black transition-all duration-500 bg-opacity-40"
                        >
                          <div className="absolute flex flex-col items-center md:items-start justify-center md:justify-start max-sm:gap-[20px] gap-[33px] max-sm:top-[50%] top-[40%] text-center left-[4%] transform -translate-y-1/2">
                            {banner?.title && (
                              <h1 className="text-white max-sm:text-base text-xl font-bold ">
                                {banner?.title}
                              </h1>
                            )}
                            {banner?.subtitle && (
                              <h2 className="text-white max-sm:text-xl text-4xl font-bold uppercase">
                                {banner?.subtitle}
                              </h2>
                            )}
                            {banner?.text && (
                              <p className="text-white text-left sm:max-w-[60%] max-sm:text-[0.925rem] text-base font-normal">
                                {banner?.text}
                              </p>
                            )}
                            {banner?.button && (
                              <button className="bg-transparent  hover:bg-white hover:text-black transition-all duration-300  text-white text-sm font-bold uppercase py-4 px-12 max-sm:px-2 max-sm:py-2 max-sm:flex max-sm:items-center max-sm:justify-center border border-white max-sm:w-[250px]">
                                {banner?.button}
                              </button>
                            )}
                          </div>
                        </Link>
                      </div>
                    </SwiperSlide>
                  );
                })}
                <div
                  slot="container-start"
                  className="absolute z-20 left-0 w-full flex flex-col items-center justify-center bottom-6"
                >
                  <PaginationComponent />
                </div>
              </Swiper>
            )}
          </div>
        </div>
      </div>
      {mobileBanners && mobileBanners.length > 0 && (
        <Swiper
          modules={[Autoplay, EffectFade, Pagination]}
          effect="fade"
          rewind={true}
          pagination={{
            type: "fraction",
          }}
          autoplay={{
            delay: 5000,
            disableOnInteraction: false,
          }}
          fadeEffect={{
            crossFade: true,
          }}
          className="items-center max-sm:h-[400px] justify-between h-full w-full md:!hidden"
        >
          {mobileBanners.map((banner, index) => {
            return (
              <SwiperSlide
                key={index}
                className={"w-full h-full relative max-sm:h-[400px] sm:h-full"}
              >
                {renderMedia(banner)}
                <Link
                  href={`${banner?.url ?? `/stranica-u-izradi`}`}
                  target={banner?.target ?? "_self"}
                  className="absolute z-[49] top-0 left-0 w-full h-full bg-black transition-all duration-500 bg-opacity-40"
                >
                  <div className="absolute flex flex-col items-center md:items-start justify-center md:justify-start max-sm:gap-[20px] gap-[33px] max-sm:top-[50%] top-[40%] text-center left-[4%] transform -translate-y-1/2">
                    {banner?.title && (
                      <h1 className="text-white max-sm:text-base text-xl font-bold ">
                        {banner?.title}
                      </h1>
                    )}
                    {banner?.subtitle && (
                      <h2 className="text-white max-sm:text-xl text-4xl font-bold uppercase">
                        {banner?.subtitle}
                      </h2>
                    )}
                    {banner?.text && (
                      <p className="text-white text-left sm:max-w-[60%] max-sm:text-[0.925rem] text-base font-normal">
                        {banner?.text}
                      </p>
                    )}
                    {banner?.button && (
                      <button className="bg-transparent  hover:bg-white hover:text-black transition-all duration-300  text-white text-sm font-bold uppercase py-4 px-12 max-sm:px-2 max-sm:py-2 max-sm:flex max-sm:items-center max-sm:justify-center border border-white max-sm:w-[250px]">
                        {banner?.button}
                      </button>
                    )}
                  </div>
                </Link>
              </SwiperSlide>
            );
          })}
          <div
            slot="container-start"
            className="absolute z-20 left-0 w-full flex flex-col items-center justify-center bottom-6"
          >
            <PaginationComponent />
          </div>
        </Swiper>
      )}
    </>
  );
};

const PaginationComponent = () => {
  const swiper = useSwiper();
  console.log(swiper);
  return (
    <>
      <div className="flex gap-16 items-center bottom-6">
        <button
          onClick={() => {
            console.log("slide prev");
            swiper.slidePrev();
          }}
        >
          <i className="cursor-pointer fas fa-chevron-left text-white text-sm"></i>
        </button>
        {/* <div>
          <p className="text-white">
            {swiper.activeIndex + 1} / {swiper.slides.length}
          </p>
        </div> */}
        <button
          onClick={() => {
            swiper.slideNext();
          }}
        >
          <i className="fas cursor-pointer fa-chevron-right text-white text-sm"></i>
        </button>
      </div>
      {/* <div className={`bg-gray-500 w-32 h-[3.5px] mx-1 mt-2`}>
        <div
          className="bg-white h-full transition-all"
          style={{
            width:
              ((swiper.activeIndex + 1) / swiper.slides.length) * 100 + "%",
          }}
        ></div>
      </div> */}
    </>
  );
};

export default IndexSlider;
