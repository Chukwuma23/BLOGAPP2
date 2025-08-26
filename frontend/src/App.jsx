import Navbar from "./components/Navbar";
const App = () => {
  return (
    
    <div className='px-4 md:px-8 lg:px-32 2xl:px-64'>
  <Navbar />

  <NetworkStatus 
        onlineMessage="Connection restored!"
        offlineMessage="You are currently offline. Some features may not work."
        position="bottom"
        checkInterval={3000} // Check every 3 seconds
        showRefreshButton={true}
      />
  </div>
  );
};

export default App;