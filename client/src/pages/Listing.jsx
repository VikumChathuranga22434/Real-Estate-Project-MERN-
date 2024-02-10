import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore from "swiper";
import { Navigation } from "swiper/modules";
import "swiper/css/bundle";

export default function Listing() {
  // initialize the packages
  // 1. use navigation to navigation between the images
  SwiperCore.use([Navigation]);

  // initialize the useState to store the listing data
  const [listing, setListing] = useState(null);

  // add loading effect
  const [loading, setLoading] = useState(false);

  // set error
  const [error, setError] = useState(false);

  // initialize the useParams hook
  const params = useParams();

  // getting the listing details from the DB
  useEffect(() => {
    const fetchListing = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/listing/get/${params.listingId}`);
        const data = await res.json();
        if (data.success === false) {
          setError(true);
          setLoading(false);
          return;
        }
        setListing(data);
        console.log(data);

        setLoading(false);
        setError(false);
      } catch (error) {
        setLoading(false);
        setError(true);
      }
    };
    fetchListing();
  }, [params.listingId]);

  return (
    <main>
      {loading && <p className="text-center my-7 text-2xl">Loading...</p>}
      {error && (
        <p className="text-center my-7 text-2xl">Something went wrong...</p>
      )}

      {listing && !loading && !error && (
        <div>
          <Swiper navigation>
            {listing.imageUrls.map((url) => (
              <SwiperSlide key={url}>
                <div
                  className="h-[550px]"
                  style={{
                    background: `url(&{url}) center no-repeat`,
                    backgroundSize: "cover",
                  }}
                ></div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      )}
    </main>
  );
}

// import { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";
// import { Swiper, SwiperSlide } from "swiper/react";
// import SwiperCore from "swiper";
// import { Navigation } from "swiper/modules";
// import "swiper/css/bundle";

// // https://sabe.io/blog/javascript-format-numbers-commas#:~:text=The%20best%20way%20to%20format,format%20the%20number%20with%20commas.

// export default function Listing() {
//   SwiperCore.use([Navigation]);
//   const [listing, setListing] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(false);
//   const params = useParams();

//   useEffect(() => {
//     const fetchListing = async () => {
//       try {
//         setLoading(true);
//         const res = await fetch(`/api/listing/get/${params.listingId}`);
//         const data = await res.json();
//         if (data.success === false) {
//           setError(true);
//           setLoading(false);
//           return;
//         }
//         setListing(data);
//         setLoading(false);
//         setError(false);
//       } catch (error) {
//         setError(true);
//         setLoading(false);
//       }
//     };
//     fetchListing();
//   }, [params.listingId]);

//   return (
//     <main>
//       {loading && <p className="text-center my-7 text-2xl">Loading...</p>}
//       {error && (
//         <p className="text-center my-7 text-2xl">Something went wrong!</p>
//       )}
//       {listing && !loading && !error && (
//         <div>
//           <Swiper navigation>
//             {listing.imageUrls.map((url) => (
//               <SwiperSlide key={url}>
//                 <div
//                   className="h-[550px]"
//                   style={{
//                     background: `url(${url}) center no-repeat`,
//                     backgroundSize: "cover",
//                   }}
//                 ></div>
//               </SwiperSlide>
//             ))}
//           </Swiper>
//         </div>
//       )}
//     </main>
//   );
// }
