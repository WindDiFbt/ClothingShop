import ProductForm from "../../components/product/ProductForm";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { createProduct } from "../../redux/slices/ProductSlice";
import { ArrowLeft, User, Phone, MapPin } from "lucide-react";
export default function AddProductPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (formData) => {
    await dispatch(createProduct(formData));
    navigate("/seller/products");
  };

  return (
    <div className="max-w-4xl mx-auto py-6">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 mb-6 text-blue-600 hover:underline"
      >
        <ArrowLeft size={18} />
        Back
      </button>
      <h1 className="text-2xl font-bold text-gray-800 mb-4">Add New Product</h1>
      <ProductForm onSubmit={handleSubmit} />
    </div>
  );
}
