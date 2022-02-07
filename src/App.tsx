import React from 'react';

import Blocks from './components/Blocks';

import data from './data/blocks.json';

function App() {
  return (
    <div className="App">
      {data.content.body.map(block => Blocks(block))}
    </div>
  )
}

export default App;
