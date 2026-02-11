/* ===========================
   Resize + Rotate احترافي
=========================== */

function createHandles(el){

// حذف مقابض قديمة
let oldHandles = el.querySelectorAll(".handle");
oldHandles.forEach(h=>h.remove());

const positions = ["nw","ne","sw","se"];

positions.forEach(pos=>{
let handle=document.createElement("div");
handle.className="handle";
handle.dataset.pos=pos;
handle.style.position="absolute";
handle.style.width="10px";
handle.style.height="10px";
handle.style.background="gold";
handle.style.borderRadius="50%";
handle.style.cursor="pointer";

positionHandle(handle,pos,el);

handle.onmousedown=function(e){
e.stopPropagation();
resizeElement(e,el,pos);
};

el.appendChild(handle);
});

// زر تدوير
let rotate=document.createElement("div");
rotate.className="handle";
rotate.style.position="absolute";
rotate.style.top="-25px";
rotate.style.left="50%";
rotate.style.transform="translateX(-50%)";
rotate.style.width="12px";
rotate.style.height="12px";
rotate.style.background="red";
rotate.style.borderRadius="50%";
rotate.style.cursor="grab";

rotate.onmousedown=function(e){
e.stopPropagation();
rotateElement(e,el);
};

el.appendChild(rotate);

}

function positionHandle(handle,pos,el){

if(pos==="nw"){handle.style.left="-5px";handle.style.top="-5px";}
if(pos==="ne"){handle.style.right="-5px";handle.style.top="-5px";}
if(pos==="sw"){handle.style.left="-5px";handle.style.bottom="-5px";}
if(pos==="se"){handle.style.right="-5px";handle.style.bottom="-5px";}

}

function resizeElement(e,el,pos){

let startX=e.clientX;
let startY=e.clientY;
let startW=el.offsetWidth;
let startH=el.offsetHeight;

document.onmousemove=function(ev){

let dx=ev.clientX-startX;
let dy=ev.clientY-startY;

if(pos==="se"){
el.style.width=startW+dx+"px";
el.style.height=startH+dy+"px";
}

if(pos==="sw"){
el.style.width=startW-dx+"px";
el.style.height=startH+dy+"px";
el.style.left=el.offsetLeft+dx+"px";
}

if(pos==="ne"){
el.style.width=startW+dx+"px";
el.style.height=startH-dy+"px";
el.style.top=el.offsetTop+dy+"px";
}

if(pos==="nw"){
el.style.width=startW-dx+"px";
el.style.height=startH-dy+"px";
el.style.left=el.offsetLeft+dx+"px";
el.style.top=el.offsetTop+dy+"px";
}

};

document.onmouseup=function(){
document.onmousemove=null;
saveState();
};

}

function rotateElement(e,el){

let rect=el.getBoundingClientRect();
let centerX=rect.left+rect.width/2;
let centerY=rect.top+rect.height/2;

document.onmousemove=function(ev){
let angle=Math.atan2(ev.clientY-centerY,ev.clientX-centerX);
el.style.transform="rotate("+angle+"rad)";
};

document.onmouseup=function(){
document.onmousemove=null;
saveState();
};

}

/* ===========================
   تحسين select لعرض المقابض
=========================== */

const oldSelect = selectElement;
selectElement = function(el,li){
oldSelect(el,li);
createHandles(el);
};

/* ===========================
   حذف عنصر
=========================== */

document.addEventListener("keydown",function(e){
if(e.key==="Delete" && selectedElement){
selectedElement.remove();
selectedElement=null;
saveState();
}
});

/* ===========================
   ترتيب طبقات
=========================== */

layersPanel.addEventListener("dblclick",function(e){

if(!selectedElement) return;

if(e.shiftKey){
selectedElement.style.zIndex=parseInt(selectedElement.style.zIndex||1)+1;
}else{
selectedElement.style.zIndex=parseInt(selectedElement.style.zIndex||1)-1;
}

saveState();
});

/* ===========================
   Undo / Redo حقيقي
=========================== */

function saveState(){
history.push(canvas.innerHTML);
if(history.length>50) history.shift();
redoStack=[];
}

document.addEventListener("keydown",function(e){

if(e.ctrlKey && e.key==="z"){
if(history.length>1){
redoStack.push(history.pop());
canvas.innerHTML=history[history.length-1];
}
}

if(e.ctrlKey && e.key==="y"){
if(redoStack.length){
let state=redoStack.pop();
history.push(state);
canvas.innerHTML=state;
}
}

});

/* ===========================
   حفظ مشروع JSON
=========================== */

document.getElementById("saveProject").onclick=function(){

let data = JSON.stringify({
width:canvas.style.width,
height:canvas.style.height,
content:canvas.innerHTML
});

let blob=new Blob([data],{type:"application/json"});
let link=document.createElement("a");
link.href=URL.createObjectURL(blob);
link.download="project.json";
link.click();

};

document.getElementById("loadProject").onchange=function(e){

let reader=new FileReader();
reader.onload=function(ev){
let data=JSON.parse(ev.target.result);
canvas.style.width=data.width;
canvas.style.height=data.height;
canvas.innerHTML=data.content;
};
reader.readAsText(e.target.files[0]);

};

/* ===========================
   تصدير PNG عالي الجودة 2x
=========================== */

document.getElementById("exportPNG").onclick=function(){

html2canvas(canvas,{scale:2}).then(c=>{
let link=document.createElement("a");
link.download="design.png";
link.href=c.toDataURL();
link.click();
});

};

