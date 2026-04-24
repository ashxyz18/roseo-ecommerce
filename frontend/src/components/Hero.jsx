'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { ArrowRight, Shield, Truck, RotateCcw, ImageIcon, Loader2, ChevronDown } from 'lucide-react';
import api from '../lib/api';

const UPLOAD_URL = process.env.NEXT_PUBLIC_UPLOAD_URL || 'http://localhost:5000';

const Hero = () => {
  const [heroBanner, setHeroBanner] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isVisible, setIsVisible] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const heroRef = useRef(null);

  useEffect(() => {
    // Trigger entrance animation after mount
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const loadHeroBanner = async () => {
      try {
        const banners = await api.getBanners({ position: 'hero', isActive: 'true' });
        if (banners && banners.length > 0) {
          setHeroBanner(banners[0]);
        }
      } catch (error) {
        console.error('Failed to load hero banner:', error);
      } finally {
        setLoading(false);
      }
    };
    loadHeroBanner();
  }, []);

  // Subtle parallax on mouse move
  const handleMouseMove = (e) => {
    if (!heroRef.current) return;
    const rect = heroRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setMousePos({ x, y });
  };

  const getImageUrl = (img) => {
    if (!img) return '';
    if (img.startsWith('http')) return img;
    return `${UPLOAD_URL}${img}`;
  };

  const handleStartShopping = () => {
    const section = document.getElementById('product-section');
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleScrollDown = () => {
    const section = document.getElementById('product-section');
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const features = [
    { icon: <Shield className="w-4 h-4" />, text: '2-Year Warranty' },
    { icon: <Truck className="w-4 h-4" />, text: 'Free Shipping' },
    { icon: <RotateCcw className="w-4 h-4" />, text: '30-Day Returns' },
  ];

  const heroTitle = heroBanner?.title || 'Crafted for';
  const heroSubtitle = heroBanner?.subtitle || 'Timeless Elegance';
  const heroDescription = heroBanner?.description || 'Discover our premium leather collection where craftsmanship meets contemporary design. Each piece is meticulously crafted using sustainable materials.';

  return (
    <section
      ref={heroRef}
      onMouseMove={handleMouseMove}
      className="relative overflow-hidden bg-neutral-50"
    >
      {/* Animated background decoration with parallax */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute -top-40 -right-40 w-80 h-80 bg-primary-100/40 rounded-full blur-3xl animate-float"
          style={{
            transform: `translate(${mousePos.x * 20}px, ${mousePos.y * 20}px)`,
            transition: 'transform 0.3s ease-out',
          }}
        />
        <div
          className="absolute -bottom-40 -left-40 w-96 h-96 bg-primary-50/60 rounded-full blur-3xl animate-float"
          style={{
            animationDelay: '2s',
            transform: `translate(${mousePos.x * -15}px, ${mousePos.y * -15}px)`,
            transition: 'transform 0.3s ease-out',
          }}
        />
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary-100/20 rounded-full blur-3xl"
          style={{
            transform: `translate(calc(-50% + ${mousePos.x * 10}px), calc(-50% + ${mousePos.y * 10}px))`,
            transition: 'transform 0.5s ease-out',
          }}
        />
      </div>

      <div className="container relative">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center py-16 md:py-24">
          {/* Left Content */}
          <div className={`text-center lg:text-left transition-all duration-1000 ${
            isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'
          }`}>
            <div className={`inline-flex items-center gap-2 px-3 py-1.5 bg-primary-900 text-white rounded-full text-xs font-medium mb-6 tracking-wider uppercase transition-all duration-700 delay-200 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}>
              <span className="w-1.5 h-1.5 bg-success-400 rounded-full animate-pulse" />
              {heroBanner?.buttonText || 'New Collection 2025'}
            </div>

            <h1 className={`font-display text-4xl md:text-5xl lg:text-6xl font-bold text-neutral-900 leading-[1.1] mb-6 transition-all duration-700 delay-300 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
            }`}>
              {heroTitle}
              <span className="block text-gradient-primary">{heroSubtitle}</span>
            </h1>

            <p className={`text-base text-neutral-500 mb-8 max-w-lg mx-auto lg:mx-0 leading-relaxed transition-all duration-700 delay-[400ms] ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
            }`}>
              {heroDescription}
            </p>

            {/* Features */}
            <div className={`flex flex-wrap gap-3 mb-10 justify-center lg:justify-start transition-all duration-700 delay-500 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
            }`}>
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 px-3 py-2 bg-white rounded-lg border border-neutral-200 hover:border-primary-300 hover:shadow-sm hover:bg-primary-50/50 transition-all duration-300 cursor-default group/feature"
                >
                  <div className="text-primary-900 group-hover/feature:scale-110 transition-transform duration-200">{feature.icon}</div>
                  <span className="text-xs font-medium text-neutral-700">{feature.text}</span>
                </div>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className={`flex flex-col sm:flex-row gap-3 justify-center lg:justify-start transition-all duration-700 delay-[600ms] ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
            }`}>
              <button
                onClick={handleStartShopping}
                className="btn-primary group flex items-center justify-center gap-2 hover:shadow-glow-primary"
              >
                Start Shopping
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
              </button>
            </div>

            {/* Stats */}
            <div className={`mt-8 flex items-center gap-8 justify-center lg:justify-start transition-all duration-700 delay-700 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
            }`}>
              {[
                { value: '500+', label: 'Happy Customers' },
                { value: '4.9', label: 'Average Rating' },
                { value: '24h', label: 'Delivery Time' },
              ].map((stat, i) => (
                <React.Fragment key={i}>
                  {i > 0 && <div className="w-px h-10 bg-neutral-200" />}
                  <div className="group cursor-default">
                    <div className="text-2xl font-bold text-neutral-900 group-hover:text-primary-900 transition-colors duration-300">{stat.value}</div>
                    <div className="text-xs text-neutral-500 font-medium">{stat.label}</div>
                  </div>
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* Right - Hero Image */}
          <div className={`relative transition-all duration-1000 delay-300 ${
            isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'
          }`}>
            <div
              className="relative rounded-2xl overflow-hidden shadow-xl border border-neutral-200 group"
              style={{
                transform: `translate(${mousePos.x * -8}px, ${mousePos.y * -8}px)`,
                transition: 'transform 0.3s ease-out',
              }}
            >
              {loading ? (
                <div className="aspect-square bg-gradient-to-br from-primary-900 via-primary-800 to-primary-950 flex items-center justify-center">
                  <Loader2 className="w-8 h-8 text-white/60 animate-spin" />
                </div>
              ) : heroBanner?.image ? (
                <Image
                  src={getImageUrl(heroBanner.image)}
                  alt={heroBanner.title || 'ROSEO Premium Leather Collection'}
                  width={700}
                  height={700}
                  className="w-full h-auto aspect-square object-cover transform group-hover:scale-105 transition-transform duration-700"
                  priority
                />
              ) : (
                /* Placeholder shown when no hero banner is configured in admin */
                <div className="aspect-square bg-gradient-to-br from-primary-900 via-primary-800 to-primary-950 flex items-center justify-center">
                  <div className="text-center p-8">
                    <div className="w-24 h-24 mx-auto bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center mb-6 border border-white/20 animate-float">
                      <ImageIcon className="w-10 h-10 text-white/60" />
                    </div>
                    <h3 className="text-white font-display text-2xl font-bold mb-2">ROSEO Collection</h3>
                    <p className="text-white/60 text-sm mb-6">Premium Leather Goods</p>
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20 text-white/80 text-xs">
                      <ImageIcon className="w-3.5 h-3.5" />
                      Add a hero banner in Admin Panel
                    </div>
                  </div>
                </div>
              )}

              {/* Price badge */}
              <div className="absolute top-6 right-6 bg-primary-900 text-white px-4 py-2 rounded-lg shadow-lg transform group-hover:scale-105 transition-all duration-300">
                <div className="font-bold text-lg">$249</div>
                <div className="text-[10px] text-white/60 uppercase tracking-wider">Limited Offer</div>
              </div>

              {/* Stock badge */}
              <div className="absolute bottom-6 left-6 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-lg border border-neutral-200 flex items-center gap-2 shadow-sm">
                <div className="w-2 h-2 bg-success-500 rounded-full animate-pulse"></div>
                <span className="text-xs font-medium text-neutral-700">In Stock</span>
              </div>
            </div>

            {/* Floating card - bottom left */}
            <div
              className="absolute -bottom-4 -left-4 w-32 bg-white rounded-xl shadow-lg p-3 border border-neutral-100 hidden lg:block hover:shadow-xl hover:-translate-y-2 transition-all duration-300 cursor-default animate-float"
              style={{ animationDelay: '1s' }}
            >
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-primary-50 rounded-lg flex items-center justify-center">
                  <span className="text-primary-900 font-bold text-sm">MW</span>
                </div>
                <div>
                  <div className="font-bold text-neutral-900 text-xs">Mini Wallet</div>
                  <div className="text-[10px] text-neutral-500 font-medium">From $89</div>
                </div>
              </div>
            </div>

            {/* Floating card - top right */}
            <div
              className="absolute -top-4 -right-4 w-36 bg-white rounded-xl shadow-lg p-4 border border-neutral-100 hidden lg:block hover:shadow-xl hover:-translate-y-2 transition-all duration-300 cursor-default animate-float"
              style={{ animationDelay: '2s' }}
            >
              <div className="text-center">
                <div className="w-12 h-12 mx-auto bg-primary-900 rounded-full flex items-center justify-center mb-2">
                  <span className="text-white font-bold text-sm">4.9</span>
                </div>
                <div className="font-bold text-neutral-900 text-sm">Top Rated</div>
                <div className="text-[10px] text-neutral-500 font-medium">Customer Rating</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div
        className={`absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 cursor-pointer transition-all duration-700 delay-1000 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`}
        onClick={handleScrollDown}
      >
        <span className="text-[10px] text-neutral-400 uppercase tracking-widest font-medium">Scroll</span>
        <ChevronDown className="w-4 h-4 text-neutral-400 animate-bounce" />
      </div>
    </section>
  );
};

export default Hero;
