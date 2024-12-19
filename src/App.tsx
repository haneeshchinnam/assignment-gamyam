import { useCallback, useEffect, useRef, useState } from "react";
import { debounce } from "lodash";
import { TailSpin } from "react-loader-spinner";
import "./App.css";
import { CarouselCard } from "./components";

function App() {
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const observerRef = useRef<HTMLDivElement>(null);
  const [cardData, setCardData] = useState<
    {
      id: number;
      acres: number;
      guntas: number;
      isVerified: boolean;
      images: string[];
      district: string;
      mandal: string;
      price: string;
    }[]
  >([]);

  useEffect(() => {
    const fetchData = async () => {
      if (loading || !hasMore) return;
      setLoading(true);

      try {
        const resp = await fetch(
          `https://prod-be.1acre.in/lands/?division=24&page_size=10&page=${page}`
        );
        const data: ApiResponse = await resp.json();

        const mappedData = data.results.map((l: LandData) => ({
          acres: l.total_land_size_in_acres.acres,
          guntas: l.total_land_size_in_acres.guntas,
          isVerified: l.is_basic_verified,
          images: l.land_media.map((p: LandMedia) => p.image),
          district:
            l.division_info.find(
              (info: DivisionInfo) => info.division_type === "district"
            )?.name ?? "",
          mandal:
            l.division_info.find(
              (info: DivisionInfo) => info.division_type === "mandal"
            )?.name ?? "",
          id: l.id,
          price: `${convertToCrores(l.price_per_acre_crore)} Cr /acre`,
        }));

        setCardData((prev) => [
          ...prev,
          ...mappedData.filter(
            (item: any) => !prev.some((p) => p.id === item.id)
          ),
        ]);

        if (data.results.length < 10) {
          setHasMore(false);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  console.log("page", page, cardData.length);

  function convertToCrores(price: PricePerAcre): number {
    return price.lakh / 100 + price.crore;
  }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleScroll = useCallback(
    debounce(() => {
      if (observerRef.current) {
        const { scrollTop, scrollHeight, clientHeight } = observerRef.current;
        if (
          scrollTop + clientHeight >= scrollHeight - 10 &&
          !loading &&
          hasMore
        ) {
          setPage((prev) => prev + 1);
        }
      }
    }, 200),
    []
  );

  useEffect(() => {
    const container = observerRef.current;
    if (container) {
      container.addEventListener("scroll", handleScroll);
    }

    return () => {
      if (container) {
        container.removeEventListener("scroll", handleScroll);
      }
    };
  }, [handleScroll]);

  return (
    <main className="w-[100vw] flex flex-col items-center">
      <section
        className="grid grid-cols-1 col-span-full sm:grid-cols-2 lg:grid-cols-4 overflow-y-auto h-[100vh] px-2 py-2 md:px-8 gap-3"
        ref={observerRef}
      >
        {cardData.map((data) => (
          <CarouselCard
            key={data.id}
            acres={data.acres}
            district={data.district}
            guntas={data.guntas}
            id={data.id}
            images={data.images}
            isVerified={data.isVerified}
            mandal={data.mandal}
            price={data.price}
          />
        ))}

        {loading && (
          <div className="col-span-full flex flex-col items-center gap-2 w-full h-full">
            <TailSpin color="#00BFFF" height={26} width={26} />
            <p>Loading...</p>
          </div>
        )}
      </section>
    </main>
  );
}

export default App;

interface LandMedia {
  image: string;
}

interface DivisionInfo {
  division_type: string;
  name: string;
}

interface TotalLandSize {
  acres: number;
  guntas: number;
}

interface PricePerAcre {
  lakh: number;
  crore: number;
}

interface LandData {
  total_land_size_in_acres: TotalLandSize;
  is_basic_verified: boolean;
  land_media: LandMedia[];
  division_info: DivisionInfo[];
  id: number;
  price_per_acre_crore: PricePerAcre;
}

interface ApiResponse {
  results: LandData[];
}

interface PricePerAcre {
  lakh: number;
  crore: number;
}
