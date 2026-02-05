import React, { useRef, useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, Circle, useMap, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MessageSquare, Plus, Minus, RotateCcw } from 'lucide-react';

// Custom MapDrop Handler
const MapDropHandler = ({ onDrop }) => {
    const map = useMap();

    useEffect(() => {
        const container = map.getContainer();
        
        const handleDragOver = (e) => {
            e.preventDefault();
            e.stopPropagation();
            e.dataTransfer.dropEffect = 'copy';
        };

        const handleDrop = (e) => {
            e.preventDefault();
            e.stopPropagation();
            const dataString = e.dataTransfer.getData('application/json');
            if (!dataString) return;

            try {
                const data = JSON.parse(dataString);
                const { clientX, clientY } = e;
                const containerRect = container.getBoundingClientRect();
                const layerPoint = map.containerPointToLayerPoint([
                    clientX - containerRect.left,
                    clientY - containerRect.top
                ]);
                const latlng = map.layerPointToLatLng(layerPoint);
                
                onDrop(data, latlng);
            } catch (err) {
                console.error("Drop failed parsing:", err);
            }
        };

        container.addEventListener('dragover', handleDragOver);
        container.addEventListener('drop', handleDrop);

        return () => {
            container.removeEventListener('dragover', handleDragOver);
            container.removeEventListener('drop', handleDrop);
        };
    }, [map, onDrop]);

    return null;
};

const MapEvents = ({ onMapClick }) => {
    useMapEvents({
        click: (e) => {
            if (onMapClick) {
                onMapClick(e.latlng);
            }
        }
    });
    return null;
};

