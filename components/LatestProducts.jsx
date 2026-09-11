'use client'
import React from 'react'
import Title from './Title'
import ProductCard from './ProductCard'
import { useSelector } from 'react-redux'

const LatestProducts = () => {

    const displayQuantity = 8 // Increased to 8 so it fills 2 full rows of 4 items
    const products = useSelector(state => state.product.list)

    return (
        <div className='px-4 sm:px-6 my-16 sm:my-30 max-w-6xl mx-auto'>
            <Title 
                title='Latest Products' 
                description={`Showing ${products.length < displayQuantity ? products.length : displayQuantity} of ${products.length} products`} 
                href='/shop' 
            />
            {/* Updated grid configuration: 2 columns on mobile, scaling up to 4 on desktop */}
            <div className='mt-8 sm:mt-12 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6'>
                {products
                    .slice()
                    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                    .slice(0, displayQuantity)
                    .map((product, index) => (
                        <ProductCard key={product._id || index} product={product} />
                    ))}
            </div>
        </div>
    )
}

export default LatestProducts