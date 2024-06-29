function randomColor(){
    r = Math.floor(Math.random() * 255);
    g = Math.floor(Math.random() * 255);
    b = Math.floor(Math.random() * 255);
    return {r,g,b}
}
function toRad(deg){
    return deg * (Math.PI / 180.0);
}
function randomRange(min,max){
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
function easeOutSine(x) {
    return Math.sin((x * Math.PI) / 2);
}
// get percent between 2 number
function getPercent(input,min,max){
    return (((input - min) * 100) / (max - min))/100;
}
const canvas = document.getElementById("canvas");
        const ctx = canvas.getContext("2d");
        const width = document.getElementById("canvas").width;
        const height = document.getElementById("canvas").height;

        const centerX = width/2;
        const centerY = height/2;
        const radius = width/2;

        let names = document.getElementsByTagName("textarea")[0].value.split("\n");

        let currentDeg = 0;
        let arcLength = 360/names.length;
        let colors = [];
        let namesAngles = {};
        createWheel();

        function createWheel(){
            names = document.getElementsByTagName("textarea")[0].value.split("\n");
            arcLength = 360/names.length;
            colors = [];
            for(let i = 0 ; i < names.length + 1;i++){
                colors.push(randomColor());
            }
            draw();
        }


        function draw(){
            ctx.beginPath();
            ctx.arc(centerX, centerY, radius, toRad(0), toRad(360));

            let startDeg = currentDeg;
            for(let i = 0 ; i < names.length; i++, startDeg += arcLength){
                let endDeg = startDeg + arcLength;

                let colorStyle = `rgb(${colors[i].r},${colors[i].g},${colors[i].b})`;

                //arc drawing
                ctx.beginPath();
                ctx.arc(centerX, centerY, radius, toRad(startDeg), toRad(endDeg));
                ctx.fillStyle = `rgb(${colors[i].r - 30},${colors[i].g - 30},${colors[i].b - 30})`;
                ctx.lineTo(centerX, centerY);
                ctx.fill();

                // text drawing
                ctx.save();
                ctx.translate(centerX, centerY);
                ctx.rotate(toRad((startDeg + endDeg)/2));     //to get the text midle of the arc
                ctx.textAlign = "center";                     //to get the name in the center

                // to fix the confliction of the name color and arc color
                if(colors[i].r > 150 || colors[i].g > 150 || colors[i].b > 150){
                    ctx.fillStyle = "#000";
                }
                else{
                    ctx.fillStyle = "#fff";
                }
                ctx.font = 'bold 24px serif';
                ctx.fillText(names[i], 130, 10);
                ctx.restore();

                namesAngles[names[i]] =                 // start angle and end angle of each names
                    {
                    "startDeg": startDeg,
                    "endDeg" : endDeg
                    }
                

                // check winner
                if(startDeg%360 < 360 && startDeg%360 > 270  && endDeg % 360 > 0 && endDeg%360 < 90 ){
                    document.getElementById("winner").innerHTML = `"${names[i]}" is Winner`;
                }
            }
        }
        

        let speed = 0;
        let maxRotation = randomRange(360* 3, 360 * 6);
        let pause = false;
        function animate(){
            if(pause){
                return;
            }
            speed = easeOutSine(getPercent(currentDeg ,maxRotation ,0)) * 20;
            if(speed < 0.01){
                document.getElementById("winnerBox").style.display = "block";
                speed = 0;
                pause = true;
            }
            currentDeg += speed;
            draw();
            window.requestAnimationFrame(animate);
        }
        
        function spin(){
            if(speed != 0){
                return;
            }

            maxRotation = 0;
            currentDeg = 0;
            createWheel();
            draw();

            const randomName = randomRange(0,names.length-1);
            maxRotation = (360 * 8) - namesAngles[names[randomName]].endDeg-arcLength/2 ;
            namesAngles = {};
            pause = false;
            window.requestAnimationFrame(animate);
        }
        function openWinner(){
            document.getElementById("winnerBox").style.display = "block";
        }
        function closeWinner(){
            document.getElementById("winnerBox").style.display = "none";
        }
