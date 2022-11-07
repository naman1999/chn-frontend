const Router = require('express-promise-router')
// var router = express.Router();
const router = new Router()
const db = require('../queries')

module.exports = router;
const pgp = require('pg-promise');
export async function getCachement(long, lat, projection){
    const neo4j = require('neo4j-driver')
  // const native = require('neo4j-driver').toNativeTypes
  const driver = new neo4j.driver("neo4j://localhost:7687", neo4j.auth.basic("neo4j", "sherbrooke"));
  const session = driver.session();
  // easy -71.874358,45.375624
  // -71.79891694,45.14540087  1k
  // -72.0027836,45.2029280
  // -72.0530206,45.2809680   8k
  // HARD -71.8898964,45.4059346  23 k
  // pg routing function to get NHDID for given cordinate
    const cords = [long,lat]
    const params = [long,lat, projection]
    const neo1text = `
    SELECT flow.nhdplusid FROM nhd_flow_catchment as catch, 
    nhdflowlinejoined as flow WHERE ST_Intersects(catch.geom, flow.geom) 
    AND ST_Contains(catch.geom, ST_Point($1,$2, $3)::geometry);`

    var startTime = performance.now()
  try{
    await db.query('BEGIN')
    const resu = await db.query(neo1text, params)
    let geo = resu.rows[0].nhdplusid
    // let geo = Object.values(res[0])
    // geo = geo.toString();
    console.log('\n\nThe catchment NHDID associated to these coordinates:('+cords.toString()+ ') is: '+geo);

    await driver.verifyConnectivity()
    console.log('\nNEO4j Query starting. \nDriver created')
    const result = await session.readTransaction(tx =>
      tx.run(
        `MATCH(s:Segment) WHERE s.NodeID = $nodeid 
        OPTIONAL MATCH (s)-[d:upstream*]->(n) WITH s+COLLECT(DISTINCT n) 
        AS v UNWIND v as a RETURN a.NodeID as NodeID`
        // `MATCH(s:Segment) WHERE s.NodeID = $nodeid 
        // OPTIONAL MATCH (s)-[d:downstream*]->(p) WITH s+COLLECT(DISTINCT p) 
        // AS v UNWIND v as a RETURN a.NodeID as NodeID`
        ,
        { nodeid: ''+geo } 
      )
    ) 
    var arr = []
    const d_area = result.records.map(row =>{
      arr.push(row.get(0))
    })
    // console.log('array of ids:'+arr);    
    // var record = result.records
    // var arr = []
    // for (let i = 0; i < 2; i++) {
    //   singlerecord = record[i]
    //   greeting = singlerecord.get(0)
    //   arr.push(greeting)
    // }
    console.log('\nNumber of catchment: '+arr.length);
    var ids = arr.toString();
    console.log('Drainage area found')
    // console.log('ids: '+ids);
    
    await session.close()
    console.log('Session Closed')
    await driver.close()
    console.log('Driver Closed')

    }
    catch(err){
        console.log(err);
    }
}
