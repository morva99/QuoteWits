import { useState, useEffect, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import QuoteGenerator from '../components/QuoteGenerator';
import JokeGenerator from '../components/JokeGenerator';

function HomePage({ 
  onAddToFavorites, 
  isAuthenticated, 
  isItemSaved,
  generatedQuotes,
  setGeneratedQuotes,
  currentJoke,
  setCurrentJoke
}) {
  const [contentType, setContentType] = useState('quote');
  const containerRef = useRef(null);
  const [positions, setPositions] = useState([]);

  // Функция для обновления позиций кнопок
  const updatePositions = useCallback(() => {
    if (containerRef.current) {
      const btns = containerRef.current.querySelectorAll("button");
      const rects = Array.from(btns).map((btn) => btn.getBoundingClientRect());
      const containerRect = containerRef.current.getBoundingClientRect();
      setPositions(
        rects.map((r) => ({
          top: r.top - containerRect.top,
          left: r.left - containerRect.left,
          width: r.width,
          height: r.height
        }))
      );
    }
  }, []);

  // Обновляем позиции при монтировании и изменении активной вкладки
  useEffect(() => {
    updatePositions();
    // Небольшая задержка для корректного позиционирования после переключения
    const timeout = setTimeout(updatePositions, 50);
    return () => clearTimeout(timeout);
  }, [contentType, updatePositions]);

  // Обработка изменения размера окна
  useEffect(() => {
    const handleResize = () => {
      setTimeout(updatePositions, 100);
    };

    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [updatePositions]);

  const tabs = [
    { id: 'quote', label: 'Цитаты' },
    { id: 'joke', label: 'Шутки' }
  ];

  const activeIndex = tabs.findIndex(tab => tab.id === contentType);

  return (
    <div>
      <div className="flex justify-center mb-8">
        <div 
          ref={containerRef}
          className="relative inline-flex rounded-lg bg-white shadow-md p-1 gap-4"
        >
          {tabs.map((tab) => {
            const isActive = contentType === tab.id;
            
            return (
              <button
                key={tab.id}
                onClick={() => setContentType(tab.id)}
                className={`relative z-10 px-6 py-3 rounded-lg transition-colors duration-300 ${
                  isActive
                    ? 'text-white'
                    : 'text-gray-700 hover:text-gray-900'
                }`}
              >
                {tab.label}
              </button>
            );
          })}

          {/* Анимированный фон для активной вкладки - эффект плавного перетекания */}
          {positions.length > 0 && activeIndex >= 0 && (
            <motion.div
              layoutId="activeTab"
              className="absolute bg-purple-600 rounded-lg -z-0"
              transition={{
                type: "spring",
                stiffness: 250,
                damping: 30,
                mass: 1.2
              }}
              style={{
                top: (positions[activeIndex]?.top || 0) + 4,
                left: (positions[activeIndex]?.left || 0) + 4,
                width: (positions[activeIndex]?.width || 0) - 8,
                height: (positions[activeIndex]?.height || 0) - 8,
              }}
            />
          )}
        </div>
      </div>

      <div style={{ display: contentType === 'quote' ? 'block' : 'none' }}>
        <QuoteGenerator
          onAddToFavorites={onAddToFavorites}
          isAuthenticated={isAuthenticated}
          isItemSaved={isItemSaved}
          generatedQuotes={generatedQuotes}
          setGeneratedQuotes={setGeneratedQuotes}
        />
      </div>
      
      <div style={{ display: contentType === 'joke' ? 'block' : 'none' }}>
        <JokeGenerator
          onAddToFavorites={onAddToFavorites}
          isAuthenticated={isAuthenticated}
          isItemSaved={isItemSaved}
          currentJoke={currentJoke}
          setCurrentJoke={setCurrentJoke}
        />
      </div>
    </div>
  );
}

export default HomePage;
