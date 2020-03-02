var firebase = require('firebase');

function getUserProducts(req,res){
    let hash = req.query.userid;
    console.log('Hash:    '+hash)
    let arr=[]
    firebase.database().ref('Products/'+hash).once("value",(dataSnapShot)=>{
        dataSnapShot.forEach((innerchild)=>{
            
            let na = innerchild.val().productname;
            let ha = innerchild.val().producthash;
            let det = innerchild.val().productdetails;
            let addr = innerchild.val().productaddress;
            let kk = innerchild.key;
            //console.log(ha)
            arr.push({
                "name":na,
                "hash":ha,
                "details":det,
                "address":addr,
                "key":kk 
            })
        })
    }).then(()=>{
        res.end(JSON.stringify(arr))
        console.log(arr);
    })

     
}


module.exports={
    getuserproducts:getUserProducts
}