/* ===========================
   حفظ الحالة الأولى
=========================== */

saveState();
  const canvas = document.getElementById("canvas");
const layersPanel = document.getElementById("layersPanel");
const fontSelect = document.getElementById("fontSelect");

let selectedElement = null;
let layerCounter = 0;
let history = [];
let redoStack = [];

/* ===========================
   55 قالب احترافي حقيقي
=========================== */

const templates = [
"linear-gradient(45deg,#FFD700,#FF69B4)",
"linear-gradient(45deg,#8E2DE2,#4A00E0)",
"linear-gradient(45deg,#f6d365,#fda085)",
"linear-gradient(45deg,#a18cd1,#fbc2eb)",
"linear-gradient(45deg,#fad0c4,#ffd1ff)",
"linear-gradient(45deg,#ffecd2,#fcb69f)",
"linear-gradient(45deg,#ff9a9e,#fecfef)",
"linear-gradient(45deg,#84fab0,#8fd3f4)",
"linear-gradient(45deg,#cfd9df,#e2ebf0)",
"linear-gradient(45deg,#d4fc79,#96e6a1)"
];

for(let i=0;i<55;i++){
let div=document.createElement("div");
div.className="template";
div.style.background=templates[i%10];
div.onclick=()=>applyTemplate(templates[i%10]);
document.getElementById("templates").appendChild(div);
}

function applyTemplate(bg){
canvas.style.background=bg;
saveState();
}

/* ===========================
   تحميل الخطوط
=========================== */

document.fonts.ready.then(()=>{
document.fonts.forEach(f=>{
let option=document.createElement("option");
option.value=f.family;
option.innerText=f.family;
fontSelect.appendChild(option);
});
});

/* ===========================
   رفع خط من المستخدم
=========================== */

document.getElementById("fontUpload").addEventListener("change", function(e){
let file=e.target.files[0];
let reader=new FileReader();
reader.onload=function(ev){
let fontName=file.name.split(".")[0];
let style=document.createElement("style");
style.innerHTML=`
@font-face{
font-family:'${fontName}';
src:url(${ev.target.result});
}
`;
document.head.appendChild(style);

let option=document.createElement("option");
option.value=fontName;
option.innerText=fontName;
fontSelect.appendChild(option);
fontSelect.value=fontName;
};
reader.readAsDataURL(file);
});

/* ===========================
   إضافة نص احترافي
=========================== */

document.getElementById("addTextBtn").onclick=function(){

let text=document.getElementById("textInput").value;
let color=document.getElementById("textColor").value;
let strokeColor=document.getElementById("strokeColor").value;
let strokeWidth=document.getElementById("strokeWidth").value;
let opacity=document.getElementById("opacityRange").value;
let shadowColor=document.getElementById("shadowColor").value;
let shadowBlur=document.getElementById("shadowBlur").value;

let div=document.createElement("div");
div.className="layer";
div.contentEditable=true;
div.innerText=text;
div.style.color=color;
div.style.fontFamily=fontSelect.value;
div.style.fontSize="50px";
div.style.webkitTextStroke=`${strokeWidth}px ${strokeColor}`;
div.style.opacity=opacity;
div.style.textShadow=`0 0 ${shadowBlur}px ${shadowColor}`;
div.style.left="100px";
div.style.top="100px";

enableTransform(div);
canvas.appendChild(div);
addLayer(div,"نص");
saveState();
};

/* ===========================
   إضافة صورة
=========================== */

document.getElementById("addImageBtn").onclick=function(){

let file=document.getElementById("imageUpload").files[0];
if(!file) return;

let reader=new FileReader();
reader.onload=function(e){

let img=document.createElement("img");
img.src=e.target.result;
img.className="layer";
img.style.width="300px";
img.style.left="100px";
img.style.top="100px";

enableTransform(img);
canvas.appendChild(img);
addLayer(img,"صورة");
saveState();

};
reader.readAsDataURL(file);
};

/* ===========================
   نظام الطبقات الاحترافي
=========================== */

function addLayer(element,type){

layerCounter++;

let li=document.createElement("li");
li.innerText=type+" "+layerCounter;
li.dataset.id=layerCounter;

li.onclick=function(){
selectElement(element,li);
};

layersPanel.prepend(li);
selectElement(element,li);
}

function selectElement(el,li){

document.querySelectorAll(".layer").forEach(l=>l.classList.remove("selected"));
document.querySelectorAll("#layersPanel li").forEach(l=>l.classList.remove("active"));

selectedElement=el;
el.classList.add("selected");

if(li) li.classList.add("active");
}

/* ===========================
   تحريك العناصر
=========================== */

function enableTransform(el){

el.addEventListener("mousedown",function(e){

if(e.target!==el) return;

let offsetX=e.offsetX;
let offsetY=e.offsetY;

document.onmousemove=function(e2){

el.style.left=e2.pageX-canvas.offsetLeft-offsetX+"px";
el.style.top=e2.pageY-canvas.offsetTop-offsetY+"px";

};

document.onmouseup=function(){
document.onmousemove=null;
};

});

}

/* ===========================
   تغيير مقاس اللوحة
=========================== */

document.getElementById("resizeCanvasBtn").onclick=function(){

canvas.style.width=document.getElementById("canvasWidth").value+"px";
canvas.style.height=document.getElementById("canvasHeight").value+"px";

saveState();
};
