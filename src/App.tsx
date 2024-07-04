import MapComponent from "@/components/MapComponents";

function App() {
  const locations = [
    {
      lat: 40.7128,
      lng: -74.0060,
      name: 'New York City',
      description: 'The big apple.'
    },
    {
      lat: 34.0522,
      lng: -118.2437,
      name: 'Los Angeles',
      description: 'The city of angels.'
    },
    // Add more locations as needed
  ];

  return (
    <div className="flex justify-center items-center h-screen">
        {/* <Button className='bg-gray-600 w-32 h-12'>Shaddy</Button> */}
        <MapComponent locations={locations} />
    </div>

  )
}

export default App
