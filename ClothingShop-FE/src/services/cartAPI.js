import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const cartAPI = createApi({
    reducerPath: 'cartAPI',
    baseQuery: fetchBaseQuery({
        baseUrl: 'http://localhost:5078/api',
        credentials: 'include',
        prepareHeaders: (headers, { getState }) => {
            const token = getState().auth.token;
            if (token) {
                headers.set('authorization', `Bearer ${token}`);
            }
            return headers;
        },
    }),
    tagTypes: ['Cart'],
    endpoints: (builder) => ({
        // Get cart by user ID
        getCart: builder.query({
            query: (userId) => ({
                url: '/cart',
                params: { userId },
            }),
            providesTags: ['Cart'],
        }),

        // Add or update cart item
        addOrUpdateCartItem: builder.mutation({
            query: ({ userId, productId, quantity }) => ({
                url: '/cart/addOrUpdate',
                method: 'POST',
                body: { userId, productId, quantity },
            }),
            invalidatesTags: ['Cart'],
        }),

        // Remove cart item
        removeCartItem: builder.mutation({
            query: ({ userId, productId }) => ({
                url: '/cart/remove',
                method: 'DELETE',
                body: { userId, productId },
            }),
            invalidatesTags: ['Cart'],
        }),

        // Clear entire cart
        clearCart: builder.mutation({
            query: (userId) => ({
                url: `/cart/clear/${userId}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Cart'],
        }),
    }),
});

export const {
    useGetCartQuery,
    useAddOrUpdateCartItemMutation,
    useRemoveCartItemMutation,
    useClearCartMutation,
} = cartAPI;

export default cartAPI;
