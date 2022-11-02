class Boxer {
    constructor(name, surname, nation, image, stats, retro = false)
    {
        this.name = name;
        this.surname = surname;
        this.nation = nation;
        this.image = image;
        this.stats = stats;
        this.retro = retro;
    }
}

let boxers = [
    new Boxer("Anthony", "Joshua", "england", "https://boxinggu.ru/wp-content/uploads/2016/12/E%60ntoni-Dzhoshua.png", [92, 87, 86]),
    new Boxer("Lennox", "Lewis", "england", "https://www.thesportsdb.com/images/media/player/cutout/2myhe81611486474.png", [95, 87, 92], true),
    new Boxer("Viddal", "Riley", "england", "riley", [80, 82, 77]),
    new Boxer("Dimitry", "Bivol", "ru", "bivol", [90, 89, 89]),
    new Boxer("Ilunga", "Makabu", "COD", "makabu", [92, 88, 89]),
    new Boxer("Gennady", "Golovkin", "KZ", "https://media-s3-us-east-1.ceros.com/bwin/images/2022/08/23/e8da0cae4b33a03b235cafb3488d0314/image.png", [92, 90, 88]),
    new Boxer("Manny", "Pacquiao", "PH", "pacquiao", [88, 94, 86]),
    new Boxer("Oleksandr", "Usyk", "ukraine", "usyk", [89, 93, 90]),
    new Boxer("Canelo", "Alvarez", "mexico", "canelo", [93, 91, 93]),
    new Boxer("Muhammad", "Ali", "usa", "ali", [96, 98, 94], retro),
    new Boxer("Floyd", "Mayweather Jr", "usa", "https://www.wbaboxing.com/wp-content/uploads/2012/09/floydmayweather-jr.png", [88, 92, 98]),
    new Boxer("Mike", "Tyson", "usa", "https://www.nicepng.com/png/full/161-1612774_we-have-collaborated-with-boxing-dvd-mike-tyson.png", [96, 90, 94], true)
].sort((a, b) => 0.5 - Math.random())

function checkRange(start, end, value)
{
    return start <= value && value < end;
}

