'use client'

// A simple component that loads Inter font for Uniswap widgets
const FontLoader = () => {
  return (
    <style jsx global>{`
      @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap');
    `}</style>
  );
};

export default FontLoader;