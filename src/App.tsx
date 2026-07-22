import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import { migratePropertiesToFirestore } from './data/migrateToFirestore';
import Hero from './components/Hero';
import About from './components/About';
import Services from './components/Services';
import Properties from './components/Properties';
import Stats from './components/Stats';
import Testimonials from './components/Testimonials';
import MissionVision from './components/MissionVision';
import Contact from './components/Contact';
import Footer from './components/Footer';

// Modals
import PropertyDetailsModal from './components/PropertyDetailsModal';
import PostPropertyModal from './components/PostPropertyModal';

// Mock properties & Types
import { initialProperties } from './data/mockProperties';
import { Property, SearchFilters, Inquiry } from './types';

// Firebase
import { collection, onSnapshot, addDoc, setDoc, deleteDoc, doc, updateDoc, serverTimestamp, query, orderBy } from 'firebase/firestore';
import { db } from './lib/firebase';

export default function App() {
  // 1. Initial Core Properties State (combines preloaded properties with user posted ones)
  const [properties, setProperties] = useState<Property[]>(initialProperties);
  
  // 2. Favorites/Wishlist state
  const [favorites, setFavorites] = useState<string[]>([]);
  
  // 3. Selection Modal State
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  
  // 4. Posting Wizard Modal state (reused for editing)
  const [isPostOpen, setIsPostOpen] = useState(false);
  const [propertyToEdit, setPropertyToEdit] = useState<Property | null>(null);

  // 5. Global Search Filters conforming to SearchFilters type
  const [filters, setFilters] = useState<SearchFilters>({
    category: 'all',
    query: '',
    city: 'all',
    propertyType: [],
    budgetMin: 0,
    budgetMax: 50000000,
    bedrooms: [],
    possessionStatus: [],
    amenities: [],
    sortBy: 'relevance'
  });

  // Load properties & favorites on mount
  useEffect(() => {
    // Load favorites
    const storedFavs = localStorage.getItem('camellia_favorites');
    if (storedFavs) {
      try {
        setFavorites(JSON.parse(storedFavs) as string[]);
      } catch (e) {
        setFavorites([]);
      }
    }

    let isSeeding = false;

    // Subscribe to Firestore properties
    const q = query(collection(db, 'properties'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, async (snapshot) => {
      if (snapshot.empty) {
        if (isSeeding) return;
        isSeeding = true;
        console.log("Firestore properties collection is empty, seeding initial properties...");
        try {
          for (const property of initialProperties) {
            const docData = { ...property };
            const docId = property.id;
            
            // Remove undefined values to prevent FirebaseError
            Object.keys(docData).forEach(key => {
              // @ts-ignore
              if (docData[key] === undefined) {
                // @ts-ignore
                delete docData[key];
              }
            });

            // Set the document with the exact same ID so it's idempotent
            await setDoc(doc(db, 'properties', docId), {
              ...docData,
              createdAt: serverTimestamp()
            });
          }
          console.log("Initial properties seeded successfully!");
        } catch (error) {
          console.error("Error seeding initial properties:", error);
        } finally {
          isSeeding = false;
        }
        return;
      }

      const firestoreProperties = snapshot.docs.map(doc => ({
        ...doc.data(),
        id: doc.id
      })) as Property[];
      
      setProperties(firestoreProperties);
    }, (error) => {
      console.error("Error fetching properties:", error);
    });

    return () => unsubscribe();
  }, []);

  // Handler to toggle property favorite/wishlist status
  const toggleFavorite = (id: string) => {
    setFavorites(prev => {
      const updated = prev.includes(id) 
        ? prev.filter(item => item !== id) 
        : [...prev, id];
      localStorage.setItem('camellia_favorites', JSON.stringify(updated));
      return updated;
    });
  };

  // Handler to trigger editing mode for a property
  const handleEditProperty = (property: Property) => {
    setPropertyToEdit(property);
    setIsPostOpen(true);
  };

  // Handler to add custom user-created listing
  const handlePropertyAdd = async (newProperty: Property) => {
    try {
      // Add property to Firestore
      const docData = { ...newProperty };
      // Remove id before adding since Firestore generates one
      // @ts-ignore
      delete docData.id;
      
      // Remove undefined values to prevent FirebaseError
      Object.keys(docData).forEach(key => {
        // @ts-ignore
        if (docData[key] === undefined) {
          // @ts-ignore
          delete docData[key];
        }
      });
      
      await addDoc(collection(db, 'properties'), {
        ...docData,
        createdAt: serverTimestamp()
      });

      // Smooth scroll down to properties list to see it live!
      setTimeout(() => {
        const propertiesSection = document.getElementById('properties');
        if (propertiesSection) {
          propertiesSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 500);
    } catch (error) {
      console.error("Error adding property to Firestore:", error);
      alert("Failed to post property. Please try again.");
    }
  };

  // Handler to update listing (Locked)
  const handlePropertyUpdate = async (_updatedProperty: Property) => {
    alert("Property listings are locked and cannot be modified.");
    setSelectedProperty(null);
    setPropertyToEdit(null);
  };
  
  // Handler to delete property (Locked)
  const handlePropertyDelete = async (_propertyId: string) => {
    alert("Property listings are locked and cannot be deleted.");
    setSelectedProperty(null);
  };

  // Handler when Navbar Wishlist indicator is clicked
  const handleFavoritesClick = () => {
    if (favorites.length === 0) {
      alert("Your Wishlist is currently empty! Click the heart icon on any property card to save it for easy access.");
      return;
    }
    
    // Setup filters to focus on wishlist elements
    setFilters(prev => ({
      ...prev,
      query: '', // clear query to show all saved elements
      budgetMax: 50000000,
      propertyType: [],
      bedrooms: [],
      amenities: []
    }));

    // Alert user we filtered for them
    alert(`Wishlist Filter Active: Showing your ${favorites.length} saved properties.`);

    // Smooth scroll down to listings
    const propertiesSection = document.getElementById('properties');
    if (propertiesSection) {
      propertiesSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Handler for direct broker lead form submit
  const handleInquirySubmit = (inquiry: Inquiry) => {
    console.log("Lead generated on Camellia Properties portal:", inquiry);
    // In a production server-side scenario we would POST to an API route proxy.
    // For local experience we trigger visual success indicator inside modal.
  };

  return (
    <div className="min-h-screen bg-[#f4f1ed] text-[#2c3d30] font-sans selection:bg-[#2c3d30] selection:text-[#f4f1ed]">
      {/* Dynamic Header */}
      <Navbar 
        onPostPropertyClick={() => setIsPostOpen(true)} 
        favoritesCount={favorites.length}
        onFavoritesClick={handleFavoritesClick}
      />
      
      <main>
        {/* Modern 99acres Tab Search Console */}
        <Hero filters={filters} setFilters={setFilters} />
        
        {/* Corporate Trust Banner */}
        <About />
        
        {/* Numerical Portal Stats */}
        <Stats />
        
        {/* Core Services */}
        <Services />
        
        {/* Comprehensive Interactive Property Listings Section */}
        <Properties 
          properties={properties} 
          filters={filters} 
          setFilters={setFilters} 
          onPropertyClick={(prop) => setSelectedProperty(prop)}
          favorites={favorites}
          toggleFavorite={toggleFavorite}
          onDeleteProperty={handlePropertyDelete}
          onEditProperty={handleEditProperty}
          onPostPropertyClick={() => setIsPostOpen(true)}
        />
        
        {/* Botanical Identity & Values */}
        <MissionVision />
        
        {/* Real Customer Feedback */}
        <Testimonials />
        
        {/* Dynamic Contact Lead Capture */}
        <Contact />
      </main>
      
      {/* Global Footer */}
      <Footer />

      {/* RERA and Verified Detail overlay with Built-in Home Loan Calculator */}
      {selectedProperty && (
        <PropertyDetailsModal 
          property={selectedProperty}
          onClose={() => setSelectedProperty(null)}
          onInquirySubmit={handleInquirySubmit}
        />
      )}

      {/* Free Real Estate Multi-step Wizard listing creator */}
      <PostPropertyModal 
        isOpen={isPostOpen}
        onClose={() => {
          setIsPostOpen(false);
          setPropertyToEdit(null);
        }}
        onPropertyAdd={handlePropertyAdd}
        propertyToEdit={propertyToEdit}
        onPropertyUpdate={handlePropertyUpdate}
      />
    </div>
  );
}
