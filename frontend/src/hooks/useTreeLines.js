// Custom hook for calculating SVG connection lines between family members
// Uses smooth bezier curves for elegant family tree connections

import { useState, useLayoutEffect, useCallback, useEffect } from 'react';

export function useTreeLines(members, contentRef, scale = 1) {
  const [lines, setLines] = useState([]);

  const drawLines = useCallback(() => {
    if (!contentRef.current || members.length === 0) {
      setLines([]);
      return;
    }
    
    const newLines = [];
    const content = contentRef.current;
    
    // Get content's position - we'll calculate everything relative to this
    const contentRect = content.getBoundingClientRect();

    // Helper to get element position relative to content (not viewport)
    const getNodePosition = (id) => {
      const el = document.getElementById(`node-${id}`);
      if (!el) return null;
      
      const rect = el.getBoundingClientRect();
      
      // Calculate position relative to the content container
      return {
        x: rect.left - contentRect.left + rect.width / 2,
        top: rect.top - contentRect.top,
        bottom: rect.top - contentRect.top + rect.height,
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

    // Group children by their parent pair (to find siblings)
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

    // Draw lines for each family group
    Object.entries(familyGroups).forEach(([key, family]) => {
      const parentPositions = family.parents
        .map(pid => ({ id: pid, pos: getNodePosition(pid) }))
        .filter(p => p.pos !== null);
      
      const childPositions = family.children
        .map(child => ({ id: child.id, pos: getNodePosition(child.id) }))
        .filter(c => c.pos !== null);

      if (parentPositions.length === 0 || childPositions.length === 0) {
        return;
      }

      // Calculate parent connection point
      let parentCenterX, parentBottomY;
      
      if (parentPositions.length >= 2) {
        const p1 = parentPositions[0].pos;
        const p2 = parentPositions[1].pos;
        const leftX = Math.min(p1.x, p2.x);
        const rightX = Math.max(p1.x, p2.x);
        parentBottomY = Math.max(p1.bottom, p2.bottom);
        parentCenterX = (leftX + rightX) / 2;
        
        // Spouse connector - smooth curved line
        const spouseY = parentBottomY + 15;
        newLines.push({
          id: `spouse-${key}`,
          path: `M ${leftX} ${parentBottomY} Q ${leftX} ${spouseY}, ${parentCenterX} ${spouseY} Q ${rightX} ${spouseY}, ${rightX} ${parentBottomY}`,
          type: 'spouse'
        });
      } else {
        parentCenterX = parentPositions[0].pos.x;
        parentBottomY = parentPositions[0].pos.bottom;
      }

      // Calculate children positions
      const childTops = childPositions.map(c => c.pos.top);
      const childTopY = Math.min(...childTops);
      const gapY = childTopY - parentBottomY;
      const dropY = parentBottomY + 20;
      const siblingY = childTopY - 30;

      if (childPositions.length === 1) {
        // Single child - smooth S-curve
        const child = childPositions[0];
        const midY = parentBottomY + gapY / 2;
        
        newLines.push({
          id: `line-${key}-${child.id}`,
          path: `M ${parentCenterX} ${parentBottomY + 15} 
                 C ${parentCenterX} ${midY}, 
                   ${child.pos.x} ${midY}, 
                   ${child.pos.x} ${child.pos.top}`,
          type: 'parent-child'
        });
      } else {
        // Multiple children - bracket with curves
        const childXs = childPositions.map(c => c.pos.x);
        const leftChildX = Math.min(...childXs);
        const rightChildX = Math.max(...childXs);
        
        // Vertical line from parents to sibling bar
        newLines.push({
          id: `drop-${key}`,
          path: `M ${parentCenterX} ${dropY} 
                 C ${parentCenterX} ${siblingY - 20}, 
                   ${parentCenterX} ${siblingY}, 
                   ${parentCenterX} ${siblingY}`,
          type: 'parent-child'
        });

        // Sibling bar - horizontal
        newLines.push({
          id: `sibling-bar-${key}`,
          path: `M ${leftChildX} ${siblingY} L ${rightChildX} ${siblingY}`,
          type: 'sibling'
        });

        // Connect sibling bar to each child with smooth curves
        childPositions.forEach(child => {
          newLines.push({
            id: `child-${key}-${child.id}`,
            path: `M ${child.pos.x} ${siblingY} 
                   C ${child.pos.x} ${siblingY + 15}, 
                     ${child.pos.x} ${child.pos.top - 15}, 
                     ${child.pos.x} ${child.pos.top}`,
            type: 'parent-child'
          });
        });
      }
    });
    
    setLines(newLines);
  }, [members, contentRef]);

  // Draw on mount and when members change
  useLayoutEffect(() => {
    // Multiple draws to catch layout updates
    const timers = [0, 100, 300, 600].map(delay => 
      setTimeout(drawLines, delay)
    );
    return () => timers.forEach(clearTimeout);
  }, [drawLines, scale, members.length, members]);

  // Redraw on window resize only
  useEffect(() => {
    const handleResize = () => requestAnimationFrame(drawLines);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [drawLines]);

  // NO scroll listener - lines are positioned relative to content, not viewport

  return lines;
}
