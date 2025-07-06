import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const orderAPI = createApi({
  reducerPath: 'orderAPI',
  baseQuery: fetchBaseQuery({
    baseUrl: 'http://localhost:5078/api',
    credentials: 'include',
    prepareHeaders: (headers, { getState }) => {
      const token = getState().auth.token;
      console.log('Token from state:', token);
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
        console.log('Authorization header set:', `Bearer ${token.substring(0, 20)}...`);
      } else {
        console.log('No token found in state');
      }
      return headers;
    },
  }),
  tagTypes: ['Order'],
  endpoints: (builder) => ({
    // Checkout - Create order from cart
    checkout: builder.mutation({
      query: (checkoutData) => ({
        url: '/order/checkout',
        method: 'POST',
        body: checkoutData,
      }),
      invalidatesTags: ['Order'],
    }),

    // Get order by ID
    getOrder: builder.query({
      query: (orderId) => `/order/${orderId}`,
      providesTags: (result, error, orderId) => [{ type: 'Order', id: orderId }],
    }),

    // Get all user orders
    getUserOrders: builder.query({
      query: () => '/order',
      providesTags: (result) =>
        result
          ? [
            ...result.map(({ id }) => ({ type: 'Order', id })),
            { type: 'Order', id: 'LIST' },
          ]
          : [{ type: 'Order', id: 'LIST' }],
    }),

    // Cancel order
    cancelOrder: builder.mutation({
      query: (orderId) => ({
        url: `/order/${orderId}/cancel`,
        method: 'PUT',
      }),
      invalidatesTags: (result, error, orderId) => [
        { type: 'Order', id: orderId },
        { type: 'Order', id: 'LIST' },
      ],
    }),

    // Update order status (admin function)
    updateOrderStatus: builder.mutation({
      query: ({ orderId, status }) => ({
        url: `/order/${orderId}/status`,
        method: 'PUT',
        body: { status },
      }),
      invalidatesTags: (result, error, { orderId }) => [
        { type: 'Order', id: orderId },
        { type: 'Order', id: 'LIST' },
      ],
    }),
  }),
});

export const {
  useCheckoutMutation,
  useGetOrderQuery,
  useGetUserOrdersQuery,
  useCancelOrderMutation,
  useUpdateOrderStatusMutation,
} = orderAPI;

export default orderAPI;