function drawCard(boxer, canvas) 
{
    // const canvas = document.getElementById('card');
    const ctx = canvas.getContext('2d');
    const base = new Image();
    const border = new Image();
    const rim = new Image();
    const flagTexture = new Image();
    const flag = new Image();
    const nameGradient = new Image();
    const boxerImage = new Image();
    const flagSrc = `https://countryflagsapi.com/png/${boxer.nation}`
    const boxerImageSrc = boxer.image.slice(0, 4) == "http" ? boxer.image : `images/${boxer.image}.png`
    const overall = Math.floor((boxer.stats.reduce((a,b) => a+b)) / 3)

    const rarityRanges = [
        {
            range: [0, 70],
            filter: "hue-rotate(-30deg) contrast(50%) brightness(80%)"
        },
        {
            range: [70, 80],
            filter: "hue-rotate(150deg) grayscale(75%) contrast(70%)"
        },
        {
            range: [80, 90],
            filter: "none"
        },
        {
            range: [90, 100],
            filter: "hue-rotate(280deg) brightness(130%) contrast(80%)"
        },
    ]
    let rarityFilter = "none";

    rarityRanges.forEach(range => {
        if(checkRange(range.range[0], range.range[1], overall))
        {
            rarityFilter = range.filter;
            return;
        }
    })

    ctx.toggleSmoothing = function(bool = true) {
        this.mozImageSmoothingEnabled = bool;
        this.webkitImageSmoothingEnabled = bool;
        this.msImageSmoothingEnabled = bool;
        this.imageSmoothingEnabled = bool;
    }

    const vertPadding = 35;
    const horPadding = 28;
    const trueWidth = 345;
    const trueHeight = 431;
    
    base.onload = () => {
        ctx.drawImage(base, 0, 0)
        // console.log("Base loaded!")
    }
    base.src = "images/generator/base.png";

    flag.onload = () => {
        // console.log("Flag loaded!")
        flagTexture.onload = () => {
            // ctx.toggleSmoothing(false)
            // if(boxer.retro) 
            //     ctx.filter = "sepia(100%)"
            ctx.filter = boxer.retro ? "sepia(100%)" : "saturate(75%) contrast(75%)";
            let width = flag.height * .8
            ctx.drawImage(flag, (flag.width - width) / 2 - 5, 0, width, flag.height, horPadding, vertPadding, trueWidth, trueHeight)
            // ctx.toggleSmoothing(true)
            ctx.filter = "none"
            ctx.globalCompositeOperation='multiply';
            ctx.drawImage(flagTexture, 0, 0)
            // console.log("Flag texture loaded!")
            ctx.globalCompositeOperation='source-over';
        }
        flagTexture.src = "images/generator/flag-texture.png";

        boxerImage.onload = () => {
            nameGradient.onload = () => {
                // console.log("Boxer loaded!")
                let ratio = boxerImage.width / boxerImage.height
                ctx.globalCompositeOperation = 'source-atop';
                ctx.filter = boxer.retro ? "drop-shadow(1px -1px 3px rgb(0, 0, 0)) sepia(100%)" : "drop-shadow(1px -1px 3px rgba(0, 0, 0, 1)) saturate(85%) contrast(85%)"
                ctx.drawImage(boxerImage, (-(ratio * trueHeight - trueWidth) / 2) + 100, vertPadding + 15, ratio * trueHeight, trueHeight - 15)
                ctx.filter = "none"
                ctx.globalCompositeOperation='source-over';
                // console.log("Name gradient loaded!")
                ctx.drawImage(nameGradient, 0, 0)
            }
            nameGradient.src = "images/generator/name-gradient.png";
    
            border.onload = () => {
                // console.log("Border loaded!")
                ctx.drawImage(border, 0, 0)
            }
            border.src = "images/generator/border.png";
        
            rim.onload = () => {
                ctx.filter = rarityFilter;
                // console.log("Rim loaded!")
                ctx.drawImage(rim, 0, 0)
                ctx.filter = "none"

                ctx.filter = "drop-shadow(0 0 5px rgba(0, 0, 0, .6))"
    
                ctx.font = "24px Archivo Black";
                ctx.fillStyle = "white"
                ctx.textAlign = "center"
                ctx.fillText(boxer.name.toUpperCase(), 200, 390, trueWidth - 32)

                // let grd = ctx.createRadialGradient(200, 430, 25, 20, 430, 60);
                // grd.addColorStop(0, "rgb(225, 213, 97)");
                // grd.addColorStop(1, "rgb(181, 162, 0)");
    
                ctx.font = "42px Archivo Black";
                ctx.fillStyle = "rgb(181, 162, 0)";
                ctx.filter = rarityFilter == "none" ? "drop-shadow(0 0 6px rgba(0, 0, 0, .8))" : `${rarityFilter} drop-shadow(0 0 6px rgba(0, 0, 0, .8))`;
                ctx.fillText(boxer.surname.toUpperCase(), 200, 430, trueWidth - 48)
                ctx.filter = "none";
    
                ctx.filter = "drop-shadow(0 0 5px rgba(0, 0, 0, .8))"
                ctx.font = "60px Archivo Black";
                ctx.fillStyle = "white"
                ctx.fillText(overall, 82, 106)
    
                ctx.filter = "drop-shadow(0 0 2px rgba(0, 0, 0, .8))"
                ctx.font = "14px Archivo Black";
                ctx.textAlign = "left"
                boxer.stats.forEach((stat, i) => {
                    let statName = ""
                    switch(i) 
                    {
                        case 0:
                            statName = "ATK"
                            break;
                        case 1:
                            statName = "MOV"
                            break;
                        case 2:
                            statName = "DEF"
                            break;
                        default:
                            break;
                    }
                    ctx.fillText(`${stat} ${statName}`, 45, 155 + (i*30))
    
                });
    
                ctx.filter = "none"
            }
            rim.src = "images/generator/rim-gold.png";
    
        }
        boxerImage.src = boxerImageSrc;

    }
    flag.src = flagSrc;
}

function loadCards() {
    let font = new FontFace('Archivo Black', "url(images/generator/ArchivoBlack-Regular.ttf)")
    font.load().then((font) => {
        document.fonts.add(font)
        console.log("Font loaded!")
        boxers.forEach(boxer => {
            let canvas = document.createElement("canvas");
            canvas.width = 400
            canvas.height = 500
            document.querySelector("#wrapper").append(canvas)
            drawCard(boxer, canvas);
            VanillaTilt.init(canvas, {
                max: 25,
                speed: 600
            });
        })
    })
}

document.querySelector("form").addEventListener('submit', (e) => {
    e.preventDefault()
    let inputs = Array.from(document.querySelectorAll("form input")).map(x => x.type == "text" ? x.value : x.checked)
    inputs[4] = inputs[4].split(",").map(x => parseInt(x))

    let canvas = document.createElement("canvas");
    canvas.width = 400
    canvas.height = 500
    document.querySelector("#wrapper").append(canvas)
    drawCard(new Boxer(inputs[0], inputs[1], inputs[2], inputs[3], inputs[4], inputs[5]), canvas);
    VanillaTilt.init(canvas, {
        max: 25,
        speed: 600
    });
})

function toggleMenu() {
    let checkbox = document.querySelector("#menuToggle")
    checkbox.checked = !checkbox.checked;
}