import { ChevronLeft, ChevronRight, Heart, Share2 } from "lucide-react";
import { useState } from "react";

const CarouselCard = ({
  acres,
  district,
  guntas,
  id,
  images,
  isVerified,
  mandal,
  price,
}: {
  id: number;
  acres: number;
  guntas: number;
  isVerified: boolean;
  images: string[];
  district: string;
  mandal: string;
  price: string;
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  return (
    <section className="rounded-lg flex flex-col shadow-lg hover:shadow-lg transition-shadow overflow-hidden h-80 max-w-96">
      <section className="relative">
        <div
          className="flex duration-700 ease-in-out"
          style={{
            transform: `translateX(-${currentIndex * 100}%)`,
          }}
        >
          {images.map((image, index) => (
            <div
              key={index}
              className="w-full flex-shrink-0 relative overflow-hidden"
              style={{
                transform: index === currentIndex ? "scale(1)" : "scale(0.95)",
              }}
            >
              <img
                src={image}
                alt={`Slide ${index + 1}`}
                className="w-full rounded-t-lg shadow-lg h-56"
              />
            </div>
          ))}
        </div>
        <section className="absolute top-2 right-2 flex flex-row gap-3">
          <button className="p-1.5 bg-white/95 rounded-full">
            <Heart size={18} />
          </button>
          <button className="p-1.5 bg-white/95 rounded-full">
            <Share2 size={18} />
          </button>
        </section>
        <section className="absolute bottom-2 px-2 flex justify-between w-full z-10">
          <button className="p-1 bg-white/65 rounded-md" onClick={prevSlide}>
            <ChevronLeft />
          </button>
          <button className="p-1 bg-white/65 rounded-md" onClick={nextSlide}>
            <ChevronRight />
          </button>
        </section>
      </section>
      <section className="p-2 flex flex-col">
        <div className="flex items-center font-bold text-base gap-1.5">
          {price} <div className="w-1.5 h-1.5 bg-black rounded-full"></div>{" "}
         {acres} Acres {guntas} Guntas{" "}
          {isVerified && <img src="/social-media.png" alt="media" width={16} height={16} />}
        </div>
        <p className="text-gray-400 text-md">{mandal}, {district} (dt)</p>
      </section>
    </section>
  );
};

export default CarouselCard;
