const canvas = document.getElementById("fog");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let fogParticles = [];

for(let i=0;i<100;i++){
    fogParticles.push({
        x:Math.random()*canvas.width,
        y:Math.random()*canvas.height,
        size:Math.random()*50+20,
        speed:Math.random()*0.5
    });
}

function drawFog(){
    ctx.clearRect(0,0,canvas.width,canvas.height);
    ctx.fillStyle="rgba(150,150,255,0.05)";
    fogParticles.forEach(p=>{
        ctx.beginPath();
        ctx.arc(p.x,p.y,p.size,0,Math.PI*2);
        ctx.fill();
        p.x+=p.speed;
        if(p.x>canvas.width) p.x=0;
    });
    requestAnimationFrame(drawFog);
}

drawFog();
