import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
  const navigate = useNavigate();
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    function getLocation() {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(fetchPlaces);
      }
    }

    const fetchPlaces = async (position) => {
      try {
        const response = await fetch(`http://localhost:5000/places?latitude=${position.coords.latitude}&longitude=${position.coords.longitude}`);
        if (!response.ok) {
          throw new Error('Failed to fetch places');
        }
        const data = await response.json();
        setPlaces(data.places);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    getLocation();
  }, []);

  const savePlaceToDatabase = async (placeData) => {
    try {
      const response = await fetch('http://localhost:5000/places', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(placeData),
      });
      
      if (!response.ok) {
        throw new Error('Failed to save place to database');
      }
      
      return await response.json();
    } catch (err) {
      console.error('Error saving place:', err);
      throw err;
    }
  };

  const handleCardClick = async (place) => {
    try {
      // First save the place to database
      const savedPlace = await savePlaceToDatabase(place);
      // Then navigate to details page using the database ID
      navigate(`/places/${savedPlace.id}`);
    } catch (err) {
      console.error('Error saving place:', err);
      // Still navigate even if save fails, but this shouldn't happen
      navigate(`/places/${place.id}`);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl text-gray-600">Loading places...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl text-red-600">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-gray-900">Spotcheck</h1>
          <p className="text-gray-600 mt-2">Discover and review amazing places</p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">All Places</h2>
          <p className="text-gray-600">Explore {places.length} locations and their reviews</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {places.map((place) => (
            <div 
              key={place.id} 
              className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 overflow-hidden cursor-pointer"
              onClick={() => handleCardClick(place)}
            >
              {place.photos && place.photos.length > 0 && (
                <div className="h-48 overflow-hidden">
                  <img 
                    // src={`https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference=${place.photos[0].name}&key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}`}
                    alt={place.displayName.text}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <div className="p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-1">{place.displayName.text}</h3>
                    {/* <div className="text-sm text-gray-500 mb-2">
                      {place.types?.map(type => type.split('_').join(' ')).join(' • ')}
                    </div> */}
                  </div>
                </div>
                
                <div className="space-y-2 mb-4">
                  {place.postalAddress && (
                    <div className="flex items-start text-sm text-gray-600">
                      <svg className="w-5 h-5 mr-2 mt-0.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      {/* <span>{place.postalAddress.addressLines.join(', ')}</span> */}
                    </div>
                  )}
                  {place.nationalPhoneNumber && (
                    <div className="flex items-center text-sm text-gray-600">
                      <svg className="w-5 h-5 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      <span>{place.nationalPhoneNumber}</span>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <div className="flex items-center">
                    <span className="text-sm text-gray-500">
                      {place.photos?.length || 0} photos
                    </span>
                    {place.websiteUri && (
                      <a 
                        href={place.websiteUri}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="ml-4 text-sm text-blue-600 hover:text-blue-800"
                      >
                        Visit Website
                      </a>
                    )}
                  </div>
                  <a 
                    href={place.googleMapsUri}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    View on Maps
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default HomePage; 
