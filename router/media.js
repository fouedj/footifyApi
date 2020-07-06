const { readFileSync, existsSync } = require('fs');

const mediaRouter=require('express').Router()

mediaRouter.get('/team/:filename',(req,res,next)=>{
    
  const filename=req.params.filename;
  const path=`./images/team/${filename}`;
  console.log(path)
  console.log(path)
    if(existsSync(path)){
        try {
            const data = readFileSync(path);
            console.log({data})
			res.writeHead(200, { 'Content-Type': 'image/jpeg' });
			res.end(data);
		} catch (e) {
			next(e);
		}
	} else {
		res.writeHead(404);
		res.end();
    }
    

})




module.exports=mediaRouter