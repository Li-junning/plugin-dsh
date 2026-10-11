import assert from "node:assert/strict";
import {readFileSync,writeFileSync,mkdirSync} from "node:fs";
import {fileURLToPath} from "node:url";
import path from "node:path";
import vm from "node:vm";
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),"..");
const source=readFileSync(path.join(root,"lib/client.js"),"utf8");
const results=[];
function check(name,fn){fn();results.push(name);console.log("PASS",name);}
function fixture({reduced=false,nativeLoading=null}={}) {
 const listeners=new Map(),timers=new Map(),styles=[],effects=[];
 let clock=0, timerId=0, definition, restored=0, focused=0, Component;
 const focusBefore={isConnected:true,focus(){restored++;}};
 const button={focus(){focused++;},closest(){return this;}};
 const attributes=new Map(),rootListeners=new Map();
 const styleValues=new Map();
 const node={style:{setProperty(k,v){styleValues.set(k,v);}},inert:false,querySelector(){return button;},setAttribute(k,v){attributes.set(k,v);},hasAttribute(k){return attributes.has(k);},removeEventListener(k){rootListeners.delete(k);},addEventListener(k,v){rootListeners.set(k,v);}};
 const document={body:{},querySelector(){return nativeLoading;},activeElement:focusBefore,createElement(){const style={dataset:{},textContent:"",remove(){style.removed=true;}};return style;},head:{appendChild(s){styles.push(s);}}};
 const window={getComputedStyle(){return {backgroundColor:"rgb(20, 20, 20)",color:"rgb(249, 250, 251)",font:"16px Arial"};},matchMedia(){return {matches:reduced};},addEventListener(k,v){listeners.set(k,v);},removeEventListener(k){listeners.delete(k);},__ModuleLoader__:{load(def){definition=def;}}};
 const sandbox={window,document,performance:{now:()=>clock},setTimeout(fn,delay){timers.set(++timerId,{fn,delay,at:clock+delay});return timerId;},clearTimeout(id){timers.delete(id);}};
 vm.runInNewContext(source,sandbox);
 assert.equal(definition.id,"dsh-bayern-boot");
 const plugin=definition.factory(name=>{assert.equal(name,"react");return {createElement:(type,props)=>({type,props})};});
 const ctx={effect(fn){effects.push(fn());},slots:{inject(name,fn){assert.equal(name,"shell.overlay");fn();},register(spec,render){assert.equal(spec.id,definition.id);assert.equal(spec.name,"shell.overlay");Component=render;}}};
 const apply=()=>plugin.apply(ctx);
 const element=()=>Component();
 const attach=()=>{const el=element();el.props.ref(node);return el;};
 const event=(key,extra={})=>({key,prevented:false,stopped:false,preventDefault(){this.prevented=true;},stopPropagation(){this.stopped=true;},...extra});
 const fire=e=>listeners.get("keydown")?.(e);
 const advance=ms=>{
  const target=clock+ms;
  while(true){const due=[...timers].filter(([,t])=>t.at<=target).sort((a,b)=>a[1].at-b[1].at)[0];if(!due)break;timers.delete(due[0]);clock=due[1].at;due[1].fn();}
  clock=target;
 };
 const run=delay=>{for(const [id,t] of [...timers])if(t.delay===delay){timers.delete(id);t.fn();}};
 return {plugin,apply,element,attach,node,styleValues,attributes,listeners,timers,styles,effects,event,fire,run,advance,setClock(v){clock=v;},get restored(){return restored;},get focused(){return focused;}};
}
check("Package and ModuleLoader/slots contract",()=>{
 const manifest=JSON.parse(readFileSync(path.join(root,"package.json"),"utf8"));
 assert.equal(manifest.name,"dsh-bayern-boot");assert.equal(manifest.dsh.client.platform,"web");
 assert.equal(manifest.exports["./client"],"./lib/client.js");assert.equal(manifest.dsh.bundle.patch,"./cordis.patch.yml");
 const f=fixture();assert.deepEqual(Array.from(f.plugin.inject),["slots"]);f.apply();const element=f.element();
 assert.equal(element.type,"div");assert.equal(element.props.id,"bb-root");assert.equal(element.props.role,"dialog");
 assert.equal(element.props["aria-modal"],"true");
 assert.equal((element.props.dangerouslySetInnerHTML.__html.match(/class="bb-panel p/g)||[]).length,5);
 assert.ok(element.props.dangerouslySetInnerHTML.__html.includes("data:image/png;base64,"));
 assert.ok(!source.includes("__CREST_URI__")&&!source.includes("__BOOT_CSS__"));
});
check("Ready begins after nine seconds; one-second exit wait starts only when ready",()=>{
 const f=fixture();f.apply();assert.equal(f.timers.size,0);f.attach();
 assert.equal(f.focused,1);f.run(9000);assert.ok(f.attributes.has("data-ready"));assert.ok([...f.timers.values()].some(t=>t.delay===1000));
});
check("Tab stays in dialog; modifier and system shortcut keys pass through",()=>{
 const f=fixture();f.apply();f.attach();const tab=f.event("Tab");f.fire(tab);
 assert.ok(tab.prevented);assert.equal(f.focused,2);
 for(const e of [f.event("Control"),f.event("r",{ctrlKey:true}),f.event("F4",{altKey:true}),f.event("a",{isComposing:true}),f.event("a",{repeat:true})]){f.fire(e);assert.equal(e.prevented,false);}
 assert.ok(!f.attributes.has("data-leaving"));f.effects.forEach(fn=>fn());
});
check("Esc skips, consumes input, clears handlers, restores focus and retires",()=>{
 const f=fixture();f.apply();f.attach();const e=f.event("Escape");f.fire(e);
 assert.ok(e.prevented&&e.stopped);assert.ok(f.attributes.has("data-leaving"));assert.equal(f.listeners.size,0);
 f.run(550);assert.equal(f.node.style.display,"none");assert.equal(f.node.inert,true);assert.ok(f.styles[0].removed);assert.equal(f.restored,1);assert.equal(f.element(),null);assert.equal(f.timers.size,0);
});
check("Any ordinary key exits",()=>{
 const f=fixture();f.apply();f.attach();f.fire(f.event("a"));f.run(550);assert.equal(f.element(),null);
});
check("Nine-second animation holds for exactly one second, then fades out automatically",()=>{
 const f=fixture();f.apply();f.attach();
 f.advance(8999);assert.ok(!f.attributes.has("data-ready"));assert.ok(!f.attributes.has("data-leaving"));
 f.advance(1);assert.ok(f.attributes.has("data-ready"));assert.ok(!f.attributes.has("data-leaving"));
 f.advance(999);assert.ok(!f.attributes.has("data-leaving"));
 f.advance(1);assert.ok(f.attributes.has("data-leaving"));assert.equal(f.listeners.size,0);
 f.advance(549);assert.notEqual(f.node.style.display,"none");
 f.advance(1);assert.equal(f.element(),null);assert.equal(f.timers.size,0);assert.ok(f.styles[0].removed);assert.equal(f.restored,1);
});
check("Reduced motion shows the final frame for one second before automatic entry",()=>{
 const f=fixture({reduced:true});f.apply();f.attach();f.advance(0);assert.ok(f.attributes.has("data-ready"));
 f.advance(999);assert.ok(!f.attributes.has("data-leaving"));
 f.advance(1);assert.equal(f.element(),null);assert.equal(f.timers.size,0);assert.ok(f.styles[0].removed);
});
check("Effect disposal cleans an active animation",()=>{
 const f=fixture();f.apply();f.attach();f.effects.forEach(fn=>fn());assert.equal(f.listeners.size,0);assert.equal(f.timers.size,0);assert.ok(f.styles[0].removed);assert.equal(f.element(),null);assert.equal(f.restored,1);
});
check("DOM unmount cannot leave a global keyboard listener",()=>{
 const f=fixture();f.apply();const el=f.attach();el.props.ref(null);assert.equal(f.listeners.size,0);assert.equal(f.timers.size,0);assert.equal(f.element(),null);
});
check("Late first activation is suppressed after sixty seconds",()=>{
 const f=fixture();f.setClock(60001);f.apply();assert.equal(f.element(),null);assert.equal(f.listeners.size,0);f.effects.forEach(fn=>fn());
});
check("Reduced motion selects a static final state",()=>{
 const f=fixture({reduced:true});f.apply();f.attach();assert.ok(f.attributes.has("data-reduced"));f.run(0);assert.ok(f.attributes.has("data-ready"));f.fire(f.event("Enter"));f.run(0);assert.equal(f.element(),null);
});
check("Healthy loading page is copied without changing host DOM; its canvas survives the mount",()=>{
 let hostChanged=false;
 const spinner={removeAttribute(){},setAttribute(){}};
 const copy={style:{},outerHTML:'<div data-bb-native-loading>HARNESS</div>',removeAttribute(){},setAttribute(){},querySelector(){return spinner;}};
 const nativeLoading={querySelector(){return spinner;},getBoundingClientRect(){return {left:0,top:40,width:1280,height:680};},cloneNode(){return copy;},remove(){hostChanged=true;}};
 const f=fixture({nativeLoading});f.apply();
 assert.ok(f.element().props.dangerouslySetInnerHTML.__html.includes('data-bb-native-loading'));
 assert.equal(hostChanged,false);assert.equal(copy.style.top,'40px');assert.equal(copy.style.height,'680px');
 f.attach();assert.equal(f.styleValues.get('--bb-native-canvas'),'rgb(20, 20, 20)');
 f.effects.forEach(fn=>fn());assert.equal(f.listeners.size,0);
});
check("Failed loading diagnostics are not copied or covered before application mount",()=>{
 const nativeLoading={querySelector(){return null;},cloneNode(){throw new Error('Failure page must not be copied');}};
 const f=fixture({nativeLoading});f.apply();
 assert.ok(!f.element().props.dangerouslySetInnerHTML.__html.includes('bb-handoff'));
 assert.equal(f.timers.size,0);f.effects.forEach(fn=>fn());
});
check("Client remains offline and CSS is scoped to the overlay",()=>{
 assert.ok(!/\bfetch\s*\(|XMLHttpRequest|localStorage|WebSocket|sendBeacon/.test(source));
 const css=readFileSync(path.join(root,"src/boot.css"),"utf8");
 assert.ok(css.includes("prefers-reduced-motion"));assert.ok(css.includes("var(--bb-offset)"));assert.ok(!/(^|\n)\s*(html|body)\s*[{,]/.test(css));
});
mkdirSync(path.join(root,".verification"),{recursive:true});
writeFileSync(path.join(root,".verification","contract-results.json"),JSON.stringify({status:"pass",checks:results,scope:"VM contract and lifecycle tests; not a real DSH host"},null,2));
console.log(results.length,"checks passed.");

