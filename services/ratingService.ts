
import { apiClient } from "@/lib/api";
import { DeleteRatingResponse, GetRatingsParams, GetRatingsResponse } from "@/types/ratings.types";


const ratingService = {

  async getRatings(params?: GetRatingsParams): Promise<GetRatingsResponse> {
    const response = await apiClient.get<GetRatingsResponse>("/ratings", {
      params,
    });
    return response.data;
  },

  async deleteRating(id: number): Promise<DeleteRatingResponse> {
    const response = await apiClient.delete<DeleteRatingResponse>(`/ratings/${id}`);
    return response.data;
  },
};

export default ratingService;