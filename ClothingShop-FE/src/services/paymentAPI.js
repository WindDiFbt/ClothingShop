import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const paymentAPI = createApi({
    reducerPath: 'paymentAPI',
    baseQuery: fetchBaseQuery({
        baseUrl: 'http://localhost:5078/api/payment',
        prepareHeaders: (headers, { getState }) => {
            const token = getState().auth.token;
            if (token) {
                headers.set('authorization', `Bearer ${token}`);
            }
            headers.set('content-type', 'application/json');
            return headers;
        },
    }),
    tagTypes: ['Payment'],
    endpoints: (builder) => ({
        createPayOSPayment: builder.mutation({
            query: (orderData) => {
                console.log('Creating PayOS payment for order:', orderData);
                return {
                    url: '/payos/create',
                    method: 'POST',
                    body: orderData,
                };
            },
            transformResponse: (response) => {
                console.log('PayOS create payment response:', response);
                return response;
            },
            transformErrorResponse: (response) => {
                console.error('PayOS create payment error:', response);
                return response;
            },
        }),
        getPaymentStatus: builder.query({
            query: (paymentLinkId) => {
                console.log('Getting payment status for:', paymentLinkId);
                return `/payos/status/${paymentLinkId}`;
            },
            transformResponse: (response) => {
                console.log('Payment status response:', response);
                return response;
            },
            providesTags: ['Payment'],
        }),
        cancelPayment: builder.mutation({
            query: ({ paymentLinkId, reason }) => {
                console.log('Cancelling payment:', paymentLinkId, reason);
                return {
                    url: `/payos/cancel/${paymentLinkId}`,
                    method: 'POST',
                    body: { reason },
                };
            },
            transformResponse: (response) => {
                console.log('Cancel payment response:', response);
                return response;
            },
            invalidatesTags: ['Payment'],
        }),
    }),
});

export const {
    useCreatePayOSPaymentMutation,
    useGetPaymentStatusQuery,
    useCancelPaymentMutation,
} = paymentAPI;

export default paymentAPI;
