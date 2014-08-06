function convertToRelative(path) {
  function set(type) {
    var args = [].slice.call(arguments, 1)
      , rcmd = 'createSVGPathSeg'+ type +'Rel'
      , rseg = path[rcmd].apply(path, args);
    segs.replaceItem(rseg, i);
  }
  var dx, dy, x0, y0, x1, y1, x2, y2;
  var segs = path.pathSegList;
  
  console.log(segs);
  for (var x = 0, y = 0, i = 0, len = segs.numberOfItems; i < len; i++) {
    var seg = segs.getItem(i)
      , c   = seg.pathSegTypeAsLetter;
    if (/[MLHVCSQTAZz]/.test(c)) {
      if ('x1' in seg) x1 = seg.x1 - x;
      if ('x2' in seg) x2 = seg.x2 - x;
      if ('y1' in seg) y1 = seg.y1 - y;
      if ('y2' in seg) y2 = seg.y2 - y;
      if ('x'  in seg) dx = -x + (x = seg.x);
      if ('y'  in seg) dy = -y + (y = seg.y);
      switch (c) {
        case 'M': set('Moveto',dx,dy);                   break;
        case 'L': set('Lineto',dx,dy);                   break;
        case 'H': set('LinetoHorizontal',dx);            break;
        case 'V': set('LinetoVertical',dy);              break;
        case 'C': set('CurvetoCubic',dx,dy,x1,y1,x2,y2); break;
        case 'S': set('CurvetoCubicSmooth',dx,dy,x2,y2); break;
        case 'Q': set('CurvetoQuadratic',dx,dy,x1,y1);   break;
        case 'T': set('CurvetoQuadraticSmooth',dx,dy);   break;
        case 'A': set('Arc',dx,dy,seg.r1,seg.r2,seg.angle,
                      seg.largeArcFlag,seg.sweepFlag);   break;
        case 'Z': case 'z': x = x0; y = y0; break;
      }
    }
    else {
      if ('x' in seg) x += seg.x;
      if ('y' in seg) y += seg.y;
    }
    // store the start of a subpath
    if (c == 'M' || c == 'm') {
      x0 = x;
      y0 = y;
    }
  }
  path.setAttribute('d', path.getAttribute('d').replace(/Z/g, 'z'));
}
