import { useMutation, useQuery } from "@tanstack/react-query";
import type { CreateOrderDto, OrderDto } from "../types/order";
import agent from "../api/agent";
import type { PaginatedList, PaginationParams } from "../types/common";

export const useCreateOrder = () => {
  return useMutation({
    mutationFn: async (dto: CreateOrderDto) => {
      const response = await agent.post("/Order/create", dto);
      return response.data;
    },
  });
};
export function useGetCurrentUserOrders(pagination: PaginationParams) {
  return useQuery({
    queryKey: ["orders", pagination],
    queryFn: async () => {
      const response = await agent.get<PaginatedList<OrderDto>>(
        "Order/current",
        { params: pagination },
      );
      return response.data;
    },
    retry: false,
  });
}