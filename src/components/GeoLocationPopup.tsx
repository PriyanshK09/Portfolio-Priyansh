import React, { useState, useEffect } from 'react';
import { X, MapPin, Loader } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface GeoLocationPopupProps {
  ip: string;
  isOpen: boolean;
  onClose: () => void;
}

interface GeoLocationData {
  ip: string;
  city: string;
  region: string;
  country: string;
  loc: string; // "latitude,longitude"
  org: string;
  postal: string;
  timezone: string;
}

const GeoLocationPopup = ({ ip, isOpen, onClose }: GeoLocationPopupProps) => {
  const [locationData, setLocationData] = useState<GeoLocationData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && ip) {
      fetchGeoLocation();
    }

    function fetchGeoLocation() {
      setLoading(true);
      setError(null);
      
      // Using ipinfo.io API - it's free for 50,000 requests per month
      fetch(`https://ipinfo.io/${ip}?token=161d38052ef097`)
        .then(response => {
          if (!response.ok) {
            throw new Error('Failed to fetch location data');
          }
          return response.json();
        })
        .then(data => {
          setLocationData(data);
          setLoading(false);
        })
        .catch(err => {
          setError(err.message);
          setLoading(false);
        });
    }

    // Cleanup on close
    return () => {
      if (!isOpen) {
        setLocationData(null);
      }
    };
  }, [isOpen, ip]);

  useEffect(() => {
    if (isOpen) {
      // Add classes immediately when popup opens
      document.body.style.overflow = 'hidden';
      document.body.classList.add('popup-open');
      
      // Force a reflow to ensure the class is applied immediately
      void document.body.offsetHeight;
    } else {
      // Remove classes when popup closes
      document.body.style.overflow = '';
      document.body.classList.remove('popup-open');
    }

    // Cleanup function - ensure classes are removed if component unmounts
    return () => {
      document.body.style.overflow = '';
      document.body.classList.remove('popup-open');
    };
  }, [isOpen]);

  if (!isOpen) return null;

  // Extract latitude and longitude
  let mapUrl = '';
  let latitude = '';
  let longitude = '';
  
  if (locationData?.loc) {
    [latitude, longitude] = locationData.loc.split(',');
    mapUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${longitude}%2C${latitude}%2C${longitude}%2C${latitude}&amp;layer=mapnik&amp;marker=${latitude}%2C${longitude}`;
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          onClick={e => e.stopPropagation()}
          className="relative w-full max-w-4xl max-h-[85vh] bg-[var(--dark-bg)] rounded-2xl overflow-hidden overflow-y-auto
                     border border-[var(--border-color)] shadow-[0_0_100px_-12px_rgba(0,229,160,0.3)]
                     my-16" // Added margin-top and margin-bottom
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/5 hover:bg-white/10 
                      transition-colors z-10 text-white"
          >
            <X className="h-5 w-5" />
          </button>

          <div className="p-6 md:p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-full bg-[var(--primary)]/10">
                <MapPin className="h-6 w-6 text-[var(--primary)]" />
              </div>
              <h2 className="text-2xl font-bold">IP Geolocation</h2>
            </div>

            {loading ? (
              <div className="py-12 flex flex-col items-center justify-center">
                <Loader className="h-8 w-8 text-[var(--primary)] animate-spin mb-4" />
                <p className="text-[var(--text-secondary)]">Fetching location data...</p>
              </div>
            ) : error ? (
              <div className="py-12 text-center">
                <p className="text-red-400 mb-2">Error: {error}</p>
                <p className="text-[var(--text-secondary)]">Failed to retrieve location for IP: {ip}</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <div className="glass-card p-6 mb-6">
                    <h3 className="text-lg font-semibold mb-4 text-[var(--primary)]">Location Details</h3>
                    
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm text-[var(--text-secondary)]">IP Address</p>
                        <p className="font-mono">{locationData?.ip}</p>
                      </div>
                      
                      <div>
                        <p className="text-sm text-[var(--text-secondary)]">City</p>
                        <p>{locationData?.city || 'Unknown'}</p>
                      </div>
                      
                      <div>
                        <p className="text-sm text-[var(--text-secondary)]">Region</p>
                        <p>{locationData?.region || 'Unknown'}</p>
                      </div>
                      
                      <div>
                        <p className="text-sm text-[var(--text-secondary)]">Country</p>
                        <p>{locationData?.country || 'Unknown'}</p>
                      </div>
                      
                      <div>
                        <p className="text-sm text-[var(--text-secondary)]">Postal Code</p>
                        <p>{locationData?.postal || 'Unknown'}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="glass-card p-6">
                    <h3 className="text-lg font-semibold mb-4 text-[var(--primary)]">Technical Details</h3>
                    
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm text-[var(--text-secondary)]">Coordinates</p>
                        <p className="font-mono">{locationData?.loc || 'Unknown'}</p>
                      </div>
                      
                      <div>
                        <p className="text-sm text-[var(--text-secondary)]">Timezone</p>
                        <p>{locationData?.timezone || 'Unknown'}</p>
                      </div>
                      
                      <div>
                        <p className="text-sm text-[var(--text-secondary)]">Organization</p>
                        <p>{locationData?.org || 'Unknown'}</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="glass-card overflow-hidden flex flex-col">
                  <div className="p-4 border-b border-[var(--border-color)]">
                    <h3 className="font-semibold text-[var(--primary)]">Map View</h3>
                  </div>
                  
                  {locationData?.loc ? (
                    <iframe 
                      src={mapUrl}
                      className="w-full flex-grow border-0 h-64 md:h-80" // Added fixed height
                      title="IP Location Map"
                    />
                  ) : (
                    <div className="flex-grow flex items-center justify-center p-6 text-center h-64">
                      <p className="text-[var(--text-secondary)]">
                        Map data unavailable for this IP address
                      </p>
                    </div>
                  )}
                  
                  {locationData?.loc && (
                    <div className="p-4 border-t border-[var(--border-color)] bg-[var(--card-bg)]">
                      <a 
                        href={`https://www.openstreetmap.org/?mlat=${latitude}&mlon=${longitude}`}
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-sm text-[var(--primary)] hover:underline flex items-center justify-center"
                      >
                        View on OpenStreetMap
                      </a>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default GeoLocationPopup;