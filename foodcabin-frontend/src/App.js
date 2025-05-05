import React from 'react';
import Topbar from './components/Topbar';
import Meals from './Pages/Meals';

function App() {
  return (
    <div style={{ display: 'flex' }}>
      <Topbar />
        <Meals />
     
    </div>
  );
}

export default App;




