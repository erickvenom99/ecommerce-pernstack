'use client'

import { addToCart, uploadCart } from "@/lib/features/cart/cartSlice";
import { StarIcon, TagIcon, EarthIcon, CreditCardIcon, UserIcon, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Image from "next/image";
import Counter from "./Counter";
import { useDispatch, useSelector } from "react-redux";
import { useAuth } from "@clerk/nextjs";
import { toast } from "react-hot-toast";

const ProductDetails = ({ product }) => {

    const productId = product.id;
    const currency = process.env.NEXT_PUBLIC_CURRENCY_SYMBOL || '$';

    const cart = useSelector(state => state.cart.cartItems);
    const dispatch = useDispatch();
    const { getToken } = useAuth();

    const router = useRouter();

    const [mainImage, setMainImage] = useState(product.images[0]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    
    // 🟢 1. Track selected size
    const [selectedSize, setSelectedSize] = useState(
        product.sizes && product.sizes.length > 0 ? product.sizes[0] : ""
    );

    const formatPrice = (price) => {
        return price !== undefined && price !== null ? Number(price).toLocaleString('en-US') : '0';
    }

    // 🟢 2. Build unique key (e.g., "prod_123_M" or "prod_123" if no sizes exist)
    const cartKey = selectedSize ? `${productId}_${selectedSize}` : productId;

    // 🟢 3. Check if this specific product/size combination is in cart
    // Supports both composite keys cart["prod123_M"] or simple cart[productId]
    const isInCart = Boolean(cart[cartKey] || cart[productId]);

    const addToCartHandler = async () => {
        if (product.sizes && product.sizes.length > 0 && !selectedSize) {
            return toast.error("Please select a size first");
        }

        // 🟢 4. Dispatch with size included
        dispatch(addToCart({ productId, size: selectedSize }))
        try {
            const token = await getToken();
            dispatch(uploadCart({ token }))
        } catch (error) {
            console.error("Failed to sync cart item with database:", error);
        }
    }

    const averageRating = product.rating?.length > 0 
        ? product.rating.reduce((acc, item) => acc + item.rating, 0) / product.rating.length 
        : 0;
    
    return (
        <div className="flex max-lg:flex-col gap-12">
            <div className="flex max-sm:flex-col-reverse gap-3">
                <div className="flex sm:flex-col gap-3">
                    {product.images.map((image, index) => (
                        <div key={index} onClick={() => setMainImage(product.images[index])} className="bg-slate-100 flex items-center justify-center size-26 rounded-lg group cursor-pointer">
                            <Image src={image} className="group-hover:scale-103 group-active:scale-95 transition" alt="" width={45} height={45} />
                        </div>
                    ))}
                </div>
                
                <div 
                    onClick={() => setIsModalOpen(true)} 
                    className="flex justify-center items-center h-100 sm:size-113 bg-slate-100 rounded-lg cursor-pointer hover:opacity-95 transition"
                >
                    <Image src={mainImage} alt={product.name} width={250} height={250} className="object-contain" />
                </div>
            </div>

            <div className="flex-1">
                <h1 className="text-3xl font-semibold text-amber-500">{product.name}</h1>
                
                <div className='flex items-center mt-2'>
                    {Array(5).fill('').map((_, index) => (
                        <StarIcon key={index} size={14} className='text-transparent mt-0.5' fill={averageRating >= index + 1 ? "#00C950" : "#D1D5DB"} />
                    ))}
                    <p className="text-sm ml-3 text-slate-500">{product.rating?.length || 0} Reviews</p>
                </div>

                <div className="flex items-start my-6 gap-3 text-2xl font-semibold text-amber-500">
                    <p> {currency}{formatPrice(product.price)} </p>
                    <p className="text-xl text-slate-500 line-through">{currency}{formatPrice(product.mrp)}</p>
                </div>

                <div className="flex items-center gap-2 text-slate-500">
                    <TagIcon size={14} />
                    <p>Save {((product.mrp - product.price) / product.mrp * 100).toFixed(0)}% right now</p>
                </div>

                {/* 🟢 5. Size Selection UI */}
                {product.sizes && product.sizes.length > 0 && (
                    <div className="my-6">
                        <p className="text-sm font-semibold text-slate-700 mb-2">Select Size:</p>
                        <div className="flex flex-wrap gap-2">
                            {product.sizes.map((size) => (
                                <button
                                    key={size}
                                    onClick={() => setSelectedSize(size)}
                                    className={`px-4 py-2 text-sm border rounded transition ${
                                        selectedSize === size
                                            ? 'bg-amber-500 text-white border-amber-500 font-semibold'
                                            : 'bg-slate-50 text-slate-600 border-slate-200 hover:border-amber-400'
                                    }`}
                                >
                                    {size}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                <div className="flex items-end gap-5 mt-10">
                    {/* 🟢 6. Conditionally render Counter using isInCart */}
                    {isInCart && (
                        <div className="flex flex-col gap-3">
                            <p className="text-lg text-amber-500 font-semibold">Quantity</p>
                            <Counter productId={productId} size={selectedSize} />
                        </div>
                    )}

                    <button 
                        onClick={() => !isInCart ? addToCartHandler() : router.push('/cart')} 
                        className="bg-amber-500 text-white px-10 py-3 text-sm font-medium rounded hover:bg-amber-600 active:scale-95 transition"
                    >
                        {!isInCart ? 'Add to Cart' : 'View Cart'}
                    </button>
                </div>

                <hr className="border-gray-300 my-5" />

                <div className="flex flex-col gap-4 text-slate-500">
                    <p className="flex gap-3"> <EarthIcon className="text-slate-400" /> Free shipping worldwide </p>
                    <p className="flex gap-3"> <CreditCardIcon className="text-slate-400" /> 100% Secured Payment </p>
                    <p className="flex gap-3"> <UserIcon className="text-slate-400" /> Trusted by top brands </p>
                </div>
            </div>

            {/* Full-screen Image Modal */}
            {isModalOpen && (
                <div 
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
                    onClick={() => setIsModalOpen(false)}
                >
                    <div 
                        className="relative max-w-4xl max-h-[90vh] w-full h-full flex items-center justify-center"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button 
                            onClick={() => setIsModalOpen(false)}
                            className="absolute top-2 right-2 p-2 bg-black/50 text-white rounded-full hover:bg-black/75 transition z-10"
                            aria-label="Close modal"
                        >
                            <X size={24} />
                        </button>
                        <div className="relative w-full h-full max-h-[85vh]">
                            <Image 
                                src={mainImage} 
                                alt={product.name} 
                                fill 
                                className="object-contain"
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default ProductDetails;