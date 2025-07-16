"use client";

import { motion } from "framer-motion";
import React from "react";

export const HeroSection: React.FC = () => {
  const handleCreateList = () => {
    const createListSection = document.getElementById('create-list');
    if (createListSection) {
      createListSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative bg-white py-20 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl"
          >
            Share Your Links{' '}
            <span className="text-blue-600">Simply</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mt-6 text-lg leading-8 text-gray-600"
          >
            Create and share collections of links with a beautiful, easy-to-share URL. 
            Perfect for curating resources, bookmarks, and collections.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mt-10 flex items-center justify-center gap-x-6"
          >
            <button
              onClick={handleCreateList}
              className="rounded-md bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 transition-colors"
            >
              Create Your First List
            </button>
            <a
              href="#features"
              className="text-sm font-semibold leading-6 text-gray-900 hover:text-blue-600 transition-colors"
            >
              Learn more <span aria-hidden="true">→</span>
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
