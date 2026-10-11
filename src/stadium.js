function stadium() {
      // A projected, padded envelope: open roof -> rounded shoulder -> front facade.
      // This is an original stylised model, rather than a dimensioned survey of the arena.
      const TAU = Math.PI * 2, azimuth = -.10, elevation = .55;
      const ca = Math.cos(azimuth), sa = Math.sin(azimuth), ce = Math.cos(elevation), se = Math.sin(elevation);
      const profiles = [[285,188,99],[325,225,108],[396,309,110],[456,369,88],[482,389,52],[480,383,14],[458,365,-7]];
      const fmt = n => n.toFixed(2);
      const pt = p => fmt(p[0]) + "," + fmt(p[1]);
      const mix = (a,b,t) => a.map((n,i) => n + (b[i]-n)*t);
      const signed = (n,power=.85) => Math.sign(n) * Math.pow(Math.abs(n), power);
      function project(p) {
        const x = p[0]*ca-p[1]*sa, y = p[0]*sa+p[1]*ca;
        return [600+x, 355+y*se-p[2]*ce, y*ce+p[2]*se];
      }
      function profile(v) {
        const w = Math.max(0,Math.min(1,v))*(profiles.length-1), i = Math.min(profiles.length-2,Math.floor(w));
        return mix(profiles[i],profiles[i+1],w-i);
      }
      function surface(u,v) {
        const [rx,ry,z] = profile(v);
        const power=.50+Math.min(1,v/.5)*.35;
        return [rx*signed(Math.cos(u),power),ry*signed(Math.sin(u),power),z];
      }
      const ring = (rx,ry,z,n=160,power=.85) => Array.from({length:n},(_,i)=>project([rx*signed(Math.cos(i*TAU/n),power),ry*signed(Math.sin(i*TAU/n),power),z]));
      const polygon = points => "M"+points.map(pt).join(" L")+" Z";
      const outline = (rx,ry,z,power=.85) => polygon(ring(rx,ry,z,160,power));
      function cushion(points) {
        let d = "M"+pt(mix(points[points.length-1],points[0],.86));
        for(let i=0;i<points.length;i++) {
          const p=points[i],n=points[(i+1)%points.length];
          d+=" Q"+pt(p)+" "+pt(mix(p,n,.14))+" L"+pt(mix(p,n,.86));
        }
        return d+" Z";
      }
      function facing(u,v) {
        const a=surface(u+.001,v),b=surface(u-.001,v),c=surface(u,Math.min(1,v+.001)),d=surface(u,Math.max(0,v-.001));
        const du=a.map((x,i)=>x-b[i]),dv=c.map((x,i)=>x-d[i]);
        const normal=[dv[1]*du[2]-dv[2]*du[1],dv[2]*du[0]-dv[0]*du[2],dv[0]*du[1]-dv[1]*du[0]];
        const size=Math.hypot(...normal)||1;
        const n=normal.map(x=>x/size), ny=n[0]*sa+n[1]*ca;
        return {visible:ny*ce+n[2]*se, light:Math.max(0,-n[0]*.35+ny*.35+n[2]*.77)};
      }
      const cells=[],columns=88,rows=12;
      for(let j=0;j<=rows;j++) {
        const v=j/rows;
        for(let i=0;i<columns;i++) {
          const u=(i+(j%2)*.5)*TAU/columns,n=facing(u,v);
          if(n.visible < .015)continue;
          const vertices=[[u,v-1/rows],[u+Math.PI/columns,v],[u,v+1/rows],[u-Math.PI/columns,v]].map(([a,b])=>project(surface(a,b)));
          const depth=vertices.reduce((sum,p)=>sum+p[2],0)/4;
          const variation=Math.sin(i*2.47+j*1.93)*.035,light=Math.min(1,.32+n.light*.55+n.visible*.15+variation);
          const tint=[Math.round(83+135*light),Math.round(6+32*light),Math.round(23+39*light)];
          const roof=Math.max(0,Math.min(1,(.38-v)/.13));
          const membrane=[105+75*light,111+74*light,120+72*light];
          const daylight=[Math.round(158+65*light),Math.round(32+37*light),Math.round(57+44*light)];
          const dayRoof=[Math.round(188+49*light),Math.round(195+44*light),Math.round(202+38*light)];
          cells.push({depth,d:cushion(vertices),color:"rgb("+tint.join(",")+")",membrane:"rgb("+membrane.map(Math.round).join(",")+")",day:"rgb("+daylight.join(",")+")",dayRoof:"rgb("+dayRoof.join(",")+")",shine:(.25+light*.4).toFixed(2)});
        }
      }
      cells.sort((a,b)=>a.depth-b.depth);
      const shell=cells.map(c=>'<g><path class="bb-cushion bb-facade-cushion" d="'+c.d+'" fill="'+c.color+'" style="--bb-night-facade:'+c.color+';--bb-day-facade:'+c.day+'"/><path d="'+c.d+'" fill="url(#bb-pillow)" opacity="'+c.shine+'"/></g>').join("");
      const roofShell=cells.map(c=>'<g><path class="bb-cushion bb-roof-cushion" d="'+c.d+'" fill="'+c.membrane+'" style="--bb-night-roof:'+c.membrane+';--bb-day-roof:'+c.dayRoof+'"/><path d="'+c.d+'" fill="url(#bb-roof-pillow)" opacity="'+c.shine+'"/></g>').join("");
      const cloud=[];
      for(let j=0;j<=36;j++)for(let i=0;i<160;i++)cloud.push(project(surface(i*TAU/160,j/36)));
      cloud.sort((a,b)=>a[0]-b[0]||a[1]-b[1]);
      const cross=(a,b,c)=>(b[0]-a[0])*(c[1]-a[1])-(b[1]-a[1])*(c[0]-a[0]);
      const hullHalf=points=>{const half=[];for(const point of points){while(half.length>1&&cross(half[half.length-2],half[half.length-1],point)<=0)half.pop();half.push(point);}return half;};
      const lower=hullHalf(cloud),upper=hullHalf([...cloud].reverse());
      const body=polygon(lower.slice(0,-1).concat(upper.slice(0,-1)));
      const roofBoundary=polygon(Array.from({length:200},(_,i)=>project(surface(i*TAU/200,.34))));

      let seats="",aisles="",lights="",stripes="",fieldLines="",entrances="";
      const tiers=[[[278,180,82],[257,164,59]],[[254,160,52],[235,143,25]],[[232,140,18],[214,136,-14]]];
      for(let tier=0;tier<tiers.length;tier++) {
        const [a,b]=tiers[tier];
        for(let row=0;row<8;row++) {
          const p=mix(a,b,row/7);
          seats+='<path d="'+outline(...p,.57)+'" fill="none" stroke="'+(row===0?"var(--bb-seat-rim)":"var(--bb-seat)")+'" stroke-width="'+(row===0?"1.6":"1.15")+'" stroke-dasharray="'+(row===0?"none":"1.4 2.9")+'" opacity="'+(row===0?".7":".63")+'"/>';
        }
        for(let i=0;i<36;i++) {
          const u=i*TAU/36;
          const p=project([a[0]*signed(Math.cos(u),.57),a[1]*signed(Math.sin(u),.57),a[2]]);
          const q=project([b[0]*signed(Math.cos(u),.57),b[1]*signed(Math.sin(u),.57),b[2]]);
          aisles+='<path d="M'+pt(p)+" L"+pt(q)+'" stroke="var(--bb-aisle)" stroke-width="3"/>';
        }
      }
      const floor=z=>project([z[0],z[1],-30]);
      const rectangle=(x,y,w,h)=>polygon([[x,y],[x+w,y],[x+w,y+h],[x,y+h]].map(floor));
      for(let i=0;i<14;i++)stripes+='<path d="'+rectangle(-208+i*416/14,-132,416/14,264)+'" fill="'+(i%2?"var(--bb-grass-a)":"var(--bb-grass-b)")+'"/>';
      fieldLines+='<path d="'+rectangle(-202,-126,404,252)+'"/><path d="M'+pt(floor([0,-126]))+" L"+pt(floor([0,126]))+'"/>';
      fieldLines+='<path d="'+rectangle(-202,-58,64,116)+'"/><path d="'+rectangle(138,-58,64,116)+'"/>';
      fieldLines+='<path d="'+rectangle(-202,-27,26,54)+'"/><path d="'+rectangle(176,-27,26,54)+'"/>';
      const circle=Array.from({length:64},(_,i)=>floor([29*Math.cos(i*TAU/64),29*Math.sin(i*TAU/64)]));
      fieldLines+='<path d="'+polygon(circle)+'"/>';
      const netLeft=[[-207,-15],[-214,-15],[-214,15],[-207,15]].map(floor),netRight=[[207,-15],[214,-15],[214,15],[207,15]].map(floor);
      fieldLines+='<path d="'+polygon(netLeft)+'"/><path d="'+polygon(netRight)+'"/>';
      for(let i=0;i<80;i++) {
        const u=i*TAU/80,p=project([287*signed(Math.cos(u),.5),190*signed(Math.sin(u),.5),99]);
        lights+='<circle cx="'+fmt(p[0])+'" cy="'+fmt(p[1])+'" r="'+(i%10===0?"1.45":".7")+'" fill="#f8e7dd" opacity="'+(i%10===0?".95":".52")+'"/>';
      }
      for(let i=0;i<19;i++) {
        const u=.25+(Math.PI-.5)*i/18,p=project(surface(u,.97));
        entrances+='<path d="M'+fmt(p[0]-3)+","+fmt(p[1]-3)+" v7 h6 v-7z"+'" fill="#10050b" opacity=".72"/>';
      }
      const opening=outline(285,188,99,.5),topRim=outline(285.5,188.5,100,.5),base=outline(461,368,-8);
      return '<svg class="bb-arena-model" viewBox="0 0 1200 650" aria-hidden="true" data-model="allianz-arena-v3"><defs>'+
        '<radialGradient id="bb-ground"><stop stop-color="#dc052d" stop-opacity=".24"/><stop offset=".58" stop-color="#8f0b27" stop-opacity=".08"/><stop offset="1" stop-color="#08090c" stop-opacity="0"/></radialGradient>'+
        '<radialGradient id="bb-pillow" cx=".43" cy=".33" r=".72"><stop stop-color="#ffd3d1" stop-opacity=".74"/><stop offset=".5" stop-color="#ff7187" stop-opacity=".32"/><stop offset="1" stop-color="#330413" stop-opacity=".38"/></radialGradient>'+
        '<radialGradient id="bb-roof-pillow" cx=".43" cy=".34" r=".72"><stop stop-color="#ffffff" stop-opacity=".45"/><stop offset=".52" stop-color="#cbd4df" stop-opacity=".08"/><stop offset="1" stop-color="#161e2d" stop-opacity=".3"/></radialGradient>'+
        '<radialGradient id="bb-bowl"><stop stop-color="var(--bb-bowl-center)"/><stop offset=".65" stop-color="var(--bb-bowl-mid)"/><stop offset="1" stop-color="var(--bb-bowl-edge)"/></radialGradient>'+
        '<linearGradient id="bb-front-shade" x1="0" y1="0" x2="0" y2="1"><stop stop-color="#07090d" stop-opacity="0"/><stop offset=".7" stop-color="#07090d" stop-opacity="0"/><stop offset="1" stop-color="#07090d" stop-opacity=".55"/></linearGradient>'+
        '<filter id="bb-arena-shadow" x="-20%" y="-30%" width="140%" height="180%"><feGaussianBlur stdDeviation="10"/></filter>'+
        '<filter id="bb-led-glow" x="-15%" y="-30%" width="130%" height="160%"><feGaussianBlur stdDeviation="2"/></filter>'+
        '<clipPath id="bb-opening-clip"><path d="'+opening+'"/></clipPath><clipPath id="bb-roof-zone"><path d="'+roofBoundary+'"/></clipPath></defs>'+
        '<ellipse cx="600" cy="488" rx="547" ry="128" fill="url(#bb-ground)"/>'+
        '<path d="'+outline(494,405,-10)+'" fill="var(--bb-arena-shadow)" opacity="var(--bb-arena-shadow-opacity)" filter="url(#bb-arena-shadow)"/>'+
        '<g fill="none" stroke="#7b4d56" stroke-width=".7" opacity=".19"><path d="'+outline(509,420,-13)+'"/><path d="'+outline(524,435,-13)+'"/></g>'+
        '<path d="'+body+'" fill="#a4213c"/><g clip-path="url(#bb-opening-clip)" class="bb-arena-interior"><path d="'+opening+'" fill="url(#bb-bowl)"/>'+
        stripes+'<g fill="none" stroke="#cadbd0" stroke-width="1" opacity=".44">'+fieldLines+'</g>'+seats+aisles+'</g>'+
        '<g class="bb-arena-envelope">'+shell+'<g clip-path="url(#bb-roof-zone)">'+roofShell+'</g></g>'+
        '<path d="'+base+'" fill="none" stroke="#ef254e" stroke-width=".8" opacity=".34"/>'+entrances+
        '<path d="'+topRim+'" fill="none" stroke="#efafaf" stroke-width=".8" opacity=".48"/>'+
        '<g class="bb-arena-lights"><g filter="url(#bb-led-glow)" opacity=".6">'+lights+'</g>'+lights+'</g>'+ 
        '<path d="'+outline(482,389,32)+'" fill="url(#bb-front-shade)" opacity=".22" pointer-events="none"/>'+
        '</svg>';
    }

