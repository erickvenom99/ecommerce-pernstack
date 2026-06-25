"use client";

import { PlusIcon, SquarePenIcon, XIcon } from 'lucide-react';
import React, { useState } from 'react';
import AddressModal from './AddressModal';
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { Show, useAuth, useUser } from '@clerk/nextjs';
import axios from 'axios';
import { fetchCart, clearCart } from '@/lib/features/cart/cartSlice';

const OrderSummary = ({ totalPrice, items }) => {
    const { user } = useUser();
    const { getToken } = useAuth();
    const dispatch = useDispatch();
    const router = useRouter();

    const currency = process.env.NEXT_PUBLIC_CURRENCY_SYMBOL || '₦';
    const addressList = useSelector(state => state.address.list);

    const [paymentMethod, setPaymentMethod] = useState('COD');
    const [selectedAddress, setSelectedAddress] = useState(null);
    const [showAddressModal, setShowAddressModal] = useState(false);
    const [couponCodeInput, setCouponCodeInput] = useState('');
    const [coupon, setCoupon] = useState('');
    const [loading, setLoading] = useState(false);

    const handleCouponCode = async (event) => {
        event.preventDefault();
        try {
            if (!user) return toast.error('Please login to apply coupon');
            const token = await getToken();
            const { data } = await axios.post('/api/coupon', { code: couponCodeInput }, { 
                headers: { Authorization: `Bearer ${token}` }
            });
            setCoupon(data.coupon);
            toast.success('Coupon applied successfully');
        } catch (error) {
            toast.error(error?.response?.data?.error || error.message);
        }
    };

    const handlePlaceOrder = async (e) => {
        e.preventDefault();
        try {
            if (!user) return toast.error('Please login to place order');
            if (!selectedAddress) return toast.error('Please select an address to place order');
            
            setLoading(true);
            const token = await getToken();
            const orderData = {
                addressId: selectedAddress.id,
                paymentMethod,
                items,
                ...(coupon && { couponCode: coupon.code })
            };
            
            const res = await axios.post('/api/orders', orderData, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (paymentMethod === 'PAYSTACK') {
                const session = res.data.paystackSession;
                if (!session || !session.access_code) {
                    throw new Error('Failed to provision secure Paystack authorization codes');
                }
                
                // 🚀 DYNAMIC IMPORT OF THE NEW OFFICIAL PAYSTACK SDK
                // This keeps it running cleanly purely on the client browser environment
                const { default: PaystackPop } = await import('@paystack/inline-js');
                const popup = new PaystackPop();

                // Fire the transaction open using the server-generated access code
                popup.resumeTransaction(session.access_code, {
                    onSuccess: (transaction) => {
                        toast.success('Payment completed successfully!');
                        dispatch(clearCart());
                        dispatch(fetchCart({ getToken }));
                        setLoading(false);
                        router.push('/orders');
                    },
                    onCancel: () => {
                        toast.error("Transaction window closed. Items are safely saved in your cart.");
                        setLoading(false);
                    },
                    onError: (error) => {
                        toast.error(`Paystack Error: ${error.message}`);
                        setLoading(false);
                    }
                });

            } else {
                toast.success(res.data.message);
                dispatch(clearCart());
                dispatch(fetchCart({ getToken }));
                setLoading(false);
                router.push('/orders');
            } 
        } catch (error) {
            setLoading(false);
            toast.error(error?.response?.data?.error || error.message);
        }
    };

    return (
        <div className='w-full max-w-lg lg:max-w-[340px] bg-slate-50/30 border border-slate-200 text-slate-500 text-sm rounded-xl p-7'>
            <h2 className='text-xl font-medium text-slate-600'>Payment Summary</h2>
            <p className='text-slate-400 text-xs my-4'>Payment Method</p>
            
            <div className='flex gap-2 items-center'>
                <input type="radio" id="COD" onChange={() => setPaymentMethod('COD')} checked={paymentMethod === 'COD'} disabled={loading} className='accent-gray-500' />
                <label htmlFor="COD" className='cursor-pointer'>COD</label>
            </div>
            
            <div className='flex gap-2 items-center mt-1'>
                <input type="radio" id="PAYSTACK" name='payment' onChange={() => setPaymentMethod('PAYSTACK')} checked={paymentMethod === 'PAYSTACK'} disabled={loading} className='accent-gray-500' />
                <label htmlFor="PAYSTACK" className='cursor-pointer'>Pay with Paystack</label>
            </div>
            
            <div className='my-4 py-4 border-y border-slate-200 text-slate-400'>
                <p>Address</p>
                {selectedAddress ? (
                    <div className='flex gap-2 items-center'>
                        <p>{selectedAddress.name}, {selectedAddress.city}, {selectedAddress.state}, {selectedAddress.zip}</p>
                        <SquarePenIcon onClick={() => !loading && setSelectedAddress(null)} className={`cursor-pointer ${loading ? 'opacity-30 pointer-events-none' : ''}`} size={18} />
                    </div>
                ) : (
                    <div>
                        {addressList.length > 0 && (
                            <select disabled={loading} className='border border-slate-400 p-2 w-full my-3 outline-none rounded bg-white' onChange={(e) => setSelectedAddress(addressList[e.target.value])} >
                                <option value="">Select Address</option>
                                {addressList.map((address, index) => (
                                    <option key={index} value={index}>{address.name}, {address.city}, {address.state}, {address.zip}</option>
                                ))}
                            </select>
                        )}
                        <button disabled={loading} className='flex items-center gap-1 text-slate-600 mt-1 disabled:opacity-40' onClick={() => setShowAddressModal(true)} >Add Address <PlusIcon size={18} /></button>
                    </div>
                )}
            </div>
            
            <div className='pb-4 border-b border-slate-200'>
                <div className='flex justify-between'>
                    <div className='flex flex-col gap-1 text-slate-400'>
                        <p>Subtotal:</p>
                        <p>Shipping:</p>
                        {coupon && <p>Coupon:</p>}
                    </div>
                    <div className='flex flex-col gap-1 font-medium text-right'>
                        <p>{currency}{totalPrice.toLocaleString()}</p>
                        <div><Show when={{plan:'plus'}} fallback={`${currency}5`}>Free</Show></div>
                        {coupon && <p>{`-${currency}${(coupon.discount / 100 * totalPrice).toFixed(2)}`}</p>}
                    </div>
                </div>
                {!coupon ? (
                    <form onSubmit={e => toast.promise(handleCouponCode(e), { loading: 'Checking Coupon...' })} className='flex justify-center gap-3 mt-3'>
                        <input disabled={loading} onChange={(e) => setCouponCodeInput(e.target.value)} value={couponCodeInput} type="text" placeholder='Coupon Code' className='border border-slate-400 p-1.5 rounded w-full outline-none bg-white' />
                        <button disabled={loading} className='bg-slate-600 text-white px-3 rounded hover:bg-slate-800 active:scale-95 transition-all disabled:opacity-40'>Apply</button>
                    </form>
                ) : (
                    <div className='w-full flex items-center justify-center gap-2 text-xs mt-2'>
                        <p>Code: <span className='font-semibold ml-1'>{coupon.code.toUpperCase()}</span></p>
                        <p>{coupon.description}</p>
                        <XIcon size={18} onClick={() => !loading && setCoupon('')} className={`hover:text-red-700 transition cursor-pointer ${loading ? 'opacity-30 pointer-events-none' : ''}`} />
                    </div>
                )}
            </div>
            
            <div className='flex justify-between py-4'>
                <p>Total:</p>
                <p className='font-medium text-right'>
                    <Show when={{plan: 'plus'}} fallback={`${currency}${coupon ? (totalPrice + 5 - (coupon.discount / 100 * totalPrice)).toFixed(2) : (totalPrice + 5).toLocaleString()}`}>
                        {currency}{coupon ? (totalPrice - (coupon.discount / 100 * totalPrice)).toFixed(2) : totalPrice.toLocaleString()}
                    </Show> 
                </p>
            </div>
            
            <button 
                onClick={e => {
                    if (!loading) {
                        toast.promise(handlePlaceOrder(e), {
                            loading: paymentMethod === 'PAYSTACK' ? 'Verifying inventory levels...' : 'Placing Order...',
                            success: paymentMethod === 'PAYSTACK' ? 'Redirecting to payment operator...' : 'Order Placed!',
                            error: 'Failed to process order'
                        });
                    }
                }} 
                disabled={loading || items.length === 0}
                className={`w-full text-white py-2.5 rounded active:scale-95 transition-all disabled:opacity-50 font-medium cursor-pointer ${
                    paymentMethod === 'PAYSTACK' && !loading ? 'bg-teal-600 hover:bg-teal-700' : 'bg-slate-700 hover:bg-slate-900'
                }`}
            >
                {loading ? "Processing Secure Channels..." : paymentMethod === 'PAYSTACK' ? "Pay with Paystack" : "Place Order"}
            </button>
        </div>
    );
};

export default OrderSummary;