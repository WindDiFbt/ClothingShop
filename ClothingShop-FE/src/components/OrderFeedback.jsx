import React, { useState } from 'react';

import { useSelector } from 'react-redux';
import FeedbackForm from './FeedbackForm';
import '../styles/feedback.css';

const OrderFeedback = ({ order, orderDetail }) => {
    const [showFeedbackForm, setShowFeedbackForm] = useState(false);
    const { user } = useSelector(state => state.auth);

    // Kiểm tra xem user đã feedback cho sản phẩm này chưa
    const hasFeedback = orderDetail.hasFeedback;
    const feedback = orderDetail.feedback;

    // Chỉ hiển thị nút feedback nếu đơn hàng đã được giao (DELIVERED)
    const canFeedback = order.status === 4; // Status 4 = DELIVERED

    const handleFeedbackSuccess = () => {
        setShowFeedbackForm(false);
        // Có thể reload data hoặc cập nhật UI
        window.location.reload(); // Tạm thời reload, sau này có thể optimize
    };

    // Component để hiển thị rating stars
    const StarRating = ({ rating }) => {
        return (
            <div className="star-rating">
                {[1, 2, 3, 4, 5].map((star) => (
                    <span
                        key={star}
                        className={`star ${star <= rating ? 'filled' : ''}`}
                    >
                        ★
                    </span>
                ))}
            </div>
        );
    };

    if (!user || !canFeedback) {
        return null;
    }

    return (
        <div className="order-feedback">
            {!hasFeedback && (
                <div className="feedback-actions">
                    {!showFeedbackForm ? (
                        <button
                            className="feedback-btn"
                            onClick={() => setShowFeedbackForm(true)}
                        >
                            Đánh giá sản phẩm
                        </button>
                    ) : (
                        <div className="feedback-form-container">
                            <FeedbackForm
                                productId={orderDetail.productId}
                                orderId={order.id}
                                onSuccess={handleFeedbackSuccess}
                            />
                            <button
                                className="cancel-btn"
                                onClick={() => setShowFeedbackForm(false)}
                            >
                                Hủy
                            </button>
                        </div>
                    )}
                </div>
            )}

            {hasFeedback && feedback && (
                <div className="feedback-display">
                    <div className="feedback-header">
                        <span className="feedback-label">Đánh giá của bạn:</span>
                        <StarRating rating={feedback.rating} />
                    </div>
                    {feedback.comment && (
                        <div className="feedback-comment">
                            <p>"{feedback.comment}"</p>
                        </div>
                    )}
                    <div className="feedback-date">
                        <small>Đánh giá vào: {new Date(feedback.createAt).toLocaleDateString('vi-VN')}</small>
                    </div>
                </div>
            )}
        </div>
    );
};

export default OrderFeedback;
