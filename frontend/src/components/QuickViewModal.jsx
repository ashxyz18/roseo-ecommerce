'use client';

import React, { useState, useEffect } from 'react';
import { X, Star, ShoppingCart, Heart, Minus, Plus, Truck, Shield, RotateCcw, Share2, Check } from 'lucide-react';
import { useCart } from '../context/CartContext';
import api from '../lib/api';
import toast from 'react-hot-toast';

const UPLOAD_URL = process.env.NEXT_PUBLIC_UPLOAD_URL || 'http://localhost:5000';

const getImageUrl = (img) => {
  if (!img) return '';
  if (img.startsWith('http')) return img;
  return `${UPLOAD_URL}${img}`;
};

const QuickViewModal = ({ productId, isOpen, onClose }) => {
  const { addItem } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState(0);
  const [activeImage, setActiveImage] = useState(0);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);

  useEffect(() => {
    if (productId && isOpen) {
      loadProduct();
      setQuantity(1);
      setSelectedColor(0);
      setActiveImage(0);
      setAddedToCart(false);
    }
  }, [productId, isOpen]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const loadProduct = async () => {
    try {
      setLoading(true);
      const data = await api.getProduct(productId);
      setProduct(data);
    } catch (error) {
      console.error('Failed to load product:', error);
      onClose();
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    if (!product) return;
    addItem(product, quantity);
    setAddedToCart(true);
    toast.success(`${product.name} added to cart`);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  const handleBuyNow = () => {
    if (!product) return;
    addItem(product, quantity);
    onClose();
    window.location.href = '/checkout';
  };

  if (!isOpen) return null;

  const discount = product?.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : product?.discount || 0;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden animate-scale-in">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center text-neutral-400 hover:text-neutral-900 hover:bg-white transition-all duration-200 shadow-sm"
        >
          <X className="w-5 h-5" />
        </button>

        {loading ? (
          <div className="flex items-center justify-center py-32">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-neutral-300 border-t-neutral-900" />
          </div>
        ) : product ? (
          <div className="grid grid-cols-1 md:grid-cols-2 max-h-[90vh] overflow-y-auto">
            {/* Image Section */}
            <div className="bg-neutral-50 p-6">
              <div className="relative aspect-square rounded-xl overflow-hidden mb-4">
                {product.images && product.images.length > 0 ? (
                  <img
                    src={getImageUrl(product.images[activeImage])}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="text-6xl font-bold text-neutral-200">{product.name?.charAt(0) || 'R'}</span>
                  </div>
                )}
                {discount > 0 && (
                  <span className="absolute top-4 left-4 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-md">
                    -{discount}%
                  </span>
                )}
              </div>

              {/* Thumbnails */}
              {product.images && product.images.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-1">
                  {product.images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImage(idx)}
                      className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-colors ${
                        activeImage === idx ? 'border-primary-900' : 'border-neutral-200 hover:border-neutral-400'
                      }`}
                    >
                      <img src={getImageUrl(img)} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Details Section */}
            <div className="p-6 md:p-8 flex flex-col">
              {/* Category badge */}
              <span className="inline-flex self-start px-3 py-1 bg-neutral-100 text-neutral-600 text-xs font-medium rounded-md capitalize mb-3">
                {product.category}
              </span>

              {/* Title */}
              <h2 className="text-2xl font-bold text-neutral-900 mb-3">{product.name}</h2>

              {/* Rating */}
              <div className="flex items-center gap-2 mb-4">
                <div className="flex items-center gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < Math.floor(product.rating || 0) ? 'text-amber-400 fill-amber-400' : 'text-neutral-200'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm text-neutral-500">
                  {product.rating?.toFixed(1) || '0.0'} ({product.reviewCount || 0} reviews)
                </span>
              </div>

              {/* Price */}
              <div className="flex items-end gap-3 mb-4">
                <span className="text-3xl font-bold text-neutral-900">${product.price?.toFixed(2)}</span>
                {product.originalPrice && product.originalPrice > product.price && (
                  <>
                    <span className="text-base text-neutral-400 line-through">${product.originalPrice.toFixed(2)}</span>
                    <span className="text-xs font-semibold text-red-500 bg-red-50 px-2 py-0.5 rounded">
                      Save ${(product.originalPrice - product.price).toFixed(2)}
                    </span>
                  </>
                )}
              </div>

              {/* Description */}
              <p className="text-sm text-neutral-500 leading-relaxed mb-4 line-clamp-3">
                {product.shortDescription || product.description || 'Premium quality leather product crafted with care.'}
              </p>

              {/* Material */}
              {product.material && (
                <div className="text-sm text-neutral-500 mb-4">
                  <span className="font-medium text-neutral-800">Material:</span> {product.material}
                </div>
              )}

              {/* Colors */}
              {product.colors && product.colors.length > 0 && (
                <div className="mb-4">
                  <span className="block text-sm font-medium text-neutral-800 mb-2">
                    Color: {typeof product.colors[selectedColor] === 'object' ? product.colors[selectedColor].name : product.colors[selectedColor]}
                  </span>
                  <div className="flex gap-2">
                    {product.colors.map((color, idx) => {
                      const colorHex = typeof color === 'object' ? color.hex : null;
                      const colorName = typeof color === 'object' ? color.name : color;
                      return (
                        <button
                          key={idx}
                          onClick={() => setSelectedColor(idx)}
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium border transition-colors ${
                            selectedColor === idx
                              ? 'border-primary-900 bg-primary-900 text-white'
                              : 'border-neutral-200 text-neutral-600 hover:border-neutral-400'
                          }`}
                        >
                          {colorHex && (
                            <span
                              className={`w-2.5 h-2.5 rounded-full ${selectedColor === idx ? 'border-white/50' : 'border-neutral-300'}`}
                              style={{ backgroundColor: colorHex }}
                            />
                          )}
                          {colorName}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Stock */}
              <div className="flex items-center gap-2 mb-5">
                {product.stock > 0 ? (
                  <>
                    <Check className="w-4 h-4 text-green-600" />
                    <span className="text-sm text-green-600 font-medium">In Stock</span>
                    {product.stock <= 5 && (
                      <span className="text-xs text-amber-600 font-medium">(Only {product.stock} left!)</span>
                    )}
                  </>
                ) : (
                  <span className="text-sm text-red-500 font-medium">Out of Stock</span>
                )}
              </div>

              {/* Quantity & Actions */}
              <div className="flex items-center gap-3 mb-5">
                <div className="flex items-center border border-neutral-200 rounded-lg">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-2.5 hover:bg-neutral-50 transition-colors rounded-l-lg"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="px-4 py-2 text-center min-w-[40px] font-medium text-sm">{quantity}</span>
                  <button
                    onClick={() => setQuantity(Math.min(product.stock || 99, quantity + 1))}
                    className="p-2.5 hover:bg-neutral-50 transition-colors rounded-r-lg"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                <button
                  onClick={handleAddToCart}
                  disabled={product.stock === 0}
                  className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-semibold text-sm transition-all duration-300 ${
                    addedToCart
                      ? 'bg-success-500 text-white'
                      : 'bg-neutral-900 text-white hover:bg-primary-900 disabled:bg-neutral-300 disabled:cursor-not-allowed'
                  }`}
                >
                  {addedToCart ? (
                    <>
                      <Check className="w-4 h-4" />
                      Added!
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="w-4 h-4" />
                      Add to Cart
                    </>
                  )}
                </button>

                <button
                  onClick={() => setIsWishlisted(!isWishlisted)}
                  className={`p-3 rounded-lg border transition-all duration-300 ${
                    isWishlisted
                      ? 'border-red-200 bg-red-50 text-red-500'
                      : 'border-neutral-200 text-neutral-400 hover:text-red-500 hover:border-red-200'
                  }`}
                >
                  <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-red-500' : ''}`} />
                </button>
              </div>

              <button
                onClick={handleBuyNow}
                disabled={product.stock === 0}
                className="w-full py-3 bg-primary-900 text-white rounded-lg font-semibold text-sm hover:bg-primary-800 disabled:bg-neutral-300 disabled:cursor-not-allowed transition-all duration-300 mb-5"
              >
                Buy Now
              </button>

              {/* Features */}
              <div className="grid grid-cols-3 gap-3 pt-5 border-t border-neutral-200 mt-auto">
                <div className="flex flex-col items-center gap-1.5 p-2 bg-neutral-50 rounded-lg">
                  <Truck className="w-4 h-4 text-neutral-400" />
                  <span className="text-[10px] font-medium text-neutral-600 text-center">Free Shipping</span>
                </div>
                <div className="flex flex-col items-center gap-1.5 p-2 bg-neutral-50 rounded-lg">
                  <Shield className="w-4 h-4 text-neutral-400" />
                  <span className="text-[10px] font-medium text-neutral-600 text-center">2-Year Warranty</span>
                </div>
                <div className="flex flex-col items-center gap-1.5 p-2 bg-neutral-50 rounded-lg">
                  <RotateCcw className="w-4 h-4 text-neutral-400" />
                  <span className="text-[10px] font-medium text-neutral-600 text-center">30-Day Returns</span>
                </div>
              </div>

              {/* View full details link */}
              <button
                onClick={() => {
                  onClose();
                  window.location.href = `/products/${product._id}`;
                }}
                className="mt-4 text-sm text-primary-900 font-medium hover:underline text-center"
              >
                View Full Details →
              </button>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default QuickViewModal;
