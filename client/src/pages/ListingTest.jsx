import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function ListingTest() {
  // get the listingId
  const params = useParams();

  // set listing details
  const [listing, setListing] = useState(null);

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
      {loading && <p className="text-center my-7 text-2xl">Loading...</p>}
      {error && (
        <p className="text-center my-7 text-2xl">Something went Wrong...</p>
      )}
      {listing && <p>{listing.name}</p>}
    </main>
  );
}
