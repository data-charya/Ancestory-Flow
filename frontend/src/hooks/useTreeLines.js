// Custom hook for calculating elegant SVG connection lines between family members
// Uses smooth organic curves optimized for visual clarity

import { useState, useLayoutEffect, useCallback, useEffect } from 'react';

export function useTreeLines(members, contentRef) {
  const [lines, setLines] = useState([]);

  const drawLines = useCallback(() => {
    if (!contentRef.current || members.length === 0) {
      setLines([]);
      return;
    }
    
    const newLines = [];
    const content = contentRef.current;
    const contentRect = content.getBoundingClientRect();

    // Helper to get element position relative to content
    const getNodePosition = (id) => {
      const el = document.getElementById(`node-${id}`);
      if (!el) return null;
      
      const rect = el.getBoundingClientRect();
      return {
        x: rect.left - contentRect.left + rect.width / 2,
        top: rect.top - contentRect.top,
        bottom: rect.top - contentRect.top + rect.height,
        left: rect.left - contentRect.left,
        right: rect.left - contentRect.left + rect.width,
        width: rect.width
      };
    };

    // Parse parents helper
    const getParentIds = (member) => {
      let parentIds = member.parents;
      if (typeof parentIds === 'string') {
        try {
          parentIds = JSON.parse(parentIds);
        } catch {
          return [];
        }
      }
      if (!Array.isArray(parentIds)) return [];
      return parentIds.map(id => typeof id === 'string' ? parseInt(id, 10) : id);
    };

    // Group children by their parent pair
    const familyGroups = {};
    members.forEach(member => {
      const parentIds = getParentIds(member);
      if (parentIds.length > 0) {
        const key = [...parentIds].sort((a, b) => a - b).join('-');
        if (!familyGroups[key]) {
          familyGroups[key] = { parents: parentIds, children: [] };
        }
        familyGroups[key].children.push(member);
      }
    });

    // Track used vertical lines to avoid overlap
    const usedDropX = [];

    // Draw lines for each family group
    Object.entries(familyGroups).forEach(([key, family], groupIndex) => {
      const parentPositions = family.parents
        .map(pid => ({ id: pid, pos: getNodePosition(pid) }))
        .filter(p => p.pos !== null);
      
      const childPositions = family.children
        .map(child => ({ id: child.id, pos: getNodePosition(child.id) }))
        .filter(c => c.pos !== null)
        .sort((a, b) => a.pos.x - b.pos.x); // Sort left to right

      if (parentPositions.length === 0 || childPositions.length === 0) return;

      // Calculate parent center point
      let parentCenterX, parentBottomY;
      
      if (parentPositions.length >= 2) {
        const p1 = parentPositions[0].pos;
        const p2 = parentPositions[1].pos;
        parentBottomY = Math.max(p1.bottom, p2.bottom);
        parentCenterX = (p1.x + p2.x) / 2;
        
        // Elegant spouse arc
        const leftX = Math.min(p1.x, p2.x);
        const rightX = Math.max(p1.x, p2.x);
        const arcHeight = 12;
        
        newLines.push({
          id: `spouse-${key}`,
          path: `M ${leftX} ${parentBottomY + 2} 
                 Q ${parentCenterX} ${parentBottomY + arcHeight}, 
                   ${rightX} ${parentBottomY + 2}`,
          type: 'spouse'
        });
      } else {
        parentCenterX = parentPositions[0].pos.x;
        parentBottomY = parentPositions[0].pos.bottom;
      }

      // Find offset for drop line to avoid overlap
      let dropX = parentCenterX;
      const minGap = 8;
      while (usedDropX.some(x => Math.abs(x - dropX) < minGap)) {
        dropX += minGap;
      }
      usedDropX.push(dropX);

      // Calculate child positions
      const childTopY = Math.min(...childPositions.map(c => c.pos.top));
      const verticalGap = childTopY - parentBottomY;
      const junctionY = parentBottomY + verticalGap * 0.55; // Golden ratio-ish

      // Single elegant curve for each child
      childPositions.forEach((child, childIndex) => {
        const startY = parentPositions.length >= 2 ? parentBottomY + 12 : parentBottomY + 2;
        const endY = child.pos.top;
        const controlOffset = (endY - startY) * 0.4;
        
        // Create smooth S-curve from parent to child
        const path = `M ${dropX} ${startY}
                      C ${dropX} ${startY + controlOffset},
                        ${child.pos.x} ${endY - controlOffset},
                        ${child.pos.x} ${endY}`;
        
        newLines.push({
          id: `link-${key}-${child.id}`,
          path,
          type: 'parent-child'
        });
      });
    });
    
    setLines(newLines);
  }, [members, contentRef]);

  // Draw on mount and when members change
  useLayoutEffect(() => {
    const timers = [0, 100, 300, 600].map(delay => 
      setTimeout(drawLines, delay)
    );
    return () => timers.forEach(clearTimeout);
  }, [drawLines, members.length, members]);

  // Redraw on window resize
  useEffect(() => {
    const handleResize = () => requestAnimationFrame(drawLines);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [drawLines]);

  return lines;
}