const CustomZoomControl = () => {
    const map = useMap();
    const [zoom, setZoom] = useState(map.getZoom());

    useEffect(() => {
        const onZoom = () => setZoom(map.getZoom());
        map.on('zoomend', onZoom);
        return () => map.off('zoomend', onZoom);
    }, [map]);

    // Keyboard Shortcuts
    useEffect(() => {
        const handleKeyDown = (e) => {
            // Check if active element is an input to avoid zooming while typing
            const tagName = document.activeElement.tagName;
            if (tagName === 'INPUT' || tagName === 'TEXTAREA') return;

            if (e.key === '=' || e.key === '+') {
                map.zoomIn();
            } else if (e.key === '-' || e.key === '_') {
                map.zoomOut();
            } else if (e.key === '0') {
                map.setZoom(16); // Reset
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [map]);

    const handleZoomIn = (e) => {
        e.stopPropagation();
        map.zoomIn();
    };

    const handleZoomOut = (e) => {
        e.stopPropagation();
        map.zoomOut();
    };

    const handleReset = (e) => {
        e.stopPropagation();
        map.setZoom(16); // Default level
    };

    const zoomPercent = Math.round((zoom / 18) * 100);

    return (
        <div className="absolute top-4 right-14 flex flex-col gap-1 z-[1000] transition-opacity">
             <div className="bg-[#1a1a1a] border border-slate-700 rounded-lg shadow-xl overflow-hidden flex flex-col">
                <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8 rounded-none hover:bg-slate-800 text-slate-300"
                    onClick={handleZoomIn}
                    disabled={zoom >= 19}
                    title="Zoom In (+)"
                >
                    <Plus className="w-4 h-4" />
                </Button>
                <div className="h-px w-full bg-slate-800"></div>
                <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8 rounded-none hover:bg-slate-800 text-slate-300"
                    onClick={handleZoomOut}
                    disabled={zoom <= 2}
                    title="Zoom Out (-)"
                >
                    <Minus className="w-4 h-4" />
                </Button>
             </div>
             
             <Button 
                variant="secondary" 
                size="sm" 
                className="h-6 text-[10px] bg-[#1a1a1a] border border-slate-700 text-slate-300 hover:bg-slate-800 shadow-xl px-2 mt-1"
                onClick={handleReset}
                title="Reset Zoom (0)"
             >
                 {zoomPercent}%
             </Button>
        </div>
    );
};

const CommentMarker = ({ comment, onClick }) => {
    const getColor = (priority) => {
        if (priority === 'High') return '#ef4444'; // Red
        if (priority === 'Medium') return '#eab308'; // Yellow
        return '#22c55e'; // Green
    };

    const color = getColor(comment.priority);
    const resolved = comment.status === 'Resolved';

    // SVG Icon for Comment Pin
    const svg = `
        <svg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
             <defs>
                <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
                  <feDropShadow dx="1" dy="1" stdDeviation="1" flood-color="black" flood-opacity="0.5"/>
                </filter>
             </defs>
             <g filter="url(#shadow)">
                 <path d="M20 4 C13 4 8 9 8 16 C8 21 11 25 15 27 L20 34 L25 27 C29 25 32 21 32 16 C32 9 27 4 20 4 Z" 
                    fill="${resolved ? '#475569' : color}" 
                    stroke="white" 
                    stroke-width="2"
                />
                 <circle cx="20" cy="16" r="4" fill="white"/>
             </g>
        </svg>
    `;

    const icon = L.divIcon({
        html: svg,
        className: 'custom-comment-icon transition-transform hover:scale-110',
        iconSize: [40, 40],
        iconAnchor: [20, 40],
        popupAnchor: [0, -40]
    });

    return (
        <Marker 
            position={[comment.lat, comment.lng]} 
            icon={icon}
            eventHandlers={{ click: () => onClick(comment) }}
        >
            <Popup className="custom-popup">
                <div className="flex flex-col gap-1 min-w-[200px]">
                    <div className="flex items-center justify-between border-b border-slate-200 pb-1 mb-1">
                         <span className="font-bold text-xs">{comment.creator?.display_name || 'User'}</span>
                         <Badge variant="outline" className="text-[10px] h-4 px-1">{comment.priority}</Badge>
                    </div>
                    <div className="text-sm text-slate-700 whitespace-pre-wrap max-h-[100px] overflow-y-auto">
                        {comment.content}
                    </div>
                    <div className="text-[10px] text-slate-500 mt-1 flex justify-between">
                         <span className="uppercase font-semibold">{comment.status}</span>
                         {comment.assigned_to && <span>Assigned to: {comment.assignee?.display_name || '...'}</span>}
                    </div>
                </div>
            </Popup>
        </Marker>
    );
};

const EquipmentMarker = ({ item, isSelected, onClick, onDragEnd, validationStatus, showNozzles }) => {
    const nozzleOffsets = [
        { id: 'N1', cx: 20, cy: 0, label: 'N1' },   // Top
        { id: 'N2', cx: 40, cy: 20, label: 'N2' },  // Right
        { id: 'N3', cx: 20, cy: 40, label: 'N3' },  // Bottom
        { id: 'N4', cx: 0, cy: 20, label: 'N4' }    // Left
    ];

    const createCustomIcon = (type, rotation, selected, hasError) => {
        const borderColor = hasError ? '#ef4444' : selected ? '#3b82f6' : '#64748b';
        const fillColor = selected ? '#1e293b' : '#0f172a';
        
        const nozzleSvg = showNozzles ? nozzleOffsets.map(n => 
            `<circle cx="${n.cx}" cy="${n.cy}" r="3" fill="#fbbf24" stroke="black" stroke-width="0.5" class="nozzle-marker" data-nozzle="${n.id}" />`
        ).join('') : '';

        const svg = `
            <svg width="44" height="44" viewBox="-2 -2 44 44" xmlns="http://www.w3.org/2000/svg" style="transform: rotate(${rotation}deg); transform-origin: center;">
                <rect x="5" y="5" width="30" height="30" fill="${fillColor}" stroke="${borderColor}" stroke-width="${selected ? 3 : 2}" rx="4" />
                <path d="M10 10 L30 30 M30 10 L10 30" stroke="${borderColor}" stroke-width="1" opacity="0.2"/>
                <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="${borderColor}" font-size="8" font-family="monospace" font-weight="bold">${type.substring(0,3)}</text>
                ${hasError ? '<circle cx="35" cy="5" r="4" fill="#ef4444" stroke="#fff" stroke-width="1"/>' : ''}
                ${isSelected || showNozzles ? nozzleSvg : ''}
            </svg>
        `;
        
        return L.divIcon({
            html: svg,
            className: 'custom-equipment-icon',
            iconSize: [44, 44],
            iconAnchor: [22, 22]
        });
    };

    const icon = createCustomIcon(item.type, item.rotation, isSelected, validationStatus?.type === 'error');

    return (
        <Marker
            position={[item.lat, item.lng]}
            icon={icon}
            draggable={true}
            eventHandlers={{
                click: (e) => {
                    L.DomEvent.stopPropagation(e);
                    onClick(item);
                },
                dragend: (e) => {
                    const marker = e.target;
                    const position = marker.getLatLng();
                    onDragEnd(item.id, position);
                }
            }}
        >
            <Popup className="custom-popup">
                <div className="font-bold text-sm">{item.tag}</div>
                <div className="text-xs text-slate-500">{item.type}</div>
                {item.properties?.service && <div className="text-xs italic mt-1">{item.properties.service}</div>}
            </Popup>
        </Marker>
    );
};

const LineDecorator = ({ line }) => {
    if (!line.points || line.points.length < 2) return null;
    const start = line.points[0];
    const end = line.points[1];
    const midLat = (start.lat + end.lat) / 2;
    const midLng = (start.lng + end.lng) / 2;
    const dy = end.lat - start.lat;
    const dx = end.lng - start.lng;
    let angle = Math.atan2(dy, dx) * 180 / Math.PI;
    
    return (
        <Marker 
           position={[midLat, midLng]}
           icon={L.divIcon({
               html: `<div style="transform: rotate(${angle - 90}deg); color: #3b82f6; font-size: 20px; font-weight: bold; text-shadow: 0 0 2px black;">➤</div>`,
               className: 'bg-transparent border-none',
               iconSize: [24, 24],
               iconAnchor: [12, 12]
           })}
           interactive={false}
           zIndexOffset={100}
        />
    );
};

const DesignerMap = ({ 
    items, 
    lines, 
    zones, 
    mapStyle, 
    snapSettings, 
    onDrop,
    onMapClick,
    onItemUpdate,
    onItemSelect,
    selectedItems,
    validationResults,
    showNozzles = true,
    comments = [] 
}) => {
    
    return (
        <div className="w-full h-full relative z-0 group">
            <MapContainer 
                center={[29.7604, -95.3698]} 
                zoom={16} 
                minZoom={2}
                maxZoom={19}
                style={{ height: '100%', width: '100%', background: '#0f172a' }}
                zoomControl={false} // Disable default, use custom
            >
                <TileLayer
                    url={
                        mapStyle === 'Satellite' ? 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}' :
                        mapStyle === 'Dark Matter' ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png' :
                        'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png'
                    }
                    attribution="&copy; OpenStreetMap & CartoDB"
                    className={mapStyle === 'Dark Matter' ? 'opacity-80' : ''}
                />
                
                <MapEvents onMapClick={onMapClick} />
                <MapDropHandler onDrop={onDrop} />
                <CustomZoomControl />

                {/* Zones */}
                {zones.map(zone => (
                    <Circle 
                        key={zone.id}
                        center={[zone.geometry.center[0], zone.geometry.center[1]]}
                        radius={zone.geometry.radius}
                        pathOptions={{ 
                            color: zone.type === 'Exclusion' ? '#ef4444' : '#f97316', 
                            fillColor: zone.type === 'Exclusion' ? '#ef4444' : '#f97316',
                            fillOpacity: 0.1,
                            dashArray: '5, 5'
                        }}
                    >
                         <Popup>{zone.name} ({zone.type})</Popup>
                    </Circle>
                ))}

                {/* Lines */}
                {lines.map(line => (
                    <React.Fragment key={line.id}>
                        <Polyline 
                            positions={line.points.map(p => [p.lat, p.lng])}
                            pathOptions={{ color: '#3b82f6', weight: 4, opacity: 0.8 }}
                        >
                             <Popup>
                                <div className="font-bold">{line.line_id}</div>
                                <div className="text-xs">From: {line.from_tag}</div>
                                <div className="text-xs">To: {line.to_tag}</div>
                                <div className="text-xs text-slate-400 mt-1">{line.properties?.size}" {line.properties?.spec}</div>
                            </Popup>
                        </Polyline>
                        <LineDecorator line={line} />
                    </React.Fragment>
                ))}

                {/* Equipment */}
                {items.map(item => {
                    const validationStatus = validationResults?.find(v => v.itemId === item.id);
                    return (
                        <EquipmentMarker 
                            key={item.id} 
                            item={item} 
                            isSelected={selectedItems.includes(item.id)}
                            onClick={onItemSelect}
                            onDragEnd={onItemUpdate}
                            validationStatus={validationStatus}
                            showNozzles={showNozzles}
                        />
                    );
                })}

                {/* Comments */}
                {comments.filter(c => c.lat && c.lng).map(comment => (
                     <CommentMarker 
                        key={comment.id}
                        comment={comment}
                        onClick={(c) => {
                             // Optional: Trigger panel to scroll to comment
                             console.log("Comment clicked", c);
                        }} 
                     />
                ))}

            </MapContainer>
        </div>
    );
};

export default DesignerMap;