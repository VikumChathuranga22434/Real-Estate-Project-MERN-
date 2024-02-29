import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import SwiperCore from 'swiper';
import { Navigation } from 'swiper/modules';
import 'swiper/css/bundle';

export default function ListingTest() {
  // intialize the swiper
  SwiperCore.use([Navigation]);

  // get the listingId
  const params = useParams();

  // set listing details
  const [listing, setListing] = useState(null);

  // set the image urls
  const [imageUrls, setImageUrls] = useState([]);

  // setting error to a state
  const [error, setError] = useState(false);

  // set loading state
  const [loading, setLoading] = useState(false);

  // get the listing details from the DB
  useEffect(() => {
    const fetchListing = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/listing/get/${params.listingId}`);
        const data = await res.json();
        // if data success
        if (data.success === false) {
          setError(true);
          setLoading(false);
          return;
        }
        // setting data
        setListing(data);
        setImageUrls(data.imageUrls);
        console.log(data.imageUrls);
        console.log(data);

        setLoading(false);
        setError(false);
      } catch (error) {
        setError(true);
        setLoading(false);
      }
    };
    fetchListing();
  }, [params.listingId]);

  return (
    <main>
      {loading && <p className='text-center my-7 text-2xl'>Loading...</p>}
      {error && (
        <p className='text-center my-7 text-2xl'>Something went Wrong...</p>
      )}

      {listing && !loading && !error && (
        <div>
          <Swiper navigation>
            {imageUrls.map((url) => (
              <SwiperSlide key={url}>
                <div
                  className='h-[550px]'
                  style={{
                    background: `url(${url}) center no-repeat`,
                    backgroundSize: 'cover',
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
