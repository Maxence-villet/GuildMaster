import React from 'react';

interface Guide {
  id: number;
  title: string;
  author: string;
  text: string;
  date: string;
}

export default function ViewGuide() {
  const guide: Guide = {
    id: 1,
    title: "Tips: Become 6th to 1st with bank system",
    author: "Cris",
    text: `Usually what I like to do is to wait for other clans to finish their clan raids, so we wait a bit. Then when the time is right we start clan raids stealing opportunity of others finishing their clan raids and not defending their bank, the amount depends on what place we are at. For example if we are at the top, 1st or 2nd place, we would have a lower amount of valor in our clan bank and we will have a higher risk of our valor from our clan bank being stolen. But if we are at the bottom, like 6th, 5th, or 4th place, we would have higher amount of valor in our clan bank and have a lower risk of our valor being stolen.

Usually what I like to do is to wait for other clans to finish their clan raids, so we wait a bit. Then when the time is right we start clan raids stealing opportunity of others finishing their clan raids and not defending their bank, the amount depends on what place we are at. For example if we are at the top, 1st or 2nd place, we would have a lower amount of valor in our clan bank and we will have a higher risk of our valor from our clan bank being stolen. But if we are at the bottom, like 6th, 5th, or 4th place, we would have higher amount of valor in our clan bank and have a lower risk of our valor being stolen.

Usually what I like to do is to wait for other clans to finish their clan raids, so we wait a bit. Then when the time is right we start clan raids stealing opportunity of others finishing their clan raids and not defending their bank, the amount depends on what place we are at. For example if we are at the top, 1st or 2nd place, we would have a lower amount of valor in our clan bank and we will have a higher risk of our valor from our clan bank being stolen. But if we are at the bottom, like 6th, 5th, or 4th place, we would have higher amount of valor in our clan bank and have a lower risk of our valor being stolen.`,
    date: "01:58 PM CEST, July 13, 2025",
  };

  return (
      <div className="bg-white p-6 rounded-lg shadow">
        <h1 className="text-2xl font-bold text-black mb-4">{guide.title}</h1>
        <p className="text-gray-600 text-sm mb-2">By {guide.author}</p>
        <p className="text-gray-600 text-sm mb-4">Posted on {guide.date}</p>
        <div className="text-black leading-relaxed overflow-y-auto h-64">
          {guide.text}
        </div>
      </div>
  );
}