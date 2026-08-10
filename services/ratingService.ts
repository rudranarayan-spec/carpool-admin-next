
import { apiClient } from "@/lib/api";
import { DeleteRatingResponse, GetRatingsParams, GetRatingsResponse } from "@/types/ratings.types";


const ratingService = {

  async getRatings(params?: GetRatingsParams): Promise<GetRatingsResponse> {
    const response = await apiClient.get<GetRatingsResponse>("/admin/ratings", {
      params,
    });
    return response.data;
  },

  async deleteRating(id: number): Promise<DeleteRatingResponse> {
    const response = await apiClient.delete<DeleteRatingResponse>(`/admin/ratings/${id}`);
    return response.data;
  },
};

export default ratingService;