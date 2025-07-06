import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addFeedbackThunk, clearError, clearSuccess } from '../redux/slices/feedbackSlice';
import '../styles/feedback.css';

const FeedbackForm = ({ productId, orderId, onSuccess }) => {
    const dispatch = useDispatch();
    const { loading, error, success } = useSelector(state => state.feedback);

    const [formData, setFormData] = useState({
        rating: 5,
        comment: ''
    });

    const [hover, setHover] = useState(0);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.comment.trim()) {
            alert('Vui lòng nhập bình luận!');
            return;
        }

        const feedbackData = {
            productId: productId,
            orderId: orderId,
            rating: formData.rating,
            comment: formData.comment.trim()
        };

        try {
            await dispatch(addFeedbackThunk(feedbackData)).unwrap();
            setFormData({ rating: 5, comment: '' });
            setHover(0);

            if (onSuccess) {
                onSuccess();
            }
        } catch (err) {
            console.error('Error submitting feedback:', err);
        }
    };

    const handleRatingClick = (ratingValue) => {
        setFormData(prev => ({ ...prev, rating: ratingValue }));
    };

    React.useEffect(() => {
        if (success) {
            setTimeout(() => {
                dispatch(clearSuccess());
            }, 3000);
        }
    }, [success, dispatch]);

    React.useEffect(() => {
        if (error) {
            setTimeout(() => {
                dispatch(clearError());
            }, 5000);
        }
    }, [error, dispatch]);

    return (
        <div className="feedback-form">
            <h3>Đánh giá sản phẩm</h3>

            {error && (
                <div className="error-message">
                    {error}
                </div>
            )}

            {success && (
                <div className="success-message">
                    Gửi đánh giá thành công!
                </div>
            )}

            <form onSubmit={handleSubmit}>
                <div className="rating-section">
                    <label>Đánh giá:</label>
                    <div className="star-rating">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <button
                                key={star}
                                type="button"
                                className={`star ${star <= (hover || formData.rating) ? 'active' : ''}`}
                                onClick={() => handleRatingClick(star)}
                                onMouseEnter={() => setHover(star)}
                                onMouseLeave={() => setHover(0)}
                            >
                                ★
                            </button>
                        ))}
                    </div>
                    <span className="rating-text">
                        {formData.rating === 1 && 'Rất tệ'}
                        {formData.rating === 2 && 'Tệ'}
                        {formData.rating === 3 && 'Bình thường'}
                        {formData.rating === 4 && 'Tốt'}
                        {formData.rating === 5 && 'Rất tốt'}
                    </span>
                </div>

                <div className="comment-section">
                    <label htmlFor="comment">Bình luận:</label>
                    <textarea
                        id="comment"
                        value={formData.comment}
                        onChange={(e) => setFormData(prev => ({ ...prev, comment: e.target.value }))}
                        placeholder="Chia sẻ trải nghiệm của bạn về sản phẩm..."
                        rows="4"
                        required
                    />
                </div>

                <button
                    type="submit"
                    className="submit-btn"
                    disabled={loading}
                >
                    {loading ? 'Đang gửi...' : 'Gửi đánh giá'}
                </button>
            </form>
        </div>
    );
};

export default FeedbackForm;
