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
      
      // Using ipinfo.io API
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

    return () => {
      if (!isOpen) {
        setLocationData(null);
      }
    };
  }, [isOpen, ip]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      document.body.classList.add('popup-open');
      void document.body.offsetHeight;
    } else {
      document.body.style.overflow = '';
      document.body.classList.remove('popup-open');
    }

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
        className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm !mt-0"
        onClick={onClose}
        style={{ marginTop: 0 }}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          onClick={e => e.stopPropagation()}
          className="bg-[var(--dark-bg)] rounded-2xl overflow-auto glass"
          style={{ 
            maxHeight: 'calc(100vh - 130px)',
            margin: 0 // Explicitly remove margin
          }}
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-[var(--dark-bg)]/90 hover:bg-[var(--primary)]/10
                      transition-colors z-10 text-white group"
          >
            <X className="h-5 w-5 group-hover:text-[var(--primary)]" />
          </button>

          <div className="p-6">
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
                <div className="flex flex-col gap-6">
                  <div className="glass rounded-xl p-5">
                    <h3 className="text-lg font-semibold mb-4 text-[var(--primary)]">Location Details</h3>
                    
                    <div className="flex flex-col gap-3">
                      <div>
                        <p className="text-sm text-[var(--text-secondary)]">IP Address</p>
                        <p className="font-mono text-white">{locationData?.ip}</p>
                      </div>
                      
                      <div>
                        <p className="text-sm text-[var(--text-secondary)]">City</p>
                        <p className="text-white">{locationData?.city || 'Unknown'}</p>
                      </div>
                      
                      <div>
                        <p className="text-sm text-[var(--text-secondary)]">Region</p>
                        <p className="text-white">{locationData?.region || 'Unknown'}</p>
                      </div>
                      
                      <div>
                        <p className="text-sm text-[var(--text-secondary)]">Country</p>
                        <p className="text-white">{locationData?.country || 'Unknown'}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="glass rounded-xl p-5">
                    <h3 className="text-lg font-semibold mb-4 text-[var(--primary)]">Technical Details</h3>
                    
                    <div className="flex flex-col gap-3">
                      <div>
                        <p className="text-sm text-[var(--text-secondary)]">Coordinates</p>
                        <p className="font-mono text-white">{locationData?.loc || 'Unknown'}</p>
                      </div>
                      
                      <div>
                        <p className="text-sm text-[var(--text-secondary)]">Timezone</p>
                        <p className="text-white">{locationData?.timezone || 'Unknown'}</p>
                      </div>
                      
                      <div>
                        <p className="text-sm text-[var(--text-secondary)]">Organization</p>
                        <p className="text-white">{locationData?.org || 'Unknown'}</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="glass rounded-xl overflow-hidden flex flex-col h-full">
                  <div className="p-4 border-b border-[var(--border-color)]">
                    <h3 className="font-semibold text-[var(--primary)]">Map View</h3>
                  </div>
                  
                  {locationData?.loc ? (
                    <div className="relative h-[280px]">
                      <iframe 
                        src={mapUrl}
                        className="w-full h-full border-0"
                        title="IP Location Map"
                        loading="lazy"
                      />
                    </div>
                  ) : (
                    <div className="h-[280px] flex items-center justify-center">
                      <p className="text-[var(--text-secondary)]">
                        Map data unavailable
                      </p>
                    </div>
                  )}
                  
                  {locationData?.loc && (
                    <div className="p-3 border-t border-[var(--border-color)] bg-[var(--card-bg)]">
                      <a 
                        href={`https://www.openstreetmap.org/?mlat=${latitude}&mlon=${longitude}`}
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-sm text-[var(--primary)] hover:text-[var(--primary)]/80 hover:underline flex items-center justify-center"
                      >
                        Open in full map
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