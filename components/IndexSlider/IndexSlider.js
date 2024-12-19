"use client";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import Aos from "aos";
import { useIsMobile } from "@/hooks/ecommerce.hooks";
import { convertHttpToHttps } from "@/helpers/convertHttpToHttps";

function extractYoutubeId(url) {
  const regex =
    /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
  const match = url.match(regex);
  return match ? match[1] : null;
}

const RenderBanner = ({ banner }) => {
  switch (banner.type) {
    case "image":
      return (
        <Image
          src={banner?.image}
          alt={banner?.title}
          width={0}
          height={0}
          sizes={`100vw`}
          className="w-full h-auto"
        />
      );

    case "video_link":
      const videoProvider = banner.video_provider;
      const videoUrl = banner.video_url;

      const src =
        videoProvider === "youtube"
          ? `${videoUrl}?autoplay=1&mute=1&loop=1&playsinline=1&controls=0&playlist=${extractYoutubeId(
              videoUrl
            )}`
          : `${videoUrl}?autoplay=1&muted=1&loop=1&background=1&playsinline=1`;

      return (
        <iframe
          className="w-full h-full object-cover aspect-[960/1550] md:aspect-[1920/800] pointer-events-none"
          width={banner.width}
          height={banner.height}
          src={src}
          frameborder="0"
          allow="autoplay; encrypted-media; fullscreen; picture-in-picture"
          allowFullScreen
        ></iframe>
      );
    default:
      return (
        <video
          width={banner?.file_data?.banner_position?.width}
          height={banner?.file_data?.banner_position?.height}
          className="bg-fixed w-full h-full object-cover"
          autoPlay
          loop
          muted
          playsInline
          controls={false}
        >
          <source src={convertHttpToHttps(banner?.file)} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      );
  }
};

const IndexSlider = ({ banners, mobileBanners }) => {
  const is_mobile = useIsMobile();

  const [currentSlide, setCurrentSlide] = useState({
    index: 0,
    banner: is_mobile ? mobileBanners?.[0]?.image : banners[0]?.image,
  });
  const [isDragging, setIsDragging] = useState(false);
  const [draggingIndex, setDraggingIndex] = useState(0);
  const sliderRef = useRef();

  useEffect(() => {
    let banner = is_mobile ? mobileBanners : banners;

    const handleMouseUp = () => {
      if (isDragging) {
        setCurrentSlide({
          index: draggingIndex,
          banner: banner?.[draggingIndex]?.image,
        });
        setIsDragging(false);
      }
    };

    const handleMouseMove = (event) => {
      if (isDragging) {
        let banner = is_mobile ? mobileBanners : banners;
        const sliderRect = sliderRef.current.getBoundingClientRect();
        const slideWidth = sliderRect.width / banner.length;
        const mouseX = event.clientX - sliderRect.left;
        let newIndex = Math.floor(mouseX / slideWidth);
        if (newIndex < 0) newIndex = 0;
        if (newIndex > banner.length - 1) newIndex = banner.length - 1;
        setDraggingIndex(newIndex);
      }
    };

    document.addEventListener("mouseup", handleMouseUp, { passive: true });
    document.addEventListener("mousemove", handleMouseMove, { passive: true });

    return () => {
      document.removeEventListener("mouseup", handleMouseUp);
      document.removeEventListener("mousemove", handleMouseMove);
    };
  }, [isDragging, draggingIndex, banners, mobileBanners]);

  const handleSlideChange = (index) => {
    setCurrentSlide({
      index: index,
      banner: is_mobile
        ? mobileBanners?.[index]?.image
        : banners?.[index]?.image,
    });
  };

  useEffect(() => {
    Aos.init();
  });
  const intervalRef = useRef(null);

  useEffect(() => {
    let banner = is_mobile ? mobileBanners : banners;

    const nextSlide = () => {
      setCurrentSlide((prevState) => {
        const nextIndex = (prevState.index + 1) % banner?.length;
        return {
          index: nextIndex,
          banner: banner?.[nextIndex]?.image,
        };
      });
    };
    intervalRef.current = setInterval(nextSlide, 5000);
    const handleInteraction = () => {
      clearInterval(intervalRef.current);
      intervalRef.current = setInterval(nextSlide, 5000);
    };
    window.addEventListener("click", handleInteraction);
    window.addEventListener("keydown", handleInteraction);
    return () => {
      clearInterval(intervalRef.current);
      window.removeEventListener("click", handleInteraction);
      window.removeEventListener("keydown", handleInteraction);
    };
  }, [banners, mobileBanners]);

  return (
    <div className="w-screen block" ref={sliderRef}>
      <div className="relative h-full overflow-hidden">
        <div className="items-center justify-between h-full w-full">
          {(is_mobile ? mobileBanners : banners ?? [])?.map((banner, index) => {
            const isActive = currentSlide?.index === index;
            return (
              <div
                key={index}
                className={
                  isActive
                    ? "relative w-full overflow-hidden h-full opacity-100 duration-[1000ms] transition-all ease-linear"
                    : "absolute w-full h-full overflow-hidden opacity-0 duration-[1000ms] transition-all ease-linear"
                }
              >
                <div className="relative sm:h-full">
                  <RenderBanner banner={banner} />
                  <Link
                    href={`${banner?.url ?? `/stranica-u-izradi`}`}
                    target={`${banner?.target}` ?? "_self"}
                    className="absolute z-[49] top-0 left-0 w-full h-full bg-black transition-all duration-500 bg-opacity-20"
                  >
                    <div className="absolute flex flex-col items-center md:items-start justify-center md:justify-start gap-[33px] max-sm:top-1/2 max-sm:left-1/2 max-sm:transform max-sm:-translate-x-1/2 max-sm:-translate-y-1/2 text-center md:text-left left-[4%] top-[40%] transform -translate-y-1/2">
                      {banner?.title && (
                        <h1 className="text-white max-sm:text-base text-xl font-bold">
                          {banner?.title}
                        </h1>
                      )}
                      {banner?.subtitle && (
                        <h2 className="text-white max-sm:text-xl text-4xl font-bold uppercase max-sm:mt-0 max-sm:mb-0 mt-2 mb-2">
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
              </div>
            );
          })}
        </div>
      </div>
      <div className="relative max-sm:hidden">
        <div className="absolute max-sm:-top-[1rem] md:-top-[2rem] xl:-top-[2rem] 2xl:-top-20  w-full flex items-center justify-center z-[50]">
          {banners?.map((banner, index) => (
            <div
              key={index}
              className={`${
                currentSlide?.index === index ? "bganimate" : "bg-white"
              } w-32 h-[3.5px]  mx-1 cursor-pointer`}
              onClick={() => handleSlideChange(index)}
            ></div>
          ))}

          {banners?.map((banner, index) => (
            <div
              key={index}
              className="absolute flex gap-10 items-center bottom-6"
            >
              <i
                className="cursor-pointer fas fa-chevron-left text-white text-sm"
                onClick={
                  currentSlide?.index === 0
                    ? () => handleSlideChange(banners.length - 1)
                    : () => handleSlideChange(currentSlide?.index - 1)
                }
              ></i>
              <div>
                <p className="text-white">{`${currentSlide?.index + 1} / ${
                  banners?.length
                }`}</p>
              </div>
              <i
                className="fas cursor-pointer fa-chevron-right text-white text-sm"
                onClick={
                  currentSlide?.index === banners.length - 1
                    ? () => handleSlideChange(0)
                    : () => handleSlideChange(currentSlide?.index + 1)
                }
              ></i>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default IndexSlider;
