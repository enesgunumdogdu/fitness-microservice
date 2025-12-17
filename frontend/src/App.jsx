import { BrowserRouter as Router, Navigate, Route, Routes, useLocation } from 'react-router';
import { Button } from '@mui/material';

function App() {


  return (
    <Router>
      <Button variant="contained" color="#dc004e" >
        Login
      </Button>
    </Router>
  );
}

export default App;
