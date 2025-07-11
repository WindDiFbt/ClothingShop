import { useParams, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import ProductForm from "../../components/product/ProductForm";
import { useEffect, useState } from "react";
import { fetchProductById, updateProduct } from "../../redux/slices/ProductSlice";
import { ArrowLeft, User, Phone, MapPin } from "lucide-react";
export default function EditProductPage() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [initialData, setInitialData] = useState(null);

  useEffect(() => {
  dispatch(fetchProductById(id)).then((res) => {
    if (res.payload?.productDto) {
      const dto = res.payload.productDto;

      setInitialData({
        Id: dto.id,
        Name: dto.name,
        Price: dto.price,
        Discount: dto.discount,
        ThumbnailUrl: dto.thumbnailUrl,
        Description: dto.description,
        CategoryId: dto.categoryId,
        Variants: dto.productVariants?.map(v => ({
          Size: v.size,
          Quantity: v.quantity
        })) || [{ Size: "", Quantity: "" }],
        Images: dto.images || [""],
      });
    } else {
      console.error("Invalid response from backend:", res.payload);
    }
  });
}, [dispatch, id]);


  const handleSubmit = async (formData) => {
    await dispatch(updateProduct({ id, data: formData }));
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
      <h1 className="text-2xl font-bold text-gray-800 mb-4">Edit Product</h1>
      {initialData ? (
        <ProductForm initialData={initialData} onSubmit={handleSubmit} />
      ) : (
        <p>Loading product data...</p>
      )}
    </div>
  );
}
