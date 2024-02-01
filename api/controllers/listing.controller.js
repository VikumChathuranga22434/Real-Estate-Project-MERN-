import Listing from "../models/listing.model.js";

export const createListing = async (req, res, next) => {
  try {
    // create a listing
    const listing = await Listing.create(res.body);
    return res.status(201).json(listing);
  } catch (error) {
    next(error);
  }
};
