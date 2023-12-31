import React from 'react';
import { Link } from 'react-router-dom';

import PopularDIYs from './PopularDIYs';

import landing from '../images/landing.jpg';
import DIY from '../images/DIY.jpg';
import DIY2 from '../images/DIY2.jpg';
import DIY3 from '../images/DIY3.jpg';
import DIY4 from '../images/DIY4.jpg';
import DIY5 from '../images/DIY5.jpg';
import DIY6 from '../images/DIY6.jpg';
import DIY7 from '../images/DIY7.jpg';
import DIY8 from '../images/DIY8.jpg';
import DIY9 from '../images/DIY9.jpg';
import DIY10 from '../images/DIY10.jpg';
import DIY11 from '../images/DIY11.jpg';
import DIY12 from '../images/DIY12.jpg';
import DIY13 from '../images/DIY13.jpg';
import DIY14 from '../images/DIY14.jpg';
import DIY15 from '../images/DIY15.jpg';
import DIY16 from '../images/DIY16.jpg';

const imageUrls = [
  DIY,
  DIY2,
  DIY3,
  DIY4,
  DIY5,
  DIY6,
  DIY7,
  DIY8,
  DIY9,
  DIY10,
  DIY11,
  DIY12,
  DIY13,
  DIY14,
  DIY15,
  DIY16,
];


function Hero() {
  return (
    <div className="container mx-auto p-4">
      <section className="first">
      <div className="flex flex-wrap-reverse items-center">
        {/* Big Picture on the Right */}
        <div className="w-full md:w-1/2 mb-4 md:mb-0">
          <img
            src={landing}
            alt="Big Image"
            className="w-full h-auto object-cover"
            style={{ borderRadius: '50%' }}
          />
        </div>

        {/* Text Content on the Left */}
        <div className="w-full md:w-1/2 md:pl-10">
          <h1 className="lg:text-7xl md:text-5xl sm:text-3xl text-yellow-500 text-center font-bold mb-4">Welcome to CraftHouse!</h1>

          <p className="lg:text-3xl text-center md:text-2xl mb-4">
            Join the Community and Start sharing your creative DIY ideas today!
          </p>

          <p className="text-yellow-500 text-center lg:text-2xl mb-4">
           Interact with other DIYers and spread the inspiration!
          </p>

           <p className="text-white text-center font-mono lg:text-4xl sm:text-2xl border border-yellow-700 rounded p-2">
           Explore our DIYs, Save your favorite and come back to them later!
            </p>

            <div className="text-center mt-8 mb-8">
              <Link to="/explore" className="bg-yellow-500 hover:bg-yellow-700 transition duration-300 text-white font-semibold py-2 px-4 rounded-lg mr-4">
                Explore
              </Link>
              <Link to="/signup" className="bg-yellow-500 hover:bg-yellow-700 transition duration-300 text-white font-semibold py-2 px-4 rounded-lg">
                Sign Up
              </Link>
            </div>
            
        </div>
      </div>
      </section>
      <section className="second">
      {/* Image Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-8">
        {imageUrls.map((imageUrl, index) => (
          <div key={index} className="relative group">
            <img
              src={imageUrl}
              alt={`Image ${index + 1}`}
              className="w-full h-auto cursor-pointer transition transform duration-300 scale-100 group-hover:scale-105"
            />
          </div>
          
        ))}
      </div>

      </section>      
      <section className="popular-diy-section  py-12 mt-6">
      <div className="container mx-auto">
        <div>
          {/* popular diys rendered here */}
          <PopularDIYs />
        </div>
      </div>
    </section>

    </div>
  );
}

export default Hero;
