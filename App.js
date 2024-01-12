import React, { useState, useEffect } from 'react';  

import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Modal from 'react-modal';

import Landing from './Landing';
import ChannelPage from './ChannelPage';
import MessagePage from './MessagePage';
import Login from './Login';
import SignUp from './Signup';
import SearchMessages from './SearchMessages';
import './App.css';

function App() {
  // const [getList, setList] = useState([]);

  // useEffect(() => {
  //   if (getList.length < 1) {
  //     fetch('http://localhost:8086/getPosts')
  //       .then((response) => response.json())
  //       .then((response) => setList(response));
  //   }
  // }, [getList]);
  const [loggedIn, setLoggedIn] = useState(false);
  const [username, setusername] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [userId, setUserId] = useState(null);
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchResults, setShowSearchResults] = useState(false);

  const handleSearch = async (query) => {
    try {
      const response = await fetch(`http://localhost:8086/searchMessages?query=${query}`);
      const data = await response.json();
      setSearchResults(data);
      setShowSearchResults(true);
    } catch (error) {
      console.error('Error searching messages:', error);
    }
  };

  useEffect(() => {
    // Set the app element for the modal
    Modal.setAppElement('#root'); // You need to replace '#root' with the appropriate selector for your root element
  }, []);

  return (
    <div className="App bg-blue-900 text-white min-h-screen">
      <header className="App-header">
      
        <div>
        <Router>
        <Link to="/">  <button className="blueButton"> Home </button> </Link>
        <Link to="/ChannelPage">  <button className="blueButton"> Channels </button> </Link>
        {/* Link to="/MessagePage">  <button> Add Message </button>   </Link> */}
        {/* <Link to="/Login">  <button> Log In </button>   </Link>
        <Link to="/SignUp">  <button> Sign Up </button>   </Link> */}
         <Routes>
         {/* <Route path="/channel/*" element={<ChannelPageRoutes />} />*/
          <Route exact path='/' element={<Landing username={username} loggedIn={loggedIn} setLoggedIn={setLoggedIn} setusername={setusername} setIsAdmin={setIsAdmin}/>} /> }
          <Route path="/Login" element={<Login setLoggedIn={setLoggedIn} setUserId={setUserId} setusername={setusername} setIsAdmin={setIsAdmin}/>} />
          <Route path='/SignUp' element={<SignUp />} />
          <Route  path='/ChannelPage' element={<ChannelPage  loggedIn={loggedIn} setLoggedIn={setLoggedIn} userId={userId}/>} />
          <Route  path='/MessagePage' element={<MessagePage loggedIn={loggedIn} setLoggedIn={setLoggedIn} userId={userId}/>} />
          <Route path='/channel/:channelId' element={<ChannelPage loggedIn={loggedIn} setLoggedIn={setLoggedIn} userId={userId}/>} />

          {/* <Route path="/showPosts" element={<ShowPosts get = {getList}/>} />
          <Route path="/addPosts" element={ <AddPosts set = {setList} /> } /> */}
          </Routes>
        </Router>
        </div>
      
      </header>

      <SearchMessages onSearch={handleSearch} />

      {showSearchResults && (
        <div className="searchResults">
          <h2>Search Results</h2>
          {/* Display the search results using a component or just a list */}
          <ul>
            {searchResults.map((result) => (
              <li key={result.message_id}>{result.content} by {result.username}</li>
            ))}
          </ul>
        </div>
      )}

      </div>
  );
}

export default App;