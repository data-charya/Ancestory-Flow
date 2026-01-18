// Custom hook for calculating SVG connection lines between family members

import { useState, useLayoutEffect, useCallback } from 'react';

export function useTreeLines(members, contentRef, scale) {
  const [lines, setLines] = useState([]);

  const drawLines = useCallback(() => {
    if (!contentRef.current) return;
    
    const newLines = [];
    const contentRect = contentRef.current.getBoundingClientRect();
    const currentScale = contentRect.width / contentRef.current.offsetWidth;

    members.forEach(member => {
      if (member.parents?.length > 0) {
        const childEl = document.getElementById(`node-${member.id}`);
        if (childEl) {
          const cRect = childEl.getBoundingClientRect();
          const childPoint = {
            x: (cRect.left - contentRect.left) / currentScale + (cRect.width / currentScale) / 2,
            y: (cRect.top - contentRect.top) / currentScale
          };

          member.parents.forEach(pId => {
            const parentEl = document.getElementById(`node-${pId}`);
            if (parentEl) {
              const pRect = parentEl.getBoundingClientRect();
              const parentPoint = {
                x: (pRect.left - contentRect.left) / currentScale + (pRect.width / currentScale) / 2,
                y: (pRect.top - contentRect.top) / currentScale + (pRect.height / currentScale)
              };
              const midY = parentPoint.y + (childPoint.y - parentPoint.y) / 2;
              
              newLines.push({ 
                id: `${member.id}-${pId}`, 
                path: `M ${parentPoint.x} ${parentPoint.y} C ${parentPoint.x} ${midY}, ${childPoint.x} ${midY}, ${childPoint.x} ${childPoint.y}` 
              });
            }
          });
        }
      }
    });
    
    setLines(newLines);
  }, [members, contentRef]);

  useLayoutEffect(() => {
    const timer = setTimeout(drawLines, 100);
    return () => clearTimeout(timer);
  }, [drawLines, scale]);

  return lines;
}

