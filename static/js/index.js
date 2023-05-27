var canvas=document.getElementById("canva");
canvas.height=512;
canvas.width=512;
//canvas.style.background="white";
var context=canvas.getContext("2d");
context.fillStyle="white";
context.fillRect(0,0,canvas.width,canvas.height);
//TO UPLOAD AN IMAGE:-
var uploader=document.querySelector("#upload")
uploader.addEventListener('change',(e)=>{
//  console.log(canvas.height,canvas.width);
  const myFile = uploader.files[0];
  //console.log(myFile.name);
  const img = new Image();
  img.src = URL.createObjectURL(myFile);
  img.onload = function(){
  //  console.log(img.height,img.width);
    //canvas.height = img.height;
    //canvas.width = img.width;
    context.drawImage(img,0,0,canvas.width,canvas.height);
  }
})

// FOR DRAWING:
var color="black";
var pen_width="3";
var drawing="false";//to tell if drawing or not

//FOR UNDO:-
let arr=[];
let index=-1;



function start(event){
  drawing=true;
  context.beginPath();
  //context.moveTo(event.clientX-canvas.offsetLeft,event.clientY-canvas.offsetTop);
  context.moveTo(getX(event),getY(event));
  event.preventDefault();
}
function draw(event){
  if(drawing==true){
    context.lineTo(getX(event),getY(event));
    context.strokeStyle="color";
    context.lineWidth="pen_width";
    context.lineCap="round";
    context.lineJoin="round";//without interruptions
    context.stroke();
  }
  event.preventDefault();
}
function stop(event){
  if(drawing==true){
    context.stroke();
    context.closePath();
    drawing=false;
  }
  event.preventDefault();
  if(event!='mouseout'){
    arr.push(context.getImageData(0,0,canvas.width,canvas.height));
    index++;
  }
}
function getX(event) {
  if (event.pageX == undefined) {return event.targetTouches[0].pageX - canvas.offsetLeft}
  else {return event.pageX - canvas.offsetLeft}
  }


function getY(event) {
  if (event.pageY == undefined) {return event.targetTouches[0].pageY - canvas.offsetTop}
  else {return event.pageY - canvas.offsetTop}
}
canvas.addEventListener('touchstart',start,false);
canvas.addEventListener('touchmove',draw,false);
canvas.addEventListener("touchend",stop,false);
canvas.addEventListener('mousedown',start,false);
canvas.addEventListener('mousemove',draw,false);
canvas.addEventListener("mouseup",stop,false);
canvas.addEventListener("mouseout",stop,false);

//BUTTONS:-
function clear_canvas(){
  context.fillStyle=="white";
  context.clearRect(0,0,canvas.width,canvas.height);
  context.fillRect(0,0,canvas.width,canvas.height);
  arr=[];
  index=-1;
}
function undo_canvas(){
  if(index<=0){
    clear_canvas();
  }
  else{
    index-=1;
    arr.pop();
    context.putImageData(arr[index],0,0);
  }
}

//downloading sketch:-
document.getElementById("download").addEventListener("click",function(e){
  let canvasURL=canvas.toDataURL();
  const createE1=document.createElement('a');
  createE1.href=canvasURL;
  createE1.download="download-this-canvas";
  createE1.click();
  createE1.remove();
})
