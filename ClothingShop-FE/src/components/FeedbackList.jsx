import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getFeedbackByProductThunk } from '../redux/slices/feedbackSlice';
import '../styles/feedback.css';

const FeedbackList = ({ productId }) => {
    const dispatch = useDispatch();
    const { productFeedbacks, loading, error } = useSelector(state => state.feedback);

    useEffect(() => {
        if (productId) {
            dispatch(getFeedbackByProductThunk(productId));
        }
    }, [dispatch, productId]);

    const renderStars = (rating) => {
        return Array.from({ length: 5 }, (_, index) => (
            <span
                key={index}
                className={`star ${index < rating ? 'filled' : ''}`}
            >
                ★
            </span>
        ));
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('vi-VN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const calculateAverageRating = () => {
        if (!productFeedbacks || productFeedbacks.length === 0) return 0;
        const total = productFeedbacks.reduce((sum, feedback) => sum + feedback.rating, 0);
        return (total / productFeedbacks.length).toFixed(1);
    };

    if (loading) {
        return <div className="feedback-loading">Đang tải đánh giá...</div>;
    }

    if (error) {
        return <div className="feedback-error">Lỗi khi tải đánh giá: {error}</div>;
    }

    if (!productFeedbacks || productFeedbacks.length === 0) {
        return (
            <div className="feedback-list">
                <h3>Đánh giá sản phẩm</h3>
                <div className="no-feedback">Chưa có đánh giá nào cho sản phẩm này.</div>
            </div>
        );
    }

    return (
        <div className="feedback-list">
            <div className="feedback-summary">
                <h3>Đánh giá sản phẩm</h3>
                <div className="rating-summary">
                    <div className="average-rating">
                        <span className="rating-number">{calculateAverageRating()}</span>
                        <div className="stars">
                            {renderStars(Math.round(calculateAverageRating()))}
                        </div>
                        <span className="total-reviews">({productFeedbacks.length} đánh giá)</span>
                    </div>
                </div>
            </div>

            <div className="feedback-items">
                {productFeedbacks.map((feedback) => (
                    <div key={feedback.id} className="feedback-item">
                        <div className="feedback-header">
                            <div className="user-info">
                                <span className="username">{feedback.userName || 'Người dùng'}</span>
                                <div className="rating">
                                    {renderStars(feedback.rating)}
                                </div>
                            </div>
                            <div className="feedback-date">
                                {formatDate(feedback.createAt)}
                            </div>
                        </div>
                        <div className="feedback-comment">
                            {feedback.comment}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default FeedbackList;
