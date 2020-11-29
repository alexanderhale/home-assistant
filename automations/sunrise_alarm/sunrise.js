var defaultSceneLength = 300;
var scenes = [
    // {
    //     "rgb": [153, 51, 51],
    //     "startBrightness": 15,
    //     "endBrightness": 40,
    //     "seconds": defaultSceneLength
    // },
    // {
    //     "rgb": [120, 20, 0],
    //     "startBrightness": 20,
    //     "endBrightness": 50,
    //     "seconds": defaultSceneLength
    // },
    {
        "rgb": [255,153,0],
        "startBrightness": 20,
        "endBrightness": 60,
        "seconds": defaultSceneLength
    },
    {
        "rgb": [255, 204, 0],
        "startBrightness": 50,
        "endBrightness": 100,
        "seconds": defaultSceneLength
    },
    {
        "rgb": [255, 255, 255],
        "startBrightness": 30,
        "endBrightness": 60,
        "seconds": defaultSceneLength
    }
];

progressThroughScene(0);
function progressThroughScene(index) {
    var scene = scenes[index];
    var updateFrequency = Math.round((scene["seconds"] / (scene["endBrightness"] - scene["startBrightness"])) * 1000);
    var currentBrightness = scene["startBrightness"];

    var timer = setInterval(function () {
        node.send({"payload": {
                     "brightness": currentBrightness, 
                     "r": scene["rgb"][0],
                     "g": scene["rgb"][1],
                     "b": scene["rgb"][2]
                   }});
        if (currentBrightness >= scene["endBrightness"]) {
            clearInterval(timer);
            index++;
            if (index < scenes.length) {
                progressThroughScene(index)
            }
        } else {
            currentBrightness++;
        }
    }, updateFrequency)
}