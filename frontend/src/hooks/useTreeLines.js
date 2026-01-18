// Custom hook for neat tree lines
// All horizontal lines stay in the gaps between generations

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

    // Get element position
    const getNodePosition = (id) => {
      const el = document.getElementById(`node-${id}`);
      if (!el) return null;
      const rect = el.getBoundingClientRect();
      return {
        x: rect.left - contentRect.left + rect.width / 2,
        top: rect.top - contentRect.top,
        bottom: rect.top - contentRect.top + rect.height,
      };
    };

    // Parse parents
    const getParentIds = (member) => {
      let parentIds = member.parents;
      if (typeof parentIds === 'string') {
        try { parentIds = JSON.parse(parentIds); } 
        catch { return []; }
      }
      if (!Array.isArray(parentIds)) return [];
      return parentIds.map(id => typeof id === 'string' ? parseInt(id, 10) : id);
    };

    // Get generation bottom positions (lowest point of cards in each gen)
    const genBottoms = {};
    const genTops = {};
    members.forEach(m => {
      const pos = getNodePosition(m.id);
      if (!pos) return;
      const gen = m.generation ?? 0;
      if (!genBottoms[gen] || pos.bottom > genBottoms[gen]) {
        genBottoms[gen] = pos.bottom;
      }
      if (!genTops[gen] || pos.top < genTops[gen]) {
        genTops[gen] = pos.top;
      }
    });

    // Group children by primary parent
    const parentToChildren = {};
    members.forEach(member => {
      const parentIds = getParentIds(member);
      if (parentIds.length > 0) {
        const primaryParent = parentIds[0];
        if (!parentToChildren[primaryParent]) {
          parentToChildren[primaryParent] = [];
        }
        parentToChildren[primaryParent].push(member);
      }
    });

    // Draw lines for each parent group
    Object.entries(parentToChildren).forEach(([parentId, children]) => {
      const parent = members.find(m => m.id === parseInt(parentId));
      if (!parent) return;
      
      const parentPos = getNodePosition(parseInt(parentId));
      if (!parentPos) return;

      const childPositions = children
        .map(child => ({ id: child.id, pos: getNodePosition(child.id), gen: child.generation }))
        .filter(c => c.pos !== null)
        .sort((a, b) => a.pos.x - b.pos.x);

      if (childPositions.length === 0) return;

      // Find the gap between parent generation and child generation
      const parentGen = parent.generation ?? 0;
      const childGen = childPositions[0].gen ?? 0;
      
      const parentBottom = genBottoms[parentGen] || parentPos.bottom;
      const childTop = genTops[childGen] || childPositions[0].pos.top;
      
      // Position horizontal bar in the middle of the gap
      const gapMiddle = parentBottom + (childTop - parentBottom) / 2;

      // Vertical line from parent down to gap middle
      newLines.push({
        id: `v1-${parentId}`,
        path: `M ${parentPos.x} ${parentPos.bottom + 2} L ${parentPos.x} ${gapMiddle}`,
      });

      if (childPositions.length === 1) {
        // Single child - horizontal then vertical
        const child = childPositions[0];
        if (Math.abs(parentPos.x - child.pos.x) > 2) {
          newLines.push({
            id: `h-${parentId}`,
            path: `M ${parentPos.x} ${gapMiddle} L ${child.pos.x} ${gapMiddle}`,
          });
        }
        newLines.push({
          id: `v2-${parentId}-${child.id}`,
          path: `M ${child.pos.x} ${gapMiddle} L ${child.pos.x} ${child.pos.top - 2}`,
        });
      } else {
        // Multiple children
        const leftX = childPositions[0].pos.x;
        const rightX = childPositions[childPositions.length - 1].pos.x;

        // Connect parent to the bar
        const barLeft = Math.min(leftX, parentPos.x);
        const barRight = Math.max(rightX, parentPos.x);

        // Horizontal bar spanning all children (and parent if outside)
        newLines.push({
          id: `h-${parentId}`,
          path: `M ${barLeft} ${gapMiddle} L ${barRight} ${gapMiddle}`,
        });

        // Vertical drop to each child
        childPositions.forEach(child => {
          newLines.push({
            id: `v2-${parentId}-${child.id}`,
            path: `M ${child.pos.x} ${gapMiddle} L ${child.pos.x} ${child.pos.top - 2}`,
          });
        });
      }
    });
    
    setLines(newLines);
  }, [members, contentRef]);

  useLayoutEffect(() => {
    const timers = [50, 200, 500].map(delay => setTimeout(drawLines, delay));
    return () => timers.forEach(clearTimeout);
  }, [drawLines, members.length, members]);

  useEffect(() => {
    const handleResize = () => requestAnimationFrame(drawLines);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [drawLines]);

  return lines;
}
