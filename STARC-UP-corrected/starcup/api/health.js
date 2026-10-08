const {fetchSheet,objects,nameOf,json,DEFAULTS}=require('./_shared');
module.exports=async(req,res)=>{
  const out=[];
  for(const [label,url] of [['Registration',DEFAULTS.registration],['Round 1',DEFAULTS.round1],['Round 2',DEFAULTS.round2]]){
    try{const rs=objects(await fetchSheet(url)); const names=rs.map(nameOf).filter(Boolean); out.push({label,ok:names.length>0,rows:rs.length,names:names.length,error:names.length?'': 'No usable name column found'});}
    catch(e){out.push({label,ok:false,error:e.message});}
  }
  return json(res,out.every(x=>x.ok)?200:502,{ok:out.every(x=>x.ok),checks:out,serverTime:new Date().toISOString()});
};
