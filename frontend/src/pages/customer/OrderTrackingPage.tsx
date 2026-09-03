import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Phone, CheckCircle2, Clock, Bike, MessageSquare } from 'lucide-react';

export const OrderTrackingPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);

  // Simulated live step progression
  useEffect(() => {
    const timer1 = setTimeout(() => setCurrentStep(2), 3500); // Food Prepared
    const timer2 = setTimeout(() => setCurrentStep(3), 8000); // Out for delivery
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  const steps = [
    { title: 'Order Confirmed', desc: 'Restaurant accepted your meal' },
    { title: 'Kitchen Preparing Meal', desc: 'Chef is seasoning your dishes' },
    { title: 'Rider Out for Delivery', desc: 'Ramesh is driving to your doorstep' },
    { title: 'Delivered', desc: 'Enjoy your hot culinary feast!' },
  ];

  return (
    <div className="max-w-md mx-auto bg-gray-50 min-h-screen pb-24">
      {/* Header */}
      <div className="bg-white p-4 sticky top-0 z-20 border-b border-gray-100 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/orders')} className="p-1.5 rounded-full hover:bg-gray-100">
            <ArrowLeft className="w-5 h-5 text-zinc-800" />
          </button>
          <div>
            <h1 className="text-xs font-black text-zinc-900">Live Order Tracking</h1>
            <p className="text-[10px] text-zinc-400">Order ID: #{id || 'ORD492041'}</p>
          </div>
        </div>
        <span className="px-2.5 py-1 bg-emerald-50 text-emerald-600 font-black text-[10px] rounded-full animate-pulse">
          On Time
        </span>
      </div>

      <div className="p-4 space-y-4">
        {/* Estimated Arrival Banner */}
        <div className="bg-gradient-to-r from-zinc-900 to-zinc-800 text-white p-5 rounded-3xl shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-black uppercase tracking-wider text-brand-400">Estimated Delivery</span>
            <span className="flex items-center gap-1 text-xs text-zinc-300">
              <Clock className="w-3.5 h-3.5" /> 18-22 Mins
            </span>
          </div>
          <h2 className="text-2xl font-black tracking-tight">Arriving by 1:15 PM</h2>
          <div className="w-full bg-white/20 h-1.5 rounded-full mt-3 overflow-hidden">
            <div
              className="bg-brand-500 h-full transition-all duration-700"
              style={{ width: currentStep === 1 ? '25%' : currentStep === 2 ? '55%' : currentStep === 3 ? '85%' : '100%' }}
            />
          </div>
        </div>

        {/* Live GPS Route Card */}
        <div className="relative h-48 bg-emerald-100/60 rounded-3xl overflow-hidden border border-emerald-200/60 flex items-center justify-center p-4">
          <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#059669_1px,transparent_1px)] [background-size:16px_16px]" />
          
          <div className="relative z-10 flex items-center justify-between w-full px-6">
            <div className="flex flex-col items-center gap-1">
              <div className="w-10 h-10 bg-white shadow-md rounded-2xl flex items-center justify-center text-lg">
                👨‍🍳
              </div>
              <span className="text-[10px] font-black text-zinc-700">Kitchen</span>
            </div>

            <div className="flex-1 mx-4 border-t-2 border-dashed border-emerald-600/50 relative flex items-center justify-center">
              <div className="p-2 bg-brand-500 text-white rounded-full shadow-md animate-bounce">
                <Bike className="w-4 h-4" />
              </div>
            </div>

            <div className="flex flex-col items-center gap-1">
              <div className="w-10 h-10 bg-white shadow-md rounded-2xl flex items-center justify-center text-lg">
                🏠
              </div>
              <span className="text-[10px] font-black text-zinc-700">Doorstep</span>
            </div>
          </div>
          <div className="absolute bottom-2 left-3 px-2 py-0.5 bg-black/60 backdrop-blur-xs rounded-md text-[9px] text-white font-bold">
            Live GPS Active
          </div>
        </div>

        {/* Delivery Restaurant Contact Card */}
        <div className="bg-white p-4 rounded-3xl border border-gray-100 shadow-xs flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80"
              alt="Rider"
              className="w-12 h-12 rounded-2xl object-cover ring-2 ring-brand-500/30"
            />
            <div>
              <h3 className="text-xs font-black text-zinc-900">Ramesh Kumar</h3>
              <p className="text-[11px] text-zinc-400">Vaccinated Delivery Restaurant (4.9⭐)</p>
            </div>
          </div>
          <div className="flex gap-2">
            <a
              href="tel:9876543210"
              className="p-2.5 bg-emerald-50 text-emerald-600 rounded-2xl hover:bg-emerald-100 transition-colors shadow-xs"
            >
              <Phone className="w-4 h-4" />
            </a>
            <button
              onClick={() => alert('Connecting to BiteTown in-app messenger...')}
              className="p-2.5 bg-brand-50 text-brand-500 rounded-2xl hover:bg-brand-100 transition-colors shadow-xs"
            >
              <MessageSquare className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Live Stepper Timeline */}
        <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-xs space-y-4">
          <h3 className="text-xs font-black text-zinc-900">Order Updates</h3>
          <div className="space-y-4">
            {steps.map((step, idx) => {
              const isPassed = idx <= currentStep;
              return (
                <div key={idx} className="flex items-start gap-3 relative">
                  {idx !== steps.length - 1 && (
                    <div
                      className={`absolute left-3.5 top-7 bottom-0 w-0.5 -ml-[1px] ${
                        idx < currentStep ? 'bg-brand-500' : 'bg-gray-200'
                      }`}
                    />
                  )}
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 z-10 ${
                      isPassed ? 'bg-brand-500 text-white' : 'bg-gray-100 text-zinc-400'
                    }`}
                  >
                    {isPassed ? <CheckCircle2 className="w-4 h-4" /> : <div className="w-2 h-2 rounded-full bg-zinc-300" />}
                  </div>
                  <div>
                    <h4 className={`text-xs font-bold ${isPassed ? 'text-zinc-900' : 'text-zinc-400'}`}>
                      {step.title}
                    </h4>
                    <p className="text-[11px] text-zinc-400 mt-0.5">{step.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};