module.exports = {

    levelFunc: function(lvl){
        return Math.ceil(Math.exp(lvl/5.0)+2)
    },

    expToLvl: function(experience){
        var x = 0;
        var i = 0;
        while(x<=experience){
            var fx = module.exports.levelFunc(i)
            x = x +fx
            i += 1
        }
        return [i,x-experience];
    },

    expProgress: function(experience){
        var x = 0;
        var i = 0;
        while(x<=experience){
            var fx = module.exports.levelFunc(i);
            x = x+ fx;
            i+=1;
        }
        return [experience-(x-fx),fx];
    },
    
    progressBar: function(val,maxVal){
        var filled = Math.floor((val/maxVal)*10);
        var bars = "";
        for(var i =0;i<filled;i++){
            bars += "▰";
        }
        for(var i=filled;i<10;i++){
            bars += "▱";
        }
        var percentage = Math.floor(val/maxVal*100);
        return bars+" ["+val+"/"+maxVal+"]";
    },

    ProgressMess: function(experience){
        var x = module.exports.expProgress(experience);
        var y = module.exports.expToLvl(experience);
        return ("Lvl: "+y[0]+" "+module.exports.progressBar(x[0],x[1])+"\n");
    }

}