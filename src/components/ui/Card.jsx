// components/ui/Card.jsx
'use client';
import { useState } from 'react';

export default function Card({ item, tipo, onClick, onCreatorClick }) {
  const [imageError, setImageError] = useState(false);
  const imageUrl = 
  item.image || 
  item.photos?.[0] || 
  item.photo || 
  item.imageUrl || 
  item.img || 
  item.photoUrl || 
  item.picture || 
  null;

  const gradientClass = tipo === 'local' 
    ? 'from-purple-100 to-pink-100' 
    : 'from-green-100 to-blue-100';

  const getPlatoEmoji = () => {
    const categoria = item.category?.toLowerCase() || '';
    if (categoria.includes('entrada')) return '🥗';
    if (categoria.includes('principal')) return '🍖';
    if (categoria.includes('postre')) return '🍰';
    if (categoria.includes('bebida')) return '🥤';
    return '🍲';
  };

  // Obtener nombre del creador (puede venir en diferentes formatos)
  const creatorName = item.creatorName || item.userName || item.creator?.name || 'Usuario';

  console.log('🎯 Item rating:', {
  name: item.name,
  rating: item.rating,
  ratingAverage: item.ratingAverage,
  averageRating: item.averageRating
});

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition">
      {/* Imagen (clickeable) */}
      <div 
        onClick={onClick}
        className={`h-48 bg-gradient-to-br ${gradientClass} flex items-center justify-center text-6xl cursor-pointer`}
      >
        {imageUrl && !imageError ? (
          <img 
            src={imageUrl} 
            alt={item.name}
            className="w-full h-full object-cover"
            onError={() => setImageError(true)}
          />
        ) : (
          tipo === 'local' ? '🏠' : getPlatoEmoji()
        )}
      </div>
      
      {/* Contenido */}
      <div className="p-4">
        {/* Nombre (clickeable) */}
        <h3 
          onClick={onClick}
          className="text-xl font-bold text-gray-800 mb-2 line-clamp-1 cursor-pointer hover:text-purple-600"
        >
          {item.name}
        </h3>
        
        {/* Información principal */}
        <div className="flex items-center gap-2 text-gray-600 mb-3">
          {tipo === 'local' ? (
            <>
              <span>📍</span>
              <span className="truncate">{item.city || 'Sin ciudad'}</span>
              {item.ratingAverage > 0 && (
                <span className="ml-auto text-yellow-500 flex items-center gap-1">
                  ⭐ {item.ratingAverage.toFixed(1)}
                </span>
              )}
            </>
          ) : (
            <>
              <span className="text-green-600 font-bold text-lg">${item.price}</span>
              {item.category && (
                <>
                  <span className="text-gray-400">•</span>
                  <span className="text-gray-500 text-sm truncate">{item.category}</span>
                </>
              )}
            </>
          )}
        </div>

        {/* Creador (clickeable) */}
        <div 
          onClick={() => onCreatorClick(item.creatorId)}
          className="flex items-center gap-2 text-sm text-gray-500 border-t pt-3 mt-2 cursor-pointer hover:text-purple-600 group"
        >
          <span className="text-lg">👤</span>
          <span className="group-hover:underline">Publicado por: <span className="font-medium">{creatorName}</span></span>
        </div>
      </div>
    </div>
  );
}