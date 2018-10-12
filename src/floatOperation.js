"use strict"

// 两个浮点数求和
function accAdd(num1,num2){
    var r1,r2,m;
    try{
        r1 = num1.toString().split('.')[1].length;
    }catch(e){
        r1 = 0;
    }
    try{
        r2=num2.toString().split(".")[1].length;
    }catch(e){
        r2=0;
    }
    m=Math.pow(10,Math.max(r1,r2));
    // return (num1*m+num2*m)/m;
    return Math.round(num1*m+num2*m)/m;
 }
 
 // 两个浮点数相减
 function accSub(num1,num2){
    var r1,r2,m,n;
    try{
        r1 = num1.toString().split('.')[1].length;
    }catch(e){
        r1 = 0;
    }
    try{
        r2=num2.toString().split(".")[1].length;
    }catch(e){
        r2=0;
    }
    m=Math.pow(10,Math.max(r1,r2));
    n=(r1>=r2)?r1:r2;
    return (Math.round(num1*m-num2*m)/m).toFixed(n);
 }
 // 两数相除
 function accDiv(num1,num2){
    var t1,t2,r1,r2;
    try{
        t1 = num1.toString().split('.')[1].length;
    }catch(e){
        t1 = 0;
    }
    try{
        t2=num2.toString().split(".")[1].length;
    }catch(e){
        t2=0;
    }
    r1=Number(num1.toString().replace(".",""));
    r2=Number(num2.toString().replace(".",""));
    return (r1/r2)*Math.pow(10,t2-t1);
 }
 
 function accMul(num1,num2){
    var m=0,s1=num1.toString(),s2=num2.toString(); 
    try{m+=s1.split(".")[1].length}catch(e){};
    try{m+=s2.split(".")[1].length}catch(e){};
    return Number(s1.replace(".",""))*Number(s2.replace(".",""))/Math.pow(10,m);
 }

 module.exports = {
    accAdd,
    accSub,
    accDiv,
    accMul
 };