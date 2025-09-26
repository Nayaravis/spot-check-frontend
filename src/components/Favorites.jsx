import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Favorites() {
  const { token, API_BASE } = useAuth();
  const navigate = useNavigate();
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${API_BASE}/favorites`, {
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        });
        if (!res.ok) {
          const text = await res.text();
          throw new Error(text || 'Failed to load favorites');
        }
        const data = await res.json();
        setFavorites(Array.isArray(data) ? data : []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, [API_BASE, token]);

  if (!token) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-700 mb-4">Please login to view your favorites.</p>
          <button
            onClick={() => navigate('/login')}
            className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl text-gray-600">Loading favorites...</div>
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
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">My Favorites</h2>
          <p className="text-gray-600">{favorites.length} favorite place{favorites.length === 1 ? '' : 's'}</p>
        </div>

        {favorites.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center text-gray-600">
            You have no favorites yet.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {favorites.map((place) => (
              <div
                key={place.id}
                className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 overflow-hidden cursor-pointer"
                onClick={() => navigate(`/places/${place.id}`)}
              >
                {place.photos && (() => { try { return JSON.parse(place.photos); } catch { return []; } })().length > 0 && (
                  <div className="h-48 overflow-hidden">
                    <img
                      src={`https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference=${(() => { try { return JSON.parse(place.photos)[0].name; } catch { return ''; } })()}&key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}`}
                      alt={place.display_name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-800 mb-1">{place.display_name}</h3>
                  <div className="text-sm text-gray-500 mb-2">
                    {place.types && (() => { try { return JSON.parse(place.types).map(t => t.split('_').join(' ')).join(' • '); } catch { return ''; } })()}
                  </div>
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <span className="text-sm text-gray-500">View details</span>
                    <span className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded-md text-white bg-blue-600">Open</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
