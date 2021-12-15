//const util = require('util');
//const exec = util.promisify(require('child_process').exec);
const { exec, spawn ,execSync} = require('child_process');
const fs = require('fs');
const { executionAsyncId } = require('async_hooks');
const { time } = require('console');

module.exports = {

    submit: async function (arr) {
        file = arr[0]; 
        direct = arr[1];
        const stdout = execSync('leetcode submit '+file).toString();
        await module.exports.deleteFolder(direct);
        console.log('stdout:', stdout);
        return stdout;
    },

    createFile: async function (problem, name, code, ext) {
        var time = await module.exports.createFolder();
        code = code.replaceAll("\"","\\\"");
        cmd = "cd ./"+time+";"+"echo "+"\""+code+"\" > "+problem+"."+ext;
        console.log(cmd);
        execSync(cmd);
        return ["./"+time+"/"+problem+"."+ext,time];
    },

    createFolder: async function () {
        var time = Date.now();
        cmd = 'mkdir '+time;
        execSync(cmd);
        return time;
    },

    deleteFolder: async function (name) {
        execSync("rm -r "+name);
    },

    getDifficulity: async function (name){
        const array = ['Easy','Medium','Hard'];
        for(var i=0;i<3;i++){
            cmd = "leetcode show \""+name+"\" | grep \""+array[i]+"\" | wc -l"
            output = execSync(cmd).toString()
            x = output.slice(-2,-1);
            if(x=='1') return array[i];
        }
    },

    getNumber: async function (name){
        cmd = "leetcode show \""+name+"\" | head -n 1"
        var line = execSync(cmd).toString()
        var i = line.indexOf("\[")
        var j = line.indexOf("\]")
        var number = line.substr(i+1,j-i-1)
        return number
    },

    getPoints: async function (output,name){
        p = {"Easy":1,"Medium":2,"Hard":3};
        out = execSync("echo \""+output+"\" | grep \"Accepted\" | wc -l").toString();
        out = out.slice(-2,-1)
        x = await module.exports.getDifficulity(name);
        if(out=='1') return p[x];
        else return 0;
    }

}