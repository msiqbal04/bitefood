import React, { useState } from 'react';
import { Star, MessageSquare, Send } from 'lucide-react';

interface ReviewItem {
  id: string;
  customerName: string;
  rating: number;
  date: string;
  orderItems: string;
  comment: string;
  reply?: string;
}

export const RestaurantReviewsPage: React.FC = () => {
  const [reviews, setReviews] = useState<ReviewItem[]>([
    {
      id: 'rev-1',
      customerName: 'Aman Verma',
      rating: 5,
      date: 'Yesterday, 9:30 PM',
      orderItems: '1x Cheese Burst Farmhouse Pizza, 2x Garlic Bread',
      comment: 'Hot pizza delivered on time! Extra cheese was delicious and crust was perfectly crispy.',
      reply: 'Thanks Aman! Glad you loved our signature crust!',
    },
    {
      id: 'rev-2',
      customerName: 'Sneha Patel',
      rating: 4,
      date: '01 Sep 2026, 2:15 PM',
      orderItems: '1x Peri Peri Wings, 1x Cold Coffee',
      comment: 'Wings were crisp and spicy. Coffee could have been slightly sweeter.',
    },
    {
      id: 'rev-3',
      customerName: 'Karan Malhotra',
      rating: 2,
      date: '30 Aug 2026, 8:45 PM',
      orderItems: '2x Paneer Makhani Roll',
      comment: 'Filling was good but the outer roll was a bit chewy and cold.',
    },
  ]);

  const [activeReplyId, setActiveReplyId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');

  const submitReply = (id: string) => {
    if (!replyText.trim()) return;
    setReviews((prev) =>
      prev.map((r) => (r.id === id ? { ...r, reply: replyText.trim() } : r))
    );
    setActiveReplyId(null);
    setReplyText('');
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-black text-zinc-900 tracking-tight">Customer Reviews & Ratings</h1>
        <p className="text-xs text-zinc-400 mt-0.5">Monitor food feedback, culinary ratings & reply to customer comments</p>
      </div>

      {/* Ratings Summary Card */}
      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-soft flex flex-col sm:flex-row items-center gap-6">
        <div className="text-center sm:text-left">
          <div className="text-4xl font-black text-zinc-900">4.6</div>
          <div className="flex items-center gap-1 text-amber-500 my-1 justify-center sm:justify-start">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
            ))}
          </div>
          <div className="text-xs text-zinc-400 font-medium">Based on 284 reviews</div>
        </div>

        <div className="h-16 w-px bg-gray-200 hidden sm:block" />

        <div className="flex-1 grid grid-cols-2 sm:grid-cols-3 gap-4 text-center">
          <div className="p-3 bg-gray-50 rounded-xl">
            <span className="text-[10px] font-bold text-zinc-400 uppercase">Food Taste</span>
            <div className="text-sm font-black text-zinc-800">4.8 / 5</div>
          </div>
          <div className="p-3 bg-gray-50 rounded-xl">
            <span className="text-[10px] font-bold text-zinc-400 uppercase">Packing Quality</span>
            <div className="text-sm font-black text-zinc-800">4.5 / 5</div>
          </div>
          <div className="p-3 bg-gray-50 rounded-xl col-span-2 sm:col-span-1">
            <span className="text-[10px] font-bold text-zinc-400 uppercase">Portion Size</span>
            <div className="text-sm font-black text-zinc-800">4.7 / 5</div>
          </div>
        </div>
      </div>

      {/* Review List */}
      <div className="space-y-4">
        {reviews.map((rev) => (
          <div key={rev.id} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-soft space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <span className="font-bold text-xs text-zinc-900">{rev.customerName}</span>
                <span className="text-[11px] text-zinc-400 block">{rev.date}</span>
              </div>
              <div className="flex items-center gap-1 px-2.5 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-lg text-xs font-black">
                <Star className="w-3 h-3 fill-emerald-600 text-emerald-600" />
                <span>{rev.rating}.0</span>
              </div>
            </div>

            <div className="text-[11px] text-zinc-400 font-medium bg-gray-50 px-3 py-1.5 rounded-lg">
              Ordered: {rev.orderItems}
            </div>

            <p className="text-xs text-zinc-700 leading-relaxed font-medium">"{rev.comment}"</p>

            {/* Existing Reply */}
            {rev.reply && (
              <div className="p-3 bg-brand-50/50 border border-brand-100 rounded-xl space-y-1">
                <span className="text-[10px] font-bold text-brand-700 uppercase tracking-wider">Restaurant Response:</span>
                <p className="text-xs text-zinc-800 font-medium">{rev.reply}</p>
              </div>
            )}

            {/* Write Reply Form */}
            {!rev.reply && activeReplyId === rev.id ? (
              <div className="space-y-2 pt-2">
                <textarea
                  rows={2}
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Type an apology or thank-you note to the customer..."
                  className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => setActiveReplyId(null)}
                    className="px-3 py-1.5 bg-gray-100 text-zinc-600 rounded-lg text-xs font-bold cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => submitReply(rev.id)}
                    className="flex items-center gap-1 px-4 py-1.5 bg-brand-500 hover:bg-brand-600 text-white rounded-lg text-xs font-bold shadow-xs cursor-pointer"
                  >
                    <Send className="w-3 h-3" />
                    <span>Post Reply</span>
                  </button>
                </div>
              </div>
            ) : !rev.reply ? (
              <button
                onClick={() => {
                  setActiveReplyId(rev.id);
                  setReplyText('');
                }}
                className="flex items-center gap-1.5 text-xs font-bold text-brand-600 hover:text-brand-700 pt-1 cursor-pointer"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Reply to Customer</span>
              </button>
            ) : null}
          </div>
        ))}
      </div>
    </div>
  );
};