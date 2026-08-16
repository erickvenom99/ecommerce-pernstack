'use client'
import { assets } from "@/assets/assets"
import { useAuth } from "@clerk/nextjs"
import axios from "axios"
import Image from "next/image"
import { useState } from "react"
import { toast } from "react-hot-toast"

export default function StoreAddProduct() {

    const categories = ['Snickers', 'Clothing', 'Hair', 'Bags', 'Perfume', 'Men', 'Women', 'kids']

    // 🟢 Predefined size lists for different category types
    const clothingSizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL']
    const shoeSizes = ['38', '39', '40', '41', '42', '43', '44', '45', '46']

    const [images, setImages] = useState({ 1: null, 2: null, 3: null, 4: null })
    const [productInfo, setProductInfo] = useState({
        name: "",
        description: "",
        mrp: 0,
        price: 0,
        category: "",
    })

    // 🟢 State to hold selected sizes for the product
    const [selectedSizes, setSelectedSizes] = useState([])

    const [loading, setLoading] = useState(false)
    const [aiUsed, setAiUsed] = useState(false)
    const { getToken } = useAuth()

    const onChangeHandler = (e) => {
        setProductInfo({ ...productInfo, [e.target.name]: e.target.value })
    }

    // 🟢 Toggle size selection
    const handleSizeToggle = (size) => {
        if (selectedSizes.includes(size)) {
            setSelectedSizes(selectedSizes.filter(s => s !== size))
        } else {
            setSelectedSizes([...selectedSizes, size])
        }
    }

    // 🟢 When category changes, reset selected sizes
    const handleCategoryChange = (e) => {
        const category = e.target.value
        setProductInfo({ ...productInfo, category })
        setSelectedSizes([]) // Reset selected sizes when switching category
    }

    const handleImageUpload = async (key, file) => {
        if (!file) return;
        setImages(prev => ({
            ...prev, [key]: file
        }))
        if (key === "1" && !aiUsed) {
            const formData = new FormData()
            formData.append('image', file)

            try {
                const token = await getToken()
                await toast.promise(
                    axios.post('/api/store/ai', formData, {
                        headers: {
                            'Content-Type': 'multipart/form-data',
                            Authorization: `Bearer ${token}`
                        }
                    }),
                    {
                        loading: 'AI is analysing your primary image....',
                        success: (res) => {
                            const data = res.data
                            if (data.name && data.description) {
                                setProductInfo(prev => ({
                                    ...prev,
                                    name: data.name,
                                    description: data.description
                                }))
                                setAiUsed(true)
                                return 'AI product details populated successfully'
                            }
                            return 'Could not extract clear information'
                        },
                        error: (err => err?.response?.data?.error || err.message)
                    }
                )
            } catch (error) {
                console.error('AI generation error', error)
            }
        }
    }

    const onSubmitHandler = async (e) => {
        e.preventDefault()
        try {
            if (!images[1] && !images[2] && !images[3] && !images[4]) {
                return toast.error('Please upload at least one image')
            }

            // Optional check: Warn if vendor selected a clothing/shoe category but picked no sizes
            const needsSizes = ['Snickers', 'Clothing', 'Men', 'Women', 'kids'].includes(productInfo.category)
            if (needsSizes && selectedSizes.length === 0) {
                return toast.error('Please select at least one available size for this product.')
            }

            setLoading(true)
            const formData = new FormData()
            formData.append('name', productInfo.name)
            formData.append('description', productInfo.description)
            formData.append('mrp', productInfo.mrp)
            formData.append('price', productInfo.price)
            formData.append('category', productInfo.category)

            // 🟢 Send sizes array to backend (JSON stringified so multer/form-data can parse it easily)
            formData.append('sizes', JSON.stringify(selectedSizes))

            // Adding images to formData
            Object.keys(images).forEach((key) => {
                images[key] && formData.append('images', images[key])
            })

            const token = await getToken()
            const res = await axios.post('/api/store/product/', formData, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })

            toast.success(res.data.message)

            // Reset form
            setProductInfo({
                name: "",
                description: "",
                mrp: 0,
                price: 0,
                category: "",
            })
            setSelectedSizes([])
            setImages({ 1: null, 2: null, 3: null, 4: null })

        } catch (error) {
            toast.error(error?.response?.data?.error || error.message)
        } finally {
            setLoading(false)
        }
    }

    // Determine which sizes list to show based on category
    const isShoeCategory = productInfo.category === 'Snickers'
    const isClothingCategory = ['Clothing', 'Men', 'Women', 'kids'].includes(productInfo.category)
    const availableSizeOptions = isShoeCategory ? shoeSizes : isClothingCategory ? clothingSizes : []

    return (
        <form onSubmit={e => toast.promise(onSubmitHandler(e), { loading: "Adding Product..." })} className="text-slate-500 mb-28">
            <h1 className="text-2xl text-green-500">Add New <span className="text-amber-500 font-medium">Products</span></h1>
            
            <p className="mt-7">Product Images</p>
            <div className="flex gap-3 mt-4">
                {Object.keys(images).map((key) => (
                    <label key={key} htmlFor={`images${key}`}>
                        <Image width={300} height={300} className='h-15 w-auto border border-slate-200 rounded cursor-pointer object-cover' src={images[key] ? URL.createObjectURL(images[key]) : assets.upload_area} alt="" />
                        <input type="file" 
                            accept='image/*' 
                            id={`images${key}`}
                            onChange={e => handleImageUpload(key, e.target.files[0])} hidden />
                    </label>
                ))}
            </div>

            <label className="flex flex-col gap-2 my-6">
                Name
                <input type="text" name="name" onChange={onChangeHandler} value={productInfo.name} placeholder="Enter product name" className="w-full max-w-sm p-2 px-4 outline-none border border-slate-200 rounded" required />
            </label>

            <label className="flex flex-col gap-2 my-6">
                Description
                <textarea name="description" onChange={onChangeHandler} value={productInfo.description} placeholder="Enter product description" rows={5} className="w-full max-w-sm p-2 px-4 outline-none border border-slate-200 rounded resize-none" required />
            </label>

            <div className="flex gap-5">
                <label className="flex flex-col gap-2">
                    Actual Price (₦)
                    <input type="number" name="mrp" onChange={onChangeHandler} value={productInfo.mrp} placeholder="0" className="w-full max-w-45 p-2 px-4 outline-none border border-slate-200 rounded" required />
                </label>
                <label className="flex flex-col gap-2">
                    Offer Price (₦)
                    <input type="number" name="price" onChange={onChangeHandler} value={productInfo.price} placeholder="0" className="w-full max-w-45 p-2 px-4 outline-none border border-slate-200 rounded" required />
                </label>
            </div>

            <div className="my-6">
                <p className="mb-2">Category</p>
                <select onChange={handleCategoryChange} value={productInfo.category} className="w-full max-w-sm p-2 px-4 outline-none border border-slate-200 rounded" required>
                    <option value="">Select a category</option>
                    {categories.map((category) => (
                        <option key={category} value={category}>{category}</option>
                    ))}
                </select>
            </div>

            {/* 🟢 Render Size Options conditionally */}
            {availableSizeOptions.length > 0 && (
                <div className="my-6 max-w-sm">
                    <p className="text-sm font-medium text-slate-700 mb-2">
                        Select Available Sizes:
                    </p>
                    <div className="flex flex-wrap gap-2">
                        {availableSizeOptions.map((size) => {
                            const isSelected = selectedSizes.includes(size)
                            return (
                                <button
                                    key={size}
                                    type="button"
                                    onClick={() => handleSizeToggle(size)}
                                    className={`px-3 py-1.5 text-sm border rounded transition ${
                                        isSelected
                                            ? 'bg-amber-500 text-white border-amber-500 shadow-sm font-medium'
                                            : 'bg-slate-50 text-slate-600 border-slate-200 hover:border-amber-400'
                                    }`}
                                >
                                    {size}
                                </button>
                            )
                        })}
                    </div>
                </div>
            )}

            <button disabled={loading} className="bg-amber-500 text-white px-6 mt-7 py-2 hover:bg-amber-600 rounded transition font-medium">
                Add Product
            </button>
        </form>
    )
}