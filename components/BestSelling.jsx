'use client'
import React from 'react'
import Title from './Title'
import ProductCard from './ProductCard'
import { useSelector } from 'react-redux'

const BestSelling = () => {

    const displayQuantity = 8
    const products = useSelector(state => state.product.list)

    return (
        <div className='px-6 my-30 max-w-6xl mx-auto'>
            <Title 
                title='Best Selling' 
                description={`Showing ${products.length < displayQuantity ? products.length : displayQuantity} of ${products.length} products`} 
                href='/shop' 
            />
            {/* Same grid layout and properties as LatestProducts.jsx for exact visual consistency */}
            <div className='mt-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6'>
                {products
                    .slice()
                    .sort((a, b) => (b.rating?.length || 0) - (a.rating?.length || 0))
                    .slice(0, displayQuantity)
                    .map((product, index) => (
                        <ProductCard key={product._id || index} product={product} />
                    ))}
            </div>
        </div>
    )
}

export default BestSelling