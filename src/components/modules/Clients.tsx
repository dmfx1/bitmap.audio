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
            // FIX: Map over the *target text* instead of the *current text*.
            // This guarantees the string length instantly matches the new client name.
            setDisplayText(() =>
                text.split('').map((char, i) => {
                    if (i < iterations.current) return char;
                    return Math.random() > 0.5 ? '1' : '0';
                }).join('')
            );
            
            // SLOWER REVEAL: 1/4 so it takes a moment to decode
            iterations.current += 1 / 4;

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

    // We now just build 35 EMPTY slots. No names attached!
    const columnsData = useMemo(() => {
        const totalSlots = COLUMNS * CLIENTS_PER_COL;
        const cols = Array.from({ length: COLUMNS }, () => [] as any[]);
        
        for (let index = 0; index < totalSlots; index++) {
            const colIndex = index % COLUMNS;
            const isFirstInCol = Math.floor(index / COLUMNS) === 0;

            cols[colIndex].push({
                id: `client-slot-${index}`,
                // We just give it a random name to establish a baseline length when inactive
                fallbackName: clientsData[index % clientsData.length],
                noiseBefore: generateBinary(isFirstInCol 
                    ? Math.floor(Math.random() * 40) 
                    : 100 + Math.floor(Math.random() * 150))
            });
        }

        return cols.map(col => ({
            slots: col,
            noiseTail: generateBinary(400)
        }));
    }, []);

    // Rolling Reveal Engine - Now with smooth, lingering pacing
    useEffect(() => {
        const allSlotIds = columnsData.flatMap(col => col.slots.map(s => s.id));

        const updateActive = () => {
            setActiveSlots(current => {
                // 1. SLOWER TURNOVER: Shuffle the current active slots, then deliberately
                // drop only 1 or 2 names per cycle (if we have enough on screen).
                // This stops mass disappearances and lets names linger for much longer.
                let kept = [...current].sort(() => Math.random() - 0.5);
                const dropCount = current.length > 5 ? Math.floor(Math.random() * 2) + 1 : 0; 
                kept = kept.slice(dropCount);
                
                // 2. LESS CLUTTER: Maintain 6 to 9 active names instead of 8 to 12.
                const targetCount = 6 + Math.floor(Math.random() * 4); 
                if (kept.length > targetCount) kept = kept.slice(0, targetCount);

                const needed = targetCount - kept.length;
                if (needed <= 0) return kept;

                const activeSlotIds = new Set(kept.map(s => s.id));
                const activeNames = new Set(kept.map(s => s.name));

                // 3. Get all empty physical slots and shuffle them
                const availableSlots = allSlotIds.filter(id => !activeSlotIds.has(id));
                availableSlots.sort(() => Math.random() - 0.5);

                // 4. Get all names NOT currently on screen and shuffle them
                const availableNames = clientsData.filter(name => !activeNames.has(name));
                availableNames.sort(() => Math.random() - 0.5);

                const newAdditions = [];
                
                const limit = Math.min(needed, availableSlots.length, availableNames.length);
                for (let i = 0; i < limit; i++) {
                    newAdditions.push({ 
                        id: availableSlots[i], 
                        name: availableNames[i] 
                    });
                }

                return [...kept, ...newAdditions];
            });
        };

        updateActive();
        // SLOWER INTERVAL: Runs every 2 seconds instead of 1.2s.
        const cycleInterval = setInterval(updateActive, 1600);
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
                        {col.slots.map(slotData => {
                            // Check if this physical slot is currently active
                            const activeData = activeSlots.find(s => s.id === slotData.id);
                            const isActive = !!activeData;
                            
                            return (
                                <React.Fragment key={slotData.id}>
                                    <span className="text-muted-foreground/30 font-light">
                                        {slotData.noiseBefore}
                                    </span>
                                    {/* If active, use the dynamically assigned name. If not, use fallback. */}
                                    <ClientWord 
                                        text={isActive ? activeData.name : slotData.fallbackName} 
                                        isActive={isActive} 
                                    />
                                </React.Fragment>
                            );
                        })}
                        <span className="text-muted-foreground/30 font-light">
                            {col.noiseTail}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
}