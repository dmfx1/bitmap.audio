/* src/components/modules/Clients.tsx */
import React, { useState, useEffect, useRef, useMemo } from 'react';

const clientsData = [
    "ADIDAS", "BBC", "SONY", "LEGO", 
    "REBOK", "PUMA", "F1", "EA GAMES", 
    "HEINEKEN", "BRITISH & LONDON SCIENCE MUSEUM", 
    "MASSIVE MUSIC", "SONICBRAND", "PLAYSTATION",
    "FIFA", "SEON", "CHANNEL 4", "MAN CITY",
    "BMG", "UNIVERSAL MUSIC", "MATCHROOM BOXING",
    "SAVE THE CHILDREN", "WWF", "ITV", 
];

// Generates a binary string with random organic blank spaces
const generateBinary = (length: number) => {
    let result = '';
    for (let i = 0; i < length; i++) {
        const r = Math.random();
        if (r > 0.94) result += ' '; 
        else result += r > 0.5 ? '1' : '0';
    }
    return result;
};

// 1. THE WORD COMPONENT
function ClientWord({ text, isActive }: { text: string, isActive: boolean }) {
    const [displayText, setDisplayText] = useState('');
    const iterations = useRef(0);

    useEffect(() => {
        if (!isActive) {
            setDisplayText(generateBinary(text.length));
            iterations.current = 0;
            return;
        }

        const interval = setInterval(() => {
            setDisplayText((current) =>
                current.split('').map((char, i) => {
                    if (i < iterations.current) return text[i];
                    return Math.random() > 0.5 ? '1' : '0';
                }).join('')
            );
            
            iterations.current += 1/2;

            if (iterations.current >= text.length) {
                clearInterval(interval);
            }
        }, 30);

        return () => clearInterval(interval);
    }, [isActive, text]);

    return (
        <span className={`
            inline transition-all duration-300
            ${isActive 
                ? 'text-primary text-glow font-bold mx-1 text-sm md:text-base tracking-widest z-10' 
                : 'text-muted-foreground/30 font-light tracking-normal text-[10px] md:text-xs z-0'}
        `}>
            {displayText}
        </span>
    );
}

// 2. MAIN COMPONENT
export default function Clients() {
    const [activeSlots, setActiveSlots] = useState<{id: string, name: string}[]>([]);
    
    const COLUMNS = 7;
    const CLIENTS_PER_COL = 5; 

    const columnsData = useMemo(() => {
        const totalSlots = COLUMNS * CLIENTS_PER_COL;
        
        // 1. Shuffle original array so the fill order is random every page load
        const shuffledOriginal = [...clientsData].sort(() => Math.random() - 0.5);
        
        const extendedClients = [];
        for (let i = 0; i < totalSlots; i++) {
            extendedClients.push(shuffledOriginal[i % shuffledOriginal.length]);
        }

        // 2. Shuffle again so the duplicates aren't placed sequentially
        extendedClients.sort(() => Math.random() - 0.5);

        const cols = Array.from({ length: COLUMNS }, () => [] as any[]);
        
        extendedClients.forEach((clientName, index) => {
            const colIndex = index % COLUMNS;
            const isFirstInCol = Math.floor(index / COLUMNS) === 0;

            cols[colIndex].push({
                id: `client-slot-${index}`,
                name: clientName,
                // FIX: Drastically reduced noise length so all 5 clients fit within 40vh!
                // Top client gets 0-40 chars. Subsequent clients get 100-250 chars of noise.
                noiseBefore: generateBinary(isFirstInCol 
                    ? Math.floor(Math.random() * 40) 
                    : 100 + Math.floor(Math.random() * 150))
            });
        });

        return cols.map(col => ({
            clients: col,
            // A long tail just to ensure the column safely bleeds past the bottom of the container
            noiseTail: generateBinary(400)
        }));
    }, []);

    // Rolling Reveal Engine
    useEffect(() => {
        const allSlots = columnsData.flatMap(col => col.clients);

        const updateActive = () => {
            setActiveSlots(current => {
                let kept = current.filter(() => Math.random() > 0.4); 
                
                const targetCount = 8 + Math.floor(Math.random() * 5); 
                if (kept.length > targetCount) kept = kept.slice(0, targetCount);

                const needed = targetCount - kept.length;
                if (needed <= 0) return kept;

                const activeNames = new Set(kept.map(s => s.name));

                const available = allSlots.filter(s => 
                    !kept.find(k => k.id === s.id) && !activeNames.has(s.name)
                );

                available.sort(() => Math.random() - 0.5);
                const newAdditions = [];
                
                for (const slot of available) {
                    if (newAdditions.length >= needed) break;
                    if (!activeNames.has(slot.name)) {
                        newAdditions.push({ id: slot.id, name: slot.name });
                        activeNames.add(slot.name); 
                    }
                }

                return [...kept, ...newAdditions];
            });
        };

        updateActive();
        const cycleInterval = setInterval(updateActive, 1200);
        return () => clearInterval(cycleInterval);
    }, [columnsData]);

    return (
        <div className="w-full relative overflow-hidden">
            <div className="w-full grid grid-cols-1 md:grid-cols-7 gap-0 h-[40vh] border-y border-border/20 bg-background">
                {columnsData.map((col, colIndex) => (
                    <div 
                        key={`col-${colIndex}`} 
                        className="flex flex-col gap-0 overflow-hidden text-left font-mono text-[10px] md:text-xs leading-none break-all whitespace-pre-wrap border-r border-border/10 last:border-r-0"
                    >
                        {col.clients.map(clientData => (
                            <React.Fragment key={clientData.id}>
                                <span className="text-muted-foreground/30 font-light">
                                    {clientData.noiseBefore}
                                </span>
                                <ClientWord 
                                    text={clientData.name} 
                                    isActive={activeSlots.some(s => s.id === clientData.id)} 
                                />
                            </React.Fragment>
                        ))}
                        <span className="text-muted-foreground/30 font-light">
                            {col.noiseTail}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
}