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
        console.log(x,experience)
        return [i,x-experience];
    }
}