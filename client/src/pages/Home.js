import React from 'react';

import Sliding from './Sliding';
import Hero from './Hero';

function Home() {
  return (
    <div className="bg-black w-full overflow-hidden">
      <Hero />
      <Sliding />
    </div>
  );
}

export default Home;